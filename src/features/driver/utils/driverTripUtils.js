export const getCurrentTrip = (data) => data.trips.find((trip) => trip.id === data.currentTripId);

export const filterTripsByStatus = (trips, filter) => {
  if (filter === "All") return trips;
  return trips.filter((trip) => trip.status === filter);
};
