import { useMemo, useState } from "react";
import DriverTripTable from "../components/DriverTripTable";
import { useDriver } from "../state/DriverContext";

const historyFilters = ["All", "Completed", "Cancelled"];

function TripHistory() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { selectors } = useDriver();

  const filteredHistory = useMemo(() => {
    return selectors.historyTrips.filter((trip) => {
      const matchesStatus = statusFilter === "All" || trip.status === statusFilter;
      const haystack = `${trip.id} ${trip.source} ${trip.destination} ${trip.vehicle}`.toLowerCase();
      return matchesStatus && haystack.includes(query.trim().toLowerCase());
    });
  }, [query, selectors.historyTrips, statusFilter]);

  return (
    <section className="driver-page">
      <div className="driver-section-heading">
        <p className="dashboard-eyebrow">Past Work</p>
        <h2>Trip History</h2>
        <p>Completed and cancelled trips for this driver.</p>
      </div>

      <div className="driver-history-controls">
        <input
          type="search"
          placeholder="Search by trip, source, destination, vehicle..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          {historyFilters.map((filter) => (
            <option value={filter} key={filter}>{filter}</option>
          ))}
        </select>
      </div>

      {filteredHistory.length > 0 ? <DriverTripTable trips={filteredHistory} showDate /> : <div className="driver-empty-state">No trip history matches your search.</div>}
    </section>
  );
}

export default TripHistory;
