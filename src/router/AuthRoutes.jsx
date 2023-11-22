import React from "react";
import { ToastContainer } from "react-toastify";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "../pages/login/ErrorPage";
import Login from "../pages/login/Login";

export const AuthRoutes = (props) => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Login logged={props.logged} setLogged={props.setLogged} />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/*",
      element: <Navigate to={"/"} />,
      errorElement: <ErrorPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer />
    </>
  );
};
