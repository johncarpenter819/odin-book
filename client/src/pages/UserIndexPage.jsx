import React, { useState, useEffect } from "react";
import { getAllUsers } from "../api/api";
import FollowButton from "../components/FollowButton";

const UserIndexPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersList = await getAllUsers();
        setUsers(usersList);
      } catch (e) {
        setError("Failed to load users. Please log in.");
        console.error("Error fetching all users:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleFollowToggle = (userId, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isFollowing: newStatus } : user
      )
    );
  };

  if (loading)
    return <div className="user-index-loading">Loading users...</div>;
  if (error) return <div className="user-index-error">{error}</div>;

  return (
    <div className="user-index-container">
      <h2>People You Can Follow</h2>
      <div className="user-list">
        {user.map((user) => (
          <div key={user.id} className="user-card">
            <img
              src={user.profilePhotoUrl || "/default-avatar.png"}
              alt={user.username}
              className="user-avatar"
            />
            <span className="user-username">{user.username}</span>
            <FollowButton
              targetUserId={user.id}
              initialIsFollowing={user.isFollowing}
              onToggle={handleFollowToggle}
            />
          </div>
        ))}
        {users.length === 0 && <p>No other users found.</p>}
      </div>
    </div>
  );
};

export default UserIndexPage;
