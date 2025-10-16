import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../api/api";
import "../styles/Navbar.css";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

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

  const profilePhoto = currentUser?.profilePhotoUrl || "/default-avatar.png";
  const profilePath = `/profile/${currentUser?.username}`;

  return (
    <header className="navbar-container">
      <nav className="navbar-content-wrapper">
        <div className="navbar-left">
          <Link to={"/"} className="navbar-logo">
            Gatherly
          </Link>
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
