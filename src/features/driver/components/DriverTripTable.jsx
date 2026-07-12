import TripStatusBadge from "./TripStatusBadge";

function DriverTripTable({ trips, showDate = false, actionLabel = "View Trip", onViewTrip }) {
  return (
    <div className="dashboard-table-card driver-history-table">
      <div className="dashboard-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Trip ID</th>
              {showDate && <th>Date</th>}
              <th>Vehicle</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Cargo Weight</th>
              <th>Planned Distance</th>
              <th>Status</th>
              <th>{actionLabel}</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td><strong>{trip.id}</strong></td>
                {showDate && <td>{trip.date}</td>}
                <td>{trip.vehicle}</td>
                <td>{trip.source}</td>
                <td>{trip.destination}</td>
                <td>{trip.cargoWeight}</td>
                <td>{trip.plannedDistance}</td>
                <td><TripStatusBadge status={trip.status} /></td>
                <td>
                  <button className="table-action-button" type="button" onClick={() => onViewTrip?.(trip)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DriverTripTable;
