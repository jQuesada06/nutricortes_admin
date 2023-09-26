import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link para la navegación
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './BiografiaHome.css'; // Asegúrate de que esta ruta sea correcta

const BiografiaHome = ({ match }) => {
  const [biografia, setBiografia] = useState({});
  const [originalImagen, setOriginalImagen] = useState('');

  useEffect(() => {
    const obtenerBiografia = async () => {
      try {
        const firestore = getFirestore();
        const biografiaRef = doc(firestore, 'Biografia', match.params.id);
        const biografiaSnapshot = await getDoc(biografiaRef);

        if (biografiaSnapshot.exists()) {
          const datosBiografia = biografiaSnapshot.data();
          setBiografia(datosBiografia);
          setOriginalImagen(datosBiografia.imagen);
        }
      } catch (error) {
        console.error('Error al obtener los datos de la biografía', error);
      }
    };

    obtenerBiografia();
  }, [match.params.id]);

  return (
    <div className="biografia-home-container">
      <div className="columna-degradado">
        <h1>{biografia.nombre}</h1>
        <p>{biografia.codigo}</p>
        <Link to={`/biografiaViewer/${match.params.id}`}> {/* Actualiza la ruta a BiografiaViewer */}
          <button className="ver-mas-button" disabled>Ver Más</button>
        </Link>
      </div>
      <div className="columna-foto">
        <img className="foto" src={originalImagen} alt="Imagen" />
      </div>
    </div>
  );
};

export default BiografiaHome;
