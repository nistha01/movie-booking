import React, { createContext, useState, useContext } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider to wrap the app and manage auth state
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

