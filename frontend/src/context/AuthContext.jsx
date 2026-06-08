import { useEffect, createContext, useMemo, useState } from "react";
import authService from "../services/authService";

const TOKEN_KEY = "access_token";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);

  async function login(payload) {
    const data = await authService.login(payload);
    const accessToken = data?.access_token;

    if (!accessToken) {
      throw new Error("Token login tidak ditemukan dari server.");
    }

    localStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);
    setUser(data.user || null);

    return data;
  }

  async function register(payload) {
    return authService.register(payload);
  }

  async function refreshUser() {
    if (!token) {
      setUser(null);
      return null;
    }

    const currentUser = await authService.getCurrentUser();
    setUser(currentUser || null);
    return currentUser;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    if (!token) {
      return;
    }

    refreshUser().catch(() => {
      setUser(null);
    });
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      register,
      refreshUser,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
