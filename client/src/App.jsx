import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import UserIndexPage from "./pages/UserIndexPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/register";

  return (
    <div className="app-layout">
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<UserIndexPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default App;
