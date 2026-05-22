import { createBrowserRouter } from "react-router-dom";
import { Login } from "../features/auth/Login";
import { Register } from "../features/auth/Register";
import { App } from "../App";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { Profile } from "../features/profile/Profile";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/profile/:username",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
