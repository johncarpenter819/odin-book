import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const LeftSidebar = () => {
  const { currentUser } = useAuth();

  const userProfileLink = currentUser
    ? {
        name: currentUser.username,
        iconUrl: currentUser.profilePhotoUrl || "/default-avatar.png",
        path: `/profile/${currentUser.username}`,
        type: "user",
      }
    : { name: "Log In", icon: "🔑", path: "/", type: "icon" };

  return (
    <div className="left-sidebar">
      <Link to={userProfileLink.path} className="sidebar-link">
        {userProfileLink.type === "user" && (
          <img
            src={userProfileLink.iconUrl}
            alt={`${userProfileLink.name}'s avatar`}
            className="sidebar-avatar"
          />
        )}
        <span className="link-text">{userProfileLink.name}</span>
      </Link>
    </div>
  );
};

export default LeftSidebar;
