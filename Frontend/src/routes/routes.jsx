import { createBrowserRouter } from "react-router-dom";
import { Login } from "../features/auth/pages/Login";
import { Register } from "../features/auth/pages/Register";
import { App } from "../App";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { Test } from "../features/Temp";

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
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Test />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
