const statusClassMap = {
  Active: "status-progress",
  "In Progress": "status-progress",
  Assigned: "status-assigned",
  Upcoming: "status-scheduled",
  Scheduled: "status-scheduled",
  Completed: "status-completed",
  Done: "status-completed",
  Pending: "status-pending",
  Cancelled: "status-cancelled",
};

function TripStatusBadge({ status }) {
  return <span className={`trip-status ${statusClassMap[status] ?? "status-pending"}`}>{status}</span>;
}

export default TripStatusBadge;
