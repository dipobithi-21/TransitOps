import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Navigation, Package, Route, Truck } from "lucide-react";
import TripStatusBadge from "./TripStatusBadge";

function CurrentTripPreview({ trip, title = "Current Trip Preview" }) {
  const navigate = useNavigate();

  return (
    <section className="driver-current-card">
      <div className="driver-card-title-row">
        <div>
          <p className="dashboard-eyebrow">{title}</p>
          <h2>{trip.id}</h2>
          <p>{trip.note}</p>
        </div>
        <TripStatusBadge status={trip.status} />
      </div>
      <div className="driver-current-grid">
        <span><Truck size={17} /> Vehicle: {trip.vehicle}</span>
        <span><MapPin size={17} /> Source: {trip.source}</span>
        <span><Navigation size={17} /> Destination: {trip.destination}</span>
        <span><Package size={17} /> Cargo Weight: {trip.cargoWeight}</span>
        <span><Route size={17} /> Planned Distance: {trip.plannedDistance}</span>
        <span>Status: {trip.status}</span>
      </div>
      <button className="complete-trip-button" type="button" onClick={() => navigate("/dashboard/current-trip")}>
        Continue Trip <ArrowRight size={18} />
      </button>
    </section>
  );
}

export default CurrentTripPreview;
