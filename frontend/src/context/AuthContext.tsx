import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

/**
 * Decode a JWT payload without a library.
 * Returns null if the token is malformed or expired.
 */
function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp is in seconds, Date.now() in ms
    if (payload.exp && payload.exp * 1000 < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem("coldcraft_token");
    // Clear stale / invalid tokens on app boot
    if (stored && !isTokenValid(stored)) {
      localStorage.removeItem("coldcraft_token");
      return null;
    }
    return stored;
  });

  const login = (newToken: string) => {
    localStorage.setItem("coldcraft_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("coldcraft_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
