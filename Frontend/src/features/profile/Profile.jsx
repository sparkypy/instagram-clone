import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="text-white">
      <h1 className="text-3xl">{user.username}</h1>

      <button
        onClick={handleLogout}
        className="mt-5 rounded-xl bg-red-500 px-5 py-2"
      >
        Logout
      </button>
    </div>
  );
};
