import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="bg-black text-lg text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
