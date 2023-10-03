import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  Grid,
  Checkbox,
  DialogContentText,
} from "@mui/material";
import { getFirestore, addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./Reto.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CrearReto = (props) => {
  const { onClose, open, onUpdate } = props;
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  const [fechaProximo, setFechaProximo] = useState("");
  const [nombre, setNombre] = useState("");
  const [plus, setPlus] = useState("");
  const [premios, setPremios] = useState("");
  const [activo, setActivo] = useState(false);

  const [formError, setFormError] = useState(false);
  const [patrocinadores, setPatrocinadores] = useState([
    // Inicia con un patrocinador vacío
    { nombre: "", link: "", imagen: "", preview: "" },
  ]);

  const handleClose = () => onClose();
  const handleDescripcionChange = (event) => setDescripcion(event.target.value);
  const handleFechaInicialChange = (event) => setFechaInicial(event.target.value);
  const handleFechaFinalChange = (event) => setFechaFinal(event.target.value);

  const handleNombreChange = (event) => setNombre(event.target.value);
  const handleFechaProximoChange = (event) => setFechaProximo(event.target.value);
  const handlePremiosChange = (event) => setPremios(event.target.value);
  const handlePlusChange = (event) => setPlus(event.target.value);
  const handleActivoChange = () => {
    setActivo(!activo); // Invierte el valor actual de activo
  };

  const handlePatrocinadorChange = (event, index, field) => {
    const updatedPatrocinadores = [...patrocinadores];
    updatedPatrocinadores[index] = {
      ...updatedPatrocinadores[index],
      [field]: event.target.value,
    };
    setPatrocinadores(updatedPatrocinadores);
  };

  const handleAgregarPatrocinador = () => {
    setPatrocinadores([
      ...patrocinadores,
      { nombre: "", link: "", imagen: "", preview: "" },
    ]);
  };

  const handleCrearReto = async () => {
    const db = getFirestore();
    const retosCollection = collection(db, "Retos");

    try {
      // Primero, obtenemos todas las URLs de descarga
      const downloadURLs = await Promise.all(
        patrocinadores.map(async (patrocinador) => {
          if (patrocinador.imagen) {
            const storage = getStorage();
            const storageRef = ref(storage, patrocinador.imagen);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
          }
          return ""; // Si no hay imagen, regresamos una cadena vacía
        })
      );

      if (activo) {
        // Si se marcará como activo, obtenemos todos los retos existentes
        const retosCollection = collection(db, "Retos");
        const retosSnapshot = await getDocs(retosCollection);
        const retosDocs = retosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Actualizar todos los retos existentes para marcarlos como inactivos
        const updates = retosDocs.map((reto) => ({
          ...reto,
          activo: false,
        }));
        await Promise.all(
          updates.map(async (update) => {
            const retoRef = doc(db, "Retos", update.id);
            await setDoc(retoRef, update);
          })
        );
      }

      // Luego, creamos un nuevo reto con los datos ingresados
      const nuevoReto = {
        descripcion: descripcion,
        fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        patrocinadores: patrocinadores.map((patrocinador, index) => ({
          ...patrocinador,
          id: downloadURLs[index],
          imagen: downloadURLs[index], // Asignamos la URL correspondiente
        })),
        fechaProximo: fechaProximo,
        nombre: nombre,
        premios: premios,
        plus: plus,
        activo: activo,
      };

      // Agregamos el nuevo reto a la colección de retos en Firestore
      await addDoc(retosCollection, nuevoReto);

      toast.success("Reto creado", { autoClose: 3000 });
      //onUpdate(nuevoReto);
    } catch (error) {
      alert(error);
      toast.error("¡Error al crear el reto!", {
        autoClose: 3000,
      });
    }
    handleClose();
  };

  const handleImagenChange = async (event, index) => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `imagenes/${patrocinadores[index].nombre}/${event.target.files[0].name}`
    );

    try {
      await uploadBytes(storageRef, event.target.files[0]);
      const downloadURL = await getDownloadURL(storageRef);

      // Crear una URL temporal para previsualización de la imagen
      const previewURL = URL.createObjectURL(event.target.files[0]);

      // Actualizar la referencia de la imagen del patrocinador específico y la previsualización
      const updatedPatrocinadores = [...patrocinadores];
      updatedPatrocinadores[index] = {
        ...updatedPatrocinadores[index],
        imagen: downloadURL,
        preview: previewURL, // Agregar la URL de previsualización
      };

      // Actualizar el estado de los patrocinadores
      setPatrocinadores(updatedPatrocinadores);
    } catch (error) {
      alert("Error al subir la imagen.");
      console.error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    /*if (descripcion === "" || fechaInicial === "" || fechaFinal === "") {
      setFormError(true);
      return;
    }*/
    handleCrearReto();
    setFormError(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>Crear Nuevo Reto</DialogTitle>
      <DialogContentText>Complete los datos del nuevo reto:</DialogContentText>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
        <Grid item xs={12}>
            Activo
            <Checkbox
              checked={activo}
              onChange={handleActivoChange}
              color="primary" // Opcional: cambia el color a "secondary" o "default" según tus preferencias
          />
          </Grid>
          <br />
          <Grid item xs={12}>
            <TextField
              label="Descripcion"
              className="descripcion-container"
              value={descripcion}
              onChange={handleDescripcionChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Fecha de inicio del reto actual"
              className="fechaInicio-container"
              value={fechaInicial}
              onChange={handleFechaInicialChange}
              type="date"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Fecha final del reto actual"
              className="fechaFinal-container"
              value={fechaFinal}
              onChange={handleFechaFinalChange}
              type="date"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Fecha del proximo reto actual"
              className="fechaProximo-container"
              value={fechaProximo}
              onChange={handleFechaProximoChange}
              type="date"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              className="nombre-container"
              value={nombre}
              onChange={handleNombreChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Plus"
              className="plus-container"
              value={plus}
              onChange={handlePlusChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Premios"
              className="premios-container"
              value={premios}
              onChange={handlePremiosChange}
            />
          </Grid>
          {patrocinadores.map((patrocinador, index) => (
            <Grid item xs={12} key={index}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImagenChange(e, index)}
              />
              <br />
              <br />
              <TextField
                label="Nombre del Patrocinador"
                value={patrocinador.nombre}
                onChange={(e) =>
                  handlePatrocinadorChange(e, index, "nombre")
                }
              />
              <br />
              <br />
              <TextField
                label="Link del Patrocinador"
                value={patrocinador.link}
                onChange={(e) => handlePatrocinadorChange(e, index, "link")}
              />
              <br />
              <strong>Imagen:</strong>{" "}
              {patrocinador.preview && (
                <img
                  src={patrocinador.preview}
                  alt={`Previsualización de ${patrocinador.nombre}`}
                  width="100"
                />
              )}
              
            <br />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAgregarPatrocinador}
            >
              Agregar Patrocinador
            </Button>
          </Grid>
          {formError && (
            <Grid item xs={12}>
              <p style={{ color: "red", textAlign: "center" }}>Llene todos los formularios</p>
            </Grid>
          )}
          <Grid item xs={12}>
            <DialogActions>
              <Button onClick={handleClose}>Cerrar</Button>
              <Button type="submit" variant="contained" color="primary">
                Guardar
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </form>
    </Dialog>
  );
};

export default CrearReto;
