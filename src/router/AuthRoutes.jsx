import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "../pages/login/ErrorPage";
import Login from "../pages/login/Login";
import Signup from "../pages/login/Signup";
import FinishSignup from "../pages/login/FinishSingup";


export const AuthRoutes = (props) => {

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Login logged={props.logged} setLogged={props.setLogeed}/>,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <Signup />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/finishsignup",
      element: <FinishSignup />,
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
