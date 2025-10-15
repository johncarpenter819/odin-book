import React, { useState } from "react";
import { registerUser, loginUser } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    sex: "",
    city: "",
    state: "",
    phoneNumber: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Error: Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const data = await registerUser(formData);

      setMessage(`Success: User ${data.user.username} created!`);
    } catch (error) {
      console.error("Registration Error:", error.message);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-page">
        <div className="register-image">
          <img src="/register-bg.webp" alt="Register Background" />
        </div>
        <div className="register-container">
          <h2 className="register-title">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <FormInput
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            <FormSelect
              label="Sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              options={["Male", "Female"]}
              required
            />
            <FormInput
              label="City (Optional)"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <FormInput
              label="State (Optional)"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Phone Number (Optional)"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="create-account-btn"
            >
              {loading ? "Registering..." : "Complete Registration"}
            </button>
          </form>
          {message && (
            <p
              className={`message ${
                message.startsWith("Success") ? "success" : "error"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

const Navbar = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = await loginUser({ email, password });

      login(userData);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="register-navbar">
      <div className="nav-left">
        <h1 className="nav-logo">Gatherly</h1>
      </div>
      <div className="nav-right">
        <form className="nav-login-form" onSubmit={handleLogin}>
          <div className="nav-input-group">
            <input
              type="text"
              placeholder="Email or Username"
              className="nav-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <label className="nav-checkbox">
              <input type="checkbox" /> Keep me signed in
            </label>
          </div>

          <div className="nav-input-group">
            <input
              type="password"
              placeholder="Password"
              className="nav-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="nav-login-btn" disabled={loading}>
            {loading ? "..." : "Log In"}
          </button>
        </form>
        {error && <p className="nav-error-message">{error}</p>}
      </div>
    </nav>
  );
};

const FormInput = ({
  label,
  type,
  name,
  value,
  onChange,
  required = false,
}) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">
      {label}:
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="form-input"
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, options, required }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">
      {label}:
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="form-input"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt.toLowerCase()}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default Register;
