import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/api";
import { Children } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user && user.id) {
          setCurrentUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          setCurrentUser(null);
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const value = {
    currentUser,
    loading,
    login,
    logout,
  };

  if (loading) {
    return <div>Loading authentication state</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
