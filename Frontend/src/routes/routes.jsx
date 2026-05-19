import { createBrowserRouter } from "react-router-dom";
import { Login } from "../features/auth/pages/Login";
import { Register } from "../features/auth/pages/Register";
import { App } from "../App";

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
    ],
  },
]);
