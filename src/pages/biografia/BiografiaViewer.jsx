import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './BiografiaViewer.css'; // Asegúrate de que esta ruta sea correcta

const BiografiaViewer = () => {
  const [biografia, setBiografia] = useState({});
  const [originalImagen, setOriginalImagen] = useState('');
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [secciones, setSecciones] = useState([]);

  useEffect(() => {
    const obtenerBiografia = async () => {
      try {
        const firestore = getFirestore();
        const biografiaRef = doc(firestore, 'Biografia', '0EcTr5XsdkxeuWtPiBpY');
        const biografiaSnapshot = await getDoc(biografiaRef);

        if (biografiaSnapshot.exists()) {
          const datosBiografia = biografiaSnapshot.data();
          setBiografia(datosBiografia);
          setOriginalImagen(datosBiografia.imagen);
          setNombre(datosBiografia.nombre);
          setCodigo(datosBiografia.codigo);
          setDescripcion(datosBiografia.descripcion);
          setSecciones(datosBiografia.secciones || []); // Asegúrate de manejar el caso en que "secciones" no esté definido
        }
      } catch (error) {
        console.error('Error al obtener los datos de la biografía', error);
      }
    };

    obtenerBiografia();
  }, []);

  return (
    <div className="biografia-container">
      <div className="nombre-column">
        <h1>{nombre}</h1> {/* Título con el nombre desde la base de datos */}
        <h1>{codigo}</h1> {/* Título con el código desde la base de datos */}
      </div>
      <div className="contenido-column">
        <div className="descripcion-column">
          <p>{descripcion}</p>
        </div>
        <div className="imagen-column">
          <div className="imagen-circle">
            <div className="orange-circles">
              <div className="orange-circle"></div>
              <div className="orange-circle2"></div>
              <div className="orange-circle"></div>
            </div>
            <img className="rounded-image" src={originalImagen} alt="Imagen" />
          </div>
        </div>
      </div>
      <div className="secciones">
        {secciones.map((seccion, index) => (
          <div key={index} className="seccion">
            <h2>{seccion.titulo}</h2>
            <div className="linea"></div> {/* Línea degradada */}
            <p>{seccion.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiografiaViewer;
