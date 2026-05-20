import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../services/authService";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    setUser(data.user);
    return data;
  };

  const register = async (credentials) => {
    const data = await registerUser(credentials);
    setUser(data.user);
    return data;
  };

  const hydrateUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hydrateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        isAuthenticated: !!user, // converts object -> true; null -> false
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
