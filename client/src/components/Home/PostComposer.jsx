import React from "react";
import { useAuth } from "../../context/AuthContext";

const PostComposer = ({ onOpenModal }) => {
  const { currentUser } = useAuth();
  const profilePhoto = currentUser?.profilePhotoUrl || "/default-avatar.png";
  const username = currentUser?.username || "User";
  return (
    <div className="post-composer-card">
      <div className="composer-header">
        <img
          src={profilePhoto}
          alt={`${username}'s Avatar`}
          className="composer-avatar"
        />
        <div className="composer-input-field" onClick={onOpenModal}>
          {`What's on your mind, ${username}?`}
        </div>
      </div>

      <hr className="composer-divider" />

      <div className="composer-options-bar">
        <button className="option-btn live-video">🔴 Live Video</button>
        <button className="option-btn photo-video" onClick={onOpenModal}>
          📸 Photo/Video
        </button>
        <button className="option-btn activity">😃 Feeling/Activity</button>
      </div>
    </div>
  );
};

export default PostComposer;
