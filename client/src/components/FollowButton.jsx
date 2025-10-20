import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toggleFollow } from "../api/api";

const FollowButton = ({ targetUserId, initialIsFollowing, onToggle }) => {
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  if (currentUser && currentUser.id === targetUserId) {
    return null;
  }

  const handleToggle = async () => {
    if (!currentUser) {
      alert("You must be logged in to follow users.");
      return;
    }

    setIsLoading(true);
    const newFollowStatus = !isFollowing;

    setIsFollowing(newFollowStatus);

    try {
      const response = await toggleFollow(targetUserId);

      if (onToggle) {
        onToggle(targetUserId, newFollowStatus);
      }

      console.log(`User ${response.action} target user ${targetUserId}`);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      setIsFollowing(!newFollowStatus);
      alert("Failed to change follow status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = isLoading
    ? isFollowing
      ? "Unfollowing..."
      : "Following..."
    : isFollowing
    ? "Unfollow"
    : "Follow";

  const buttonClass = isFollowing ? "follow-btn unfollow" : "follow-btn follow";

  return (
    <button className={buttonClass} onClick={handleToggle} disabled={isLoading}>
      {buttonText}
    </button>
  );
};

export default FollowButton;
