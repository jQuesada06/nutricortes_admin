import Sidebar from "./layouts/sidebar/Sidebar"
import Planes from "./pages/planes/planes";
import Carrito from "./pages/carrito/Carrito";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {

  return (
    <>
      <Router>
        <div className="app">
          <Sidebar></Sidebar>
          <main>
            <Routes>
              <Route path="/planes" exact Component={Planes}></Route>
              <Route path="/carrito" Component={Carrito}></Route>
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App
