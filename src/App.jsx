import Sidebar from "./layouts/sidebar/Sidebar";
import TablaPlanes from "./pages/planes/TablaPlanes";
import Carrito from "./pages/carrito/Carrito";
import TablaConsultorios from "./pages/consultorios/TablaConsultorios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <div className="app">
          <Sidebar></Sidebar>
          <main>
            <Routes>
              <Route path="/planes" exact Component={TablaPlanes}></Route>
              <Route path="/carrito" Component={Carrito}></Route>
              <Route path="/consultorios" Component={TablaConsultorios}></Route>
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
