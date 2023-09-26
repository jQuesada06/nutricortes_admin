import Sidebar from "./layouts/sidebar/Sidebar";
import TablaPlanes from "./pages/planes/TablaPlanes";
import TablaCarrito from "./pages/carrito/TablaCarrito";
import TablaConsultorios from "./pages/consultorios/TablaConsultorios";
import TablaEbooks from "./pages/ebooks/TablaEbook";
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
              <Route path="/carrito" Component={TablaCarrito}></Route>
              <Route path="/consultorios" Component={TablaConsultorios}></Route>
              <Route path="/ebooks" Component={TablaEbooks}></Route>
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
