import React, { useState, useEffect } from "react";
import AppRouter from "./AppRouter";
import { AuthRoutes } from "./router/AuthRoutes";
import "./App.css";

function App() {

  const init = () => {
    const UserLogged = localStorage.getItem("isLogged");
    return UserLogged;
  }

  const UserLogged = init();
  const [logged, setLogged] = useState(init());
  

  useEffect(() => {
    const UserLogged = localStorage.getItem("isLogged");
    if (UserLogged === "true") {
      setLogged(true);
    }
  }, [UserLogged]);

  return (
    <>
      {logged ? (
        <AppRouter />
      ) : (
        <AuthRoutes logged={logged} setLogged={setLogged} />
      )}
    </>
  );
}

export default App;