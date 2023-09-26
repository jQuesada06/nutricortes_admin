import React from "react";
import { ToastContainer } from "react-toastify";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import Login from "../components/login/Login";
import Signup from "../components/login/Signup";
import FinishSignup from "../components/login/FinishSingup";
import Home from "../components/Home";
import AppRouter from "../AppRouter";
import TablaConsultorios from "../components/consultorios/TablaConsultorios";
import TablaReseñas from "../components/reseñas/TablaReseñas";
import TablaRecetas from "../components/recetas/TablaRecetas";

export const LoginRouter = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
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
      path: "/adminhome",
      element: <AppRouter />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/consultorios",
      element: <TablaConsultorios />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/recetas",
      element: <TablaRecetas />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/resenas",
      element: <TablaReseñas />,
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
