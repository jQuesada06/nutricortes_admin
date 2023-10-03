import React, { useState, useEffect } from "react";
import AppRouter from "./AppRouter";
import { AuthRoutes } from "./router/AuthRoutes";
import "./App.css";

function App() {
  const [logged, setLogged] = useState(true);

  useEffect(() => {
    const storedIsLogged = localStorage.getItem("isLogged");
    if (storedIsLogged === "true") {
      setLogged(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isLogged", logged.toString());
  }, [logged]);

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
