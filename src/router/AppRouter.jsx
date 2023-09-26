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
import AdminHome from "../components/AdminHome";
import TablaConsultorios from "../components/consultorios/TablaConsultorios";
import TablaReseñas from "../components/reseñas/TablaReseñas";
import TablaRecetas from "../components/recetas/TablaRecetas";

export const AppRouter = () => {
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
      path: "/home",
      element: <Home />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/adminhome",
      element: <AdminHome />,
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
