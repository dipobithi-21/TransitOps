/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useReducer } from "react";
import { driverMockData } from "../data/driverMockData";

const DriverContext = createContext(null);
const nowLabel = () => "Just now";

const createNotification = ({ title, message, type }) => ({
  id: `NT-${Date.now()}`,
  title,
  message,
  type,
  time: nowLabel(),
  read: false,
});

const initialState = {
  profile: driverMockData.driver,
  currentStatus: driverMockData.currentStatus,
  trips: driverMockData.trips,
  currentTripId: driverMockData.currentTripId,
  checkpoints: driverMockData.checkpoints,
  notifications: driverMockData.notifications.map((notification) => ({ ...notification, read: false })),
  toast: null,
  isLoading: false,
};

function driverReducer(state, action) {
  switch (action.type) {
    case "COMPLETE_TRIP": {
      const trip = state.trips.find((item) => item.id === action.tripId);
      if (!trip || trip.status !== "Active") return state;

      return {
        ...state,
        currentTripId: null,
        profile: { ...state.profile, currentStatus: "Available" },
        trips: state.trips.map((item) =>
          item.id === action.tripId ? { ...item, status: "Completed", date: nowLabel(), completedAt: nowLabel(), eta: "Completed" } : item,
        ),
        checkpoints: state.checkpoints.map((checkpoint) => ({
          ...checkpoint,
          status: "Completed",
          time: checkpoint.time === "Pending" ? nowLabel() : checkpoint.time,
        })),
        notifications: [
          createNotification({ title: "Trip completed", message: `${trip.id} was marked completed.`, type: "Success" }),
          ...state.notifications,
        ],
        toast: { type: "success", message: `${trip.id} completed successfully.` },
      };
    }
    case "CANCEL_TRIP": {
      const trip = state.trips.find((item) => item.id === action.tripId);
      if (!trip || trip.status !== "Active") return state;

      return {
        ...state,
        currentTripId: null,
        profile: { ...state.profile, currentStatus: "Available" },
        trips: state.trips.map((item) =>
          item.id === action.tripId
            ? { ...item, status: "Cancelled", date: nowLabel(), completedAt: nowLabel(), eta: "Cancelled", cancellationReason: "Cancelled by driver" }
            : item,
        ),
        notifications: [
          createNotification({ title: "Trip cancelled", message: `${trip.id} was cancelled and moved to history.`, type: "Warning" }),
          ...state.notifications,
        ],
        toast: { type: "success", message: `${trip.id} cancelled.` },
      };
    }
    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
        notifications: [
          createNotification({ title: "Profile updated", message: "Your contact profile was updated for this session.", type: "Profile" }),
          ...state.notifications,
        ],
        toast: { type: "success", message: "Profile changes saved." },
      };
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.id ? { ...notification, read: true } : notification,
        ),
      };
    case "DISMISS_NOTIFICATION":
      return { ...state, notifications: state.notifications.filter((notification) => notification.id !== action.id) };
    case "CLEAR_TOAST":
      return { ...state, toast: null };
    default:
      return state;
  }
}

const buildSelectors = (state) => {
  const activeTrips = state.trips.filter((trip) => trip.status === "Active");
  const upcomingTrips = state.trips.filter((trip) => trip.status === "Upcoming");
  const completedTrips = state.trips.filter((trip) => trip.status === "Completed");
  const cancelledTrips = state.trips.filter((trip) => trip.status === "Cancelled");
  const currentTrip = state.trips.find((trip) => trip.id === state.currentTripId && trip.status === "Active") ?? null;
  const historyTrips = state.trips.filter((trip) => ["Completed", "Cancelled"].includes(trip.status));

  return {
    activeTrips,
    upcomingTrips,
    completedTrips,
    cancelledTrips,
    currentTrip,
    historyTrips,
    assignedTrips: state.trips,
    unreadCount: state.notifications.filter((notification) => !notification.read).length,
    kpis: [
      { label: "Assigned Trips", value: String(state.trips.length), detail: `${activeTrips.length} active now`, tone: "blue" },
      { label: "Current Status", value: currentTrip ? "On Trip" : "Available", detail: currentTrip?.id ?? "No active trip", tone: currentTrip ? "green" : "teal" },
      { label: "Upcoming Trips", value: String(upcomingTrips.length), detail: upcomingTrips[0] ? `Next ${upcomingTrips[0].dispatchTime}` : "No upcoming trips", tone: "yellow" },
      { label: "Trips Completed", value: String(completedTrips.length), detail: `${cancelledTrips.length} cancelled`, tone: "teal" },
    ],
  };
};

export function DriverProvider({ children }) {
  const [state, dispatch] = useReducer(driverReducer, initialState);
  const selectors = useMemo(() => buildSelectors(state), [state]);
  const value = useMemo(() => ({ state, dispatch, selectors }), [state, selectors]);

  return <DriverContext.Provider value={value}>{children}</DriverContext.Provider>;
}

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error("useDriver must be used inside DriverProvider");
  }
  return context;
};

export const useDriverOptional = () => useContext(DriverContext);
