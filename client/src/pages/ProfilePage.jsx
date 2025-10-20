import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../api/api";
import Post from "../components/Home/Post";
import FollowButton from "../components/FollowButton";
import { useAuth } from "../context/AuthContext";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { username } = useParams();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      setError("Invalid or missing username in the URL.");
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserProfile(username);
        setProfile(data);
      } catch (e) {
        setError("Failed to load profile.");
        console.error("Error fetching user profile:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleFollowToggle = (targetId, newStatus) => {
    setIsFollowing(newStatus);
    setProfile((prevProfile) => ({
      ...prevProfile,
      _count: {
        ...prevProfile._count,
        followedBy: newStatus
          ? prevProfile._count.followedBy + 1
          : prevProfile._count.followedBy - 1,
      },
    }));
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!profile) return <div className="profile-error">Profile not found.</div>;

  const {
    username: profileUsername,
    bio,
    profilePhotoUrl,
    city,
    state,
    posts,
    _count,
  } = profile;

  const initialFollowState = false;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={profilePhotoUrl || "/default-avatar.png"}
          alt={profileUsername}
          className="profile-photo"
        />
        <div className="profile-info">
          <h1>{profileUsername}</h1>
          <p className="profile-bio">{bio}</p>
          <p className="profile-location">
            {city && state ? `${state}` : "Location Unknown"}
          </p>

          <div className="profile-stats">
            <span>Posts: {posts.length}</span>
            <span>Followers: {_count.followedBy}</span>
            <span>Following: {_count.following}</span>
          </div>

          <FollowButton
            targetUserId={profile.id}
            initialIsFollowing={initialFollowState}
            onToggle={handleFollowToggle}
          />
        </div>
      </div>

      <div className="profile-posts-section">
        <h2>{profileUsername}'s Posts</h2>
        {posts.length > 0 ? (
          <div className="post-list">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p>{profileUsername} hasn't posted anything yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
