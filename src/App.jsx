import { useState } from "react";
import AppRouter from "./AppRouter";
import { LoginRouter } from "./router/LoginRouter";
import "./App.css";


function App() {

  const [user, setUser] = useState(false)
  return (
    <>

      {user ?
        (<AppRouter />)
        :
        (<LoginRouter />)
      }
    </>
  );
}

export default App;
