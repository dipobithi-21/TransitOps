import { useNavigate } from "react-router-dom";
import DriverMetricGrid from "../components/DriverMetricGrid";
import DriverNotifications from "../components/DriverNotifications";
import DriverTripTable from "../components/DriverTripTable";
import CurrentTripPreview from "../components/CurrentTripPreview";
import TripStatusBadge from "../components/TripStatusBadge";
import { useDriver } from "../state/DriverContext";

function DriverDashboard() {
  const navigate = useNavigate();
  const { state, selectors } = useDriver();
  const assignedTableTrips = state.trips.filter((trip) => ["Active", "Upcoming"].includes(trip.status)).slice(0, 5);
  const recentTrips = state.trips.slice(0, 5);

  return (
    <div className="driver-page">
      {state.isLoading && <div className="driver-empty-state">Loading driver dashboard...</div>}
      <DriverMetricGrid metrics={selectors.kpis} />

      <section className="driver-dashboard-grid">
        <article className="driver-info-panel">
          <p className="dashboard-eyebrow">Current Status</p>
          <h2>{selectors.currentTrip ? "On Trip" : "Available"}</h2>
          <p>{selectors.currentTrip ? state.currentStatus.location : "No active trip assigned right now."}</p>
          <div className="driver-panel-facts">
            <span>Last updated <strong>{state.currentStatus.lastUpdated}</strong></span>
            <span>Duty window <strong>{state.currentStatus.dutyWindow}</strong></span>
          </div>
        </article>

        <article className="driver-info-panel">
          <p className="dashboard-eyebrow">Active Trip</p>
          {selectors.currentTrip ? (
            <>
              <h2>{selectors.currentTrip.id}</h2>
              <p>{selectors.currentTrip.source} to {selectors.currentTrip.destination}</p>
              <TripStatusBadge status={selectors.currentTrip.status} />
            </>
          ) : (
            <div className="driver-empty-state compact">No current trip.</div>
          )}
        </article>

        <article className="driver-info-panel">
          <p className="dashboard-eyebrow">Upcoming Trips</p>
          <h2>{selectors.upcomingTrips.length}</h2>
          <p>{selectors.upcomingTrips[0] ? `Next: ${selectors.upcomingTrips[0].id} at ${selectors.upcomingTrips[0].dispatchTime}` : "No upcoming trips."}</p>
        </article>

        <article className="driver-info-panel">
          <p className="dashboard-eyebrow">Trips Completed</p>
          <h2>{selectors.completedTrips.length}</h2>
          <p>Recent completed and closed trips from history.</p>
        </article>
      </section>

      <section className="driver-section-heading">
        <p className="dashboard-eyebrow">Assigned Trips Table</p>
        <h2>Assigned Trips</h2>
        <p>Driver can view assigned trips and open details. No trip creation, dispatch, or assignment actions are available.</p>
      </section>
      <DriverTripTable trips={assignedTableTrips} onViewTrip={() => navigate("/dashboard/current-trip")} />

      <section className="driver-section-heading">
        <p className="dashboard-eyebrow">Recent Trips</p>
        <h2>Latest Activity</h2>
        <p>Updates automatically when trips are completed or cancelled.</p>
      </section>
      <DriverTripTable trips={recentTrips} onViewTrip={() => navigate("/dashboard/my-trips")} />

      <section className="driver-dashboard-lower">
        {selectors.currentTrip ? <CurrentTripPreview trip={selectors.currentTrip} /> : <div className="driver-empty-state">No current trip preview available.</div>}
        <DriverNotifications />
      </section>
    </div>
  );
}

export default DriverDashboard;
