import { create } from "zustand";
import type { Driver, MaintenanceLog, Trip, Vehicle } from "../types/fleet";

type Kpis = { activeVehicles: number; availableVehicles: number; inMaintenance: number; activeTrips: number; pendingTrips: number; driversOnDuty: number; fleetUtilization: number };
type VehicleInput = Omit<Vehicle, "id" | "odometer" | "status"> & Partial<Pick<Vehicle, "odometer">>;
type VehicleUpdate = Partial<Omit<Vehicle, "id" | "status">>;
type DriverInput = Omit<Driver, "id" | "currentVehicleId"> & Partial<Pick<Driver, "currentVehicleId">>;
type TripInput = Omit<Trip, "id" | "status" | "eta"> & Partial<Pick<Trip, "eta">>;

export type FleetStore = {
  vehicles: Vehicle[]; drivers: Driver[]; trips: Trip[]; maintenanceLogs: MaintenanceLog[];
  addVehicle: (data: VehicleInput) => void; updateVehicle: (id: string, data: VehicleUpdate) => void; deleteVehicle: (id: string) => void; retireVehicle: (id: string) => void;
  addDriver: (data: DriverInput) => void; assignDriverToVehicle: (driverId: string, vehicleId: string) => void;
  createTrip: (data: TripInput) => void; dispatchTrip: (id: string) => void; completeTrip: (id: string) => void; cancelTrip: (id: string) => void;
  openMaintenance: (vehicleId: string, description: string) => void; closeMaintenance: (logId: string, cost: number) => void; getKpis: () => Kpis;
};

const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
// Fleet data starts empty. Records are created through the Fleet Manager screens.
const vehicles: Vehicle[] = [];
const drivers: Driver[] = [];
const trips: Trip[] = [];

