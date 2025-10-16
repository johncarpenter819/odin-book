import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStories } from "../../api/api";

const StoryTray = () => {
  const { currentUser } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getStories();
        setStories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const currentUserStoryTile = {
    user: currentUser?.username || "You",
    imageUrl: currentUser?.profilePhotoUrl || "/default-avatar.png",
    isCreator: true,
  };

  if (loading) {
    return <div className="story-tray-container">Loading Stories...</div>;
  }

  return (
    <div className="story-tray-container">
      <div className="story-tile create-story">
        <img
          src={currentUserStoryTile.imageUrl}
          alt="Create Story"
          className="story-user-avatar"
        />
        <div className="create-icon">+</div>
        <span className="story-user-name">Create Story</span>
      </div>
      {stories?.map((story) => (
        <div key={story.id} className="story-tile user-story">
          <img
            src={story.mediaUrl}
            alt={`${story.user.username}'s Story`}
            className="story-media"
          />
          <img
            src={story.user.profilePhotoUrl}
            alt={story.user.username}
            className="story-user-avatar"
          />
          <span className="story-user-name">{story.user.username}</span>
        </div>
      ))}
    </div>
  );
};

export default StoryTray;
