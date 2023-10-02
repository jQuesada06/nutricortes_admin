import { useState } from "react";
import AppRouter from "./AppRouter";
import { AuthRoutes } from "./router/AuthRoutes";
import Login from "./pages/login/Login";
import "./App.css";


function App() {

  const [logged, setLogeed] = useState(false)
  
  return (
    <>
      {logged ?
        (<AppRouter />)
        :
        (<AuthRoutes logged={logged} setLogeed={setLogeed}/>)
      }
    </>
  );
}

export default App;
