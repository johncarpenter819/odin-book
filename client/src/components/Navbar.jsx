import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../api/api";
import "../styles/Navbar.css";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      logout();
      navigate("/");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
    }
    setSearchQuery("");
  };

  const profilePhoto = currentUser?.profilePhotoUrl || "/default-avatar.png";
  const profilePath = `/profile/${currentUser?.username}`;

  return (
    <header className="navbar-container">
      <nav className="navbar-content-wrapper">
        <div className="navbar-left">
          <Link to={"/home"} className="navbar-logo">
            Gatherly
          </Link>
        </div>

        <div className="navbar-center">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search Gatherly..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <span role="img" aria-label="search">
                🔍
              </span>
            </button>
          </form>
        </div>

        <div className="navbar-right">
          {currentUser ? (
            <>
              <Link to={profilePath} className="nav-profile-link">
                <img
                  src={profilePhoto}
                  alt={`${currentUser.username}'s avatar`}
                  className="navbar-avatar"
                />
                <span className="nav-username">{currentUser.username}</span>
              </Link>
              <button onClick={handleLogout} className="nav-btn nav-logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="nav-btn nav-register-btn">
                Register
              </Link>
              <Link to="/" className="nav-btn nav-login-btn">
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
