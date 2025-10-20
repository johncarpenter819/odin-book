import React, { useState } from "react";
import { createPost } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/CreatePostModal.css";

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const newPost = await createPost({ content });

      onPostCreated(newPost);

      onClose();
    } catch (err) {
      console.error("Post creation failed:", err);
      setError(err.message || "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isPostDisabled = content.trim().length === 0 || isLoading;

  const profilePhoto = currentUser?.profilePhotoUrl || "/default-avatar.png";
  const username = currentUser?.username || "Guest";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Post</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="post-creator-info">
          <img src={profilePhoto} alt={username} className="creator-avatar" />
          <div className="creator-details">
            <span className="creator-username">{username}</span>
            <span className="post-privacy-toggle">Friends ▼</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="post-form">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${currentUser?.username}?`}
            rows="5"
            disabled={isLoading}
            autoFocus
            className="post-input"
          />

          {error && <p className="form-error"></p>}

          <div className="post-media-options">
            <span>Add to your post</span>
            <div className="media-icons">
              <span className="icon-placeholder green">🖼️</span>
              <span className="icon-placeholder blue">👥</span>
              <span className="icon-placeholder yellow">😊</span>
              <span className="icon-placeholder red">📍</span>
              <span className="icon-placeholder gray">GIF</span>
            </div>
          </div>

          <button
            type="submit"
            className="post-button"
            disabled={isPostDisabled}
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
