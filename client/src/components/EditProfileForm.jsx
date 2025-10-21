import React, { useState, useEffect } from "react";
import "../styles/EditProfileForm.css";

const EditProfileForm = ({ profileData, onSave, onCancel, isLoading }) => {
  const [bio, setBio] = useState(profileData.bio || "");
  const [city, setCity] = useState(profileData.city || "");
  const [state, setState] = useState(profileData.state || "");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(
    profileData.profilePhotoUrl || ""
  );

  useEffect(() => {
    setBio(profileData.bio || "");
    setCity(profileData.city || "");
    setState(profileData.state || "");
    setProfilePhotoUrl(profileData.profilePhotoUrl || "");
  }, [profileData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ bio, city, state, profilePhotoUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="edit-profile-form">
      <div>
        <label>Profile Picture URL:</label>
        <input
          type="text"
          value={profilePhotoUrl}
          onChange={(e) => setProfilePhotoUrl(e.target.value)}
          placeholder="Enter image URL"
          disabled={isLoading}
        />
        {profilePhotoUrl && <img src={profilePhotoUrl} alt="Preview" />}
      </div>
      <div>
        <label>Bio:</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows="3"
          placeholder="Tell us about you!"
          disabled={isLoading}
        ></textarea>
      </div>
      <div>
        <label>City:</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          disabled={isLoading}
        />
      </div>
      <div>
        <label>State:</label>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
          disabled={isLoading}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
      <button type="button" onClick={onCancel} disabled={isLoading}>
        Cancel
      </button>
    </form>
  );
};

export default EditProfileForm;
