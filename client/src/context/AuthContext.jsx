import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("adminToken"));

  const login = useCallback(async (password) => {
    const { token: newToken } = await api.login(password);
    localStorage.setItem("adminToken", newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