export const useFleetStore = create<FleetStore>((set, get) => ({
  vehicles, drivers, trips, maintenanceLogs: [],
  addVehicle: (data) => { if (get().vehicles.some((vehicle) => vehicle.regNumber.toLowerCase() === data.regNumber.trim().toLowerCase())) throw new Error("A vehicle with this registration number already exists."); set((state) => ({ vehicles: [...state.vehicles, { ...data, id: id("vehicle"), odometer: data.odometer ?? 0, status: "Available" }] })); },
  updateVehicle: (vehicleId, data) => set((state) => { const vehicle = state.vehicles.find((item) => item.id === vehicleId); if (!vehicle) throw new Error("Vehicle not found."); const regNumber = data.regNumber?.trim(); if (regNumber && state.vehicles.some((item) => item.id !== vehicleId && item.regNumber.toLowerCase() === regNumber.toLowerCase())) throw new Error("A vehicle with this registration number already exists."); return { vehicles: state.vehicles.map((item) => item.id === vehicleId ? { ...item, ...data, regNumber: regNumber ?? item.regNumber } : item) }; }),
  deleteVehicle: (vehicleId) => set((state) => {
    const vehicle = state.vehicles.find((item) => item.id === vehicleId);
    if (!vehicle) throw new Error("Vehicle not found.");

    return {
      vehicles: state.vehicles.filter((item) => item.id !== vehicleId),
      trips: state.trips.map((trip) => trip.vehicleId === vehicleId && trip.status === "Dispatched" ? { ...trip, status: "Cancelled" } : trip),
      drivers: state.drivers.map((driver) => driver.currentVehicleId === vehicleId ? { ...driver, currentVehicleId: null, status: driver.status === "OnTrip" ? "Available" : driver.status } : driver),
    };
  }),
  retireVehicle: (vehicleId) => set((state) => { const vehicle = state.vehicles.find((item) => item.id === vehicleId); if (!vehicle) throw new Error("Vehicle not found."); if (vehicle.status !== "Available") throw new Error("Only available vehicles can be retired."); return { vehicles: state.vehicles.map((item) => item.id === vehicleId ? { ...item, status: "Retired" } : item) }; }),
  addDriver: (data) => set((state) => {
    const licenseNumber = data.licenseNumber.trim();
    if (state.drivers.some((driver) => driver.licenseNumber.toLowerCase() === licenseNumber.toLowerCase())) throw new Error("A driver with this license number already exists.");
    return { drivers: [...state.drivers, { ...data, id: id("driver"), licenseNumber, status: data.status ?? "Available", currentVehicleId: data.currentVehicleId ?? null }] };
  }),
  assignDriverToVehicle: (driverId, vehicleId) => set((state) => { const driver = state.drivers.find((item) => item.id === driverId); const vehicle = state.vehicles.find((item) => item.id === vehicleId); if (!driver || !vehicle) throw new Error("Driver or vehicle not found."); if (driver.status !== "Available") throw new Error("The selected driver is not available."); if (driver.currentVehicleId) throw new Error("The selected driver is already assigned to a vehicle."); if (vehicle.status !== "Available") throw new Error("The selected vehicle is not available."); return { drivers: state.drivers.map((item) => item.id === driverId ? { ...item, currentVehicleId: vehicleId } : item) }; }),
  createTrip: (data) => set((state) => ({ trips: [...state.trips, { ...data, id: `TR${String(state.trips.length + 1).padStart(3, "0")}`, eta: data.eta ?? "Awaiting dispatch", status: "Draft" }] })),
  dispatchTrip: (tripId) => set((state) => { const trip = state.trips.find((item) => item.id === tripId); if (!trip) throw new Error("Trip not found."); if (trip.status !== "Draft") throw new Error("Only draft trips can be dispatched."); const vehicle = state.vehicles.find((item) => item.id === trip.vehicleId); const driver = state.drivers.find((item) => item.id === trip.driverId); if (!vehicle) throw new Error("The trip vehicle was not found."); if (!driver) throw new Error("The trip driver was not found."); if (vehicle.status !== "Available") throw new Error("Dispatch failed: vehicle is not available."); if (driver.status !== "Available") throw new Error("Dispatch failed: driver is not available."); if (driver.licenseStatus === "Expired" || new Date(driver.licenseExpiry) < new Date()) throw new Error("Dispatch failed: driver license is expired."); if (trip.cargoWeightKg > vehicle.maxLoadKg) throw new Error(`Dispatch failed: cargo exceeds the vehicle capacity of ${vehicle.maxLoadKg} kg.`); return { trips: state.trips.map((item) => item.id === tripId ? { ...item, status: "Dispatched" } : item), vehicles: state.vehicles.map((item) => item.id === vehicle.id ? { ...item, status: "OnTrip" } : item), drivers: state.drivers.map((item) => item.id === driver.id ? { ...item, status: "OnTrip", currentVehicleId: vehicle.id } : item) }; }),
  completeTrip: (tripId) => set((state) => { const trip = state.trips.find((item) => item.id === tripId); if (!trip) throw new Error("Trip not found."); if (trip.status !== "Dispatched") throw new Error("Only dispatched trips can be completed."); return { trips: state.trips.map((item) => item.id === tripId ? { ...item, status: "Completed" } : item), vehicles: state.vehicles.map((item) => item.id === trip.vehicleId ? { ...item, status: "Available" } : item), drivers: state.drivers.map((item) => item.id === trip.driverId ? { ...item, status: "Available" } : item) }; }),
  cancelTrip: (tripId) => set((state) => { const trip = state.trips.find((item) => item.id === tripId); if (!trip) throw new Error("Trip not found."); if (trip.status !== "Dispatched") throw new Error("Only dispatched trips can be cancelled."); return { trips: state.trips.map((item) => item.id === tripId ? { ...item, status: "Cancelled" } : item), vehicles: state.vehicles.map((item) => item.id === trip.vehicleId ? { ...item, status: "Available" } : item), drivers: state.drivers.map((item) => item.id === trip.driverId ? { ...item, status: "Available" } : item) }; }),
  openMaintenance: (vehicleId, description) => set((state) => { const vehicle = state.vehicles.find((item) => item.id === vehicleId); if (!vehicle) throw new Error("Vehicle not found."); if (vehicle.status !== "Available") throw new Error("Only available vehicles can be sent to maintenance."); if (!description.trim()) throw new Error("A maintenance description is required."); return { maintenanceLogs: [...state.maintenanceLogs, { id: id("maintenance"), vehicleId, description: description.trim(), cost: 0, status: "Open", openedAt: new Date().toISOString(), closedAt: null }], vehicles: state.vehicles.map((item) => item.id === vehicleId ? { ...item, status: "InShop" } : item) }; }),
  closeMaintenance: (logId, cost) => set((state) => { const log = state.maintenanceLogs.find((item) => item.id === logId); if (!log) throw new Error("Maintenance log not found."); if (log.status !== "Open") throw new Error("This maintenance log is already closed."); return { maintenanceLogs: state.maintenanceLogs.map((item) => item.id === logId ? { ...item, cost, status: "Closed", closedAt: new Date().toISOString() } : item), vehicles: state.vehicles.map((item) => item.id === log.vehicleId && item.status !== "Retired" ? { ...item, status: "Available" } : item) }; }),
  getKpis: () => { const state = get(); const activeVehicles = state.vehicles.filter((v) => v.status !== "Retired").length; const availableVehicles = state.vehicles.filter((v) => v.status === "Available").length; const inMaintenance = state.vehicles.filter((v) => v.status === "InShop").length; const activeTrips = state.trips.filter((t) => t.status === "Dispatched").length; const pendingTrips = state.trips.filter((t) => t.status === "Draft").length; const driversOnDuty = state.drivers.filter((d) => d.status === "Available" || d.status === "OnTrip").length; return { activeVehicles, availableVehicles, inMaintenance, activeTrips, pendingTrips, driversOnDuty, fleetUtilization: activeVehicles ? Math.round((state.vehicles.filter((v) => v.status === "OnTrip").length / activeVehicles) * 100) : 0 }; },
}));
