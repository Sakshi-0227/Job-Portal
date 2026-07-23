import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  loginUser as loginRequest,
  registerUser as registerRequest,
  fetchProfile,
  updateProfile as updateProfileRequest,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("jobPortalUser");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("jobPortalUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("jobPortalUser");
    }
  }, [user]);

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role) => {
    const data = await registerRequest(name, email, password, role);
    setUser(data);
    return data;
  };

  const logout = () => {
    setUser(null);
  };

  const refreshProfile = async () => {
    if (!user) return null;
    const profile = await fetchProfile();
    const updated = { ...user, ...profile };
    setUser(updated);
    return updated;
  };

  const updateProfile = async (profileData) => {
    const updated = await updateProfileRequest(profileData);
    const nextUser = { ...user, ...updated };
    setUser(nextUser);
    return nextUser;
  };

  const value = useMemo(
    () => ({ user, login, register, logout, refreshProfile, updateProfile }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
