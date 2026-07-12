import { useState } from "react";
import { useDriver } from "../state/DriverContext";

const validateProfile = (profile) => {
  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (profile.phone.trim().length < 8) {
    errors.phone = "Phone number is too short.";
  }
  if (profile.emergencyContact.trim().length < 2) {
    errors.emergencyContact = "Emergency contact is required.";
  }
  if (profile.profilePicture && !/^https?:\/\/.+/i.test(profile.profilePicture)) {
    errors.profilePicture = "Use a valid image URL starting with http:// or https://.";
  }
  return errors;
};

function DriverProfile() {
  const { state, dispatch } = useDriver();
  const [profile, setProfile] = useState({
    email: state.profile.email,
    phone: state.profile.phone,
    emergencyContact: state.profile.emergencyContact,
    profilePicture: state.profile.profilePicture,
  });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    const nextErrors = validateProfile(profile);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    dispatch({ type: "UPDATE_PROFILE", payload: profile });
  };

  return (
    <section className="driver-page">
      <form className="driver-profile-card" onSubmit={handleSave}>
        <div className="driver-section-heading">
          <p className="dashboard-eyebrow">Driver Profile</p>
          <h2>{state.profile.name}</h2>
          <p>Only contact details can be edited in the frontend demo. Driver ID, license details, safety score, and status are read-only.</p>
        </div>

        <div className="profile-avatar-row">
          <div className="profile-avatar">{state.profile.name.slice(0, 2).toUpperCase()}</div>
          <label>
            Profile Picture URL
            <input value={profile.profilePicture} onChange={(event) => updateField("profilePicture", event.target.value)} placeholder="Optional image URL" />
            {errors.profilePicture && <small className="field-error">{errors.profilePicture}</small>}
          </label>
        </div>

        <div className="profile-grid">
          <label>
            Email
            <input type="email" value={profile.email} onChange={(event) => updateField("email", event.target.value)} />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </label>
          <label>
            Phone Number
            <input value={profile.phone} onChange={(event) => updateField("phone", event.target.value)} />
            {errors.phone && <small className="field-error">{errors.phone}</small>}
          </label>
          <label>
            Emergency Contact
            <input value={profile.emergencyContact} onChange={(event) => updateField("emergencyContact", event.target.value)} />
            {errors.emergencyContact && <small className="field-error">{errors.emergencyContact}</small>}
          </label>
        </div>

        <div className="profile-readonly">
          <span>Driver ID <strong>{state.profile.id}</strong></span>
          <span>Driver Name <strong>{state.profile.name}</strong></span>
          <span>License Number <strong>{state.profile.licenseNumber}</strong></span>
          <span>License Category <strong>{state.profile.licenseCategory}</strong></span>
          <span>License Expiry Date <strong>{state.profile.licenseExpiryDate}</strong></span>
          <span>Safety Score <strong>{state.profile.safetyScore}%</strong></span>
          <span>Current Status <strong>{state.profile.currentStatus}</strong></span>
        </div>

        <button className="complete-trip-button" type="submit">Save Changes</button>
      </form>
    </section>
  );
}

export default DriverProfile;
