import { useState } from "react";
import { CheckCircle2, Clock3, MapPin, Navigation, Package, Route, Truck } from "lucide-react";
import TripStatusBadge from "../components/TripStatusBadge";
import { useDriver } from "../state/DriverContext";

function CurrentTrip() {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { state, selectors, dispatch } = useDriver();
  const currentTrip = selectors.currentTrip;

  if (!currentTrip) {
    return (
      <section className="driver-page">
        <div className="driver-empty-state">
          <h2>No Current Trip</h2>
          <p>Completed or cancelled trips will appear in Trip History.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="driver-page">
      <div className="driver-current-detail">
        <div className="driver-card-title-row">
          <div className="driver-section-heading">
            <p className="dashboard-eyebrow">Current Trip</p>
            <h2>{currentTrip.id}</h2>
            <p>{currentTrip.note}</p>
          </div>
          <TripStatusBadge status={currentTrip.status} />
        </div>

        <div className="current-trip-facts">
          <span><Truck size={18} /> Vehicle: {currentTrip.vehicle}</span>
          <span><MapPin size={18} /> Source: {currentTrip.source}</span>
          <span><Navigation size={18} /> Destination: {currentTrip.destination}</span>
          <span><Package size={18} /> Cargo Weight: {currentTrip.cargoWeight}</span>
          <span><Route size={18} /> Planned Distance: {currentTrip.plannedDistance}</span>
          <span><Clock3 size={18} /> Dispatch Time: {currentTrip.dispatchTime}</span>
          <span>Current Status: {currentTrip.status}</span>
        </div>

        <div className="driver-action-row">
          <button className="complete-trip-button" type="button" onClick={() => dispatch({ type: "COMPLETE_TRIP", tripId: currentTrip.id })}>
            <CheckCircle2 size={19} />
            Complete Trip
          </button>
          <button className="cancel-trip-button" type="button" onClick={() => setShowCancelConfirm(true)}>
            Cancel Trip
          </button>
        </div>
      </div>

      <div className="checkpoint-list">
        {state.checkpoints.map((checkpoint, index) => (
          <article key={checkpoint.label}>
            <span>{index + 1}</span>
            <div>
              <strong>{checkpoint.label}</strong>
              <small>{checkpoint.time}</small>
            </div>
            <TripStatusBadge status={checkpoint.status} />
          </article>
        ))}
      </div>

      {showCancelConfirm && (
        <div className="confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="cancel-trip-title">
          <div className="confirm-dialog">
            <h2 id="cancel-trip-title">Cancel current trip?</h2>
            <p>This will move {currentTrip.id} to Trip History as Cancelled and remove it from Current Trip.</p>
            <div className="driver-action-row">
              <button
                className="cancel-trip-button"
                type="button"
                onClick={() => {
                  dispatch({ type: "CANCEL_TRIP", tripId: currentTrip.id });
                  setShowCancelConfirm(false);
                }}
              >
                Yes, Cancel Trip
              </button>
              <button className="secondary-action-button" type="button" onClick={() => setShowCancelConfirm(false)}>
                Keep Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CurrentTrip;
