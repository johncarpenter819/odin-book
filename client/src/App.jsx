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
// import Profile from "./pages/Profile";

const App = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== "/register";

  return (
    <div className="app-layout">
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/profile/:username" element={<Profile />} /> */}
      </Routes>
    </div>
  );
};

export default App;
