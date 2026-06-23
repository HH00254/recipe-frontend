import { createContext, useContext, useEffect, useState } from "react";
import { getMe, login as apiLogin } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getMe(token)
      .then(setUser)
      .catch(() => {
        setToken(null);
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function login(email, password) {
    const data = await apiLogin(email, password);
    localStorage.setItem("token", data.token);
    setToken(data.token);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
