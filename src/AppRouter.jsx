import React from 'react'
import Sidebar from "./layouts/sidebar/Sidebar";
import TablaPlanes from "./pages/planes/TablaPlanes";
import TablaCarrito from "./pages/carrito/TablaCarrito";
import TablaConsultorios from "./pages/consultorios/TablaConsultorios";
import TablaEbooks from "./pages/ebooks/TablaEbook";
import TablaFaqs from "./pages/faqs/TablaFaqs";
import VerBiografia from "./pages/biografia/Biografia";
import TablaPromociones from "./pages/promociones/TablaPromociones";
import TablaReto from "./pages/Reto/TablaReto";
import TablaRecetas from "./pages/recetas/TablaRecetas";
import TablaResenas from "./pages/resenas/TablaResenas";
import Home from './pages/home/home';
import { BrowserRouter as Router, Route, Routes,  } from "react-router-dom";
import "./App.css";


const AppRouter = (props) => {
  return (
    <>
      <Router>
        <div className="app">
          <Sidebar setLogged={props.setLogged} ></Sidebar>
          <main>
            <Routes>
              <Route path="/" exact Component={Home}></Route>
              <Route path="/planes" Component={TablaPlanes}></Route>
              <Route path="/carrito" Component={TablaCarrito}></Route>
              <Route path="/consultorios" Component={TablaConsultorios}></Route>
              <Route path="/ebooks" Component={TablaEbooks}></Route>
              <Route path="/preguntas" Component={TablaFaqs}></Route>
              <Route path="/biografia" Component={VerBiografia}></Route>
              <Route path="/reto" Component={TablaReto}></Route>
              <Route path="/promociones" Component={TablaPromociones}></Route>
              <Route path="/recetas" Component={TablaRecetas}></Route>
              <Route path="/resenas" Component={TablaResenas}></Route>
              <Route path="/*" Component={Home}> </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </>
  )
}

export default AppRouter;