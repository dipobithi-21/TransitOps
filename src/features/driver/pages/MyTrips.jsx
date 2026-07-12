import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DriverTripTable from "../components/DriverTripTable";
import { filterTripsByStatus } from "../utils/driverTripUtils";
import { useDriver } from "../state/DriverContext";

const tripFilters = ["All", "Upcoming", "Active", "Completed", "Cancelled"];

function MyTrips() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const { selectors } = useDriver();
  const filteredTrips = useMemo(() => filterTripsByStatus(selectors.assignedTrips, activeFilter), [activeFilter, selectors.assignedTrips]);

  return (
    <section className="driver-page">
      <div className="driver-section-heading">
        <p className="dashboard-eyebrow">Assigned Work</p>
        <h2>My Trips</h2>
        <p>All trips assigned to this driver, grouped by operational status.</p>
      </div>

      <div className="driver-filter-bar" aria-label="Trip filters">
        {tripFilters.map((filter) => (
          <button
            type="button"
            className={activeFilter === filter ? "active" : ""}
            onClick={() => setActiveFilter(filter)}
            key={filter}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredTrips.length > 0 ? (
        <DriverTripTable trips={filteredTrips} onViewTrip={(trip) => navigate(trip.status === "Active" ? "/dashboard/current-trip" : "/dashboard/trip-history")} />
      ) : (
        <div className="driver-empty-state">No trips found for this filter.</div>
      )}
    </section>
  );
}

export default MyTrips;
