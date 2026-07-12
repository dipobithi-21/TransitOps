import { Clock, MapPin, Package, Truck } from "lucide-react";
import TripStatusBadge from "./TripStatusBadge";

function TripCard({ trip }) {
  return (
    <article className="driver-trip-card">
      <div className="trip-card-top">
        <div>
          <strong>{trip.id}</strong>
          <span>{trip.date}</span>
        </div>
        <TripStatusBadge status={trip.status} />
      </div>
      <h3>{trip.route}</h3>
      <div className="trip-card-details">
        <span><Truck size={16} /> {trip.vehicle}</span>
        <span><Package size={16} /> {trip.cargo}</span>
        <span><Clock size={16} /> {trip.eta}</span>
        <span><MapPin size={16} /> {trip.priority} priority</span>
      </div>
    </article>
  );
}

export default TripCard;
