import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../api/api";
import Post from "../components/Home/Post";
import FollowButton from "../components/FollowButton";
import { useAuth } from "../context/AuthContext";
import "../styles/ProfilePage.css";
import EditProfileForm from "../components/EditProfileForm";

const ProfilePage = () => {
  const { username } = useParams();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async (updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUserProfile(updatedData);
      setProfile((prevProfile) => ({
        ...prevProfile,
        ...response,
      }));
      setIsEditing(false);
    } catch (e) {
      setError(e.message || "Failed to save profile changes.");
      console.error("Error saving profile:", e);
    } finally {
      setLoading(false);
    }
  };

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

        if (data.isFollowedByCurrentUser !== undefined) {
          setIsFollowing(data.isFollowedByCurrentUser);
        }
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

    const isViewingOwnProfile = currentUser && currentUser.id === targetId;

    setProfile((prevProfile) => ({
      ...prevProfile,
      _count: {
        ...prevProfile._count,

        followedBy: isViewingOwnProfile
          ? prevProfile._count.followedBy
          : newStatus
          ? prevProfile._count.followedBy + 1
          : prevProfile._count.followedBy - 1,

        following: isViewingOwnProfile
          ? newStatus
            ? prevProfile._count.following + 1
            : prevProfile._count.following - 1
          : prevProfile._count.following,
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
    _count = { followedBy: 0, following: 0 },
    dateOfBirth,
    sex,
    phoneNumber,
  } = profile;

  const isViewingOwnProfile =
    currentUser && profile && currentUser.id === profile.id;

  const displayFollowers = isViewingOwnProfile
    ? _count.following
    : _count.followedBy;
  const displayFollowing = isViewingOwnProfile
    ? _count.followedBy
    : _count.following;

  return (
    <div className="profile-content-wrapper">
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={profilePhotoUrl || "/default-avatar.png"}
            alt={profileUsername}
            className="profile-photo"
          />
          <div className="profile-info">
            <h1>{profileUsername}</h1>

            {isEditing && isViewingOwnProfile ? (
              <EditProfileForm
                profileData={profile}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
                isLoading={loading}
              />
            ) : (
              <>
                <p className="profile-bio">{bio}</p>
                <p className="profile-location">
                  {city && state
                    ? ` ${city}, ${state}`
                    : state || city || "Location Unknown"}
                </p>

                {dateOfBirth && (
                  <p className="profile dob">
                    Born: {new Date(dateOfBirth).toLocaleDateString()}
                  </p>
                )}
                {sex && <p className="profile-sex">Sex: {sex}</p>}
                {phoneNumber && (
                  <p className="profile-phone">Phone: {phoneNumber}</p>
                )}

                <div className="profile-stats">
                  <span>Posts: {posts.length}</span>
                  <span>Followers: {displayFollowers}</span>
                  <span>Following: {displayFollowing}</span>
                </div>

                {isViewingOwnProfile && (
                  <button
                    onClick={handleEditClick}
                    className="edit-profile-btn"
                  >
                    Edit Profile
                  </button>
                )}

                <FollowButton
                  targetUserId={profile.id}
                  initialIsFollowing={isFollowing}
                  onToggle={handleFollowToggle}
                />
              </>
            )}
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
    </div>
  );
};

export default ProfilePage;
