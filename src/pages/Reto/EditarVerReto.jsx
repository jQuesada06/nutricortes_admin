import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Grid,
  Checkbox,
} from "@mui/material";
import { getFirestore, setDoc, doc, collection, getDocs} from "firebase/firestore";
import { toast } from "react-toastify";
import "./Reto.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditarReto = (props) => {
  const { onClose, open, object, onUpdate, flagView } = props;
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  const [fechaProximo, setFechaProximo] = useState("");
  const [nombre, setNombre] = useState("");
  const [plus, setPlus] = useState("");
  const [premios, setPremios] = useState("");
  const [activo, setActivo] = useState(false);

  const [formError, setFormError] = useState(false);
  const [patrocinadores, setPatrocinadores] = useState([]);
  const [imagenesPatrocinadores, setImagenesPatrocinadores] = useState({});

  useEffect(() => {
    if (object && object.object) {
      setDescripcion(object.object.descripcion);
      setFechaInicial(object.object.fechaInicial);
      setFechaFinal(object.object.fechaFinal);
      setPatrocinadores(object.object.patrocinadores || []);

      setNombre(object.object.nombre);
      setFechaProximo(object.object.fechaProximo);
      setPlus(object.object.plus);
      setPremios(object.object.premios);
      setActivo(object.object.activo)

      // Inicializa las referencias de las imágenes por patrocinador
      const imgReferences = {};
      object.object.patrocinadores.forEach((patrocinador) => {
        imgReferences[patrocinador.id] = patrocinador.imagen || "";
      });
      setImagenesPatrocinadores(imgReferences);
    }
  }, [object]);

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
  const handlePatrocinadorChange = (event, patrocinadorId, field) => {
    const updatedPatrocinadores = [...patrocinadores];
    const patrocinadorIndex = updatedPatrocinadores.findIndex(
      (p) => p.id === patrocinadorId
    );
  
    if (patrocinadorIndex !== -1) {
      updatedPatrocinadores[patrocinadorIndex] = {
        ...updatedPatrocinadores[patrocinadorIndex],
        [field]: event.target.value,
      };
  
      // Actualiza el estado de los patrocinadores
      setPatrocinadores(updatedPatrocinadores);
    }
  };

  const handleUpdate = async () => {
    const db = getFirestore();
    const collectionRef = doc(db, "Retos", object.object.id);

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

      // Luego, actualizamos los patrocinadores con las URLs correspondientes
      const retos = {
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

      await setDoc(collectionRef, retos);
      toast.success("Actualizado", { autoClose: 3000 });
      onUpdate(retos);
    } catch (error) {
      alert(error);
      toast.error("¡Error al actualizar el reto!", {
        autoClose: 3000,
      });
    }
    handleClose();
  };

  const handleImagenChange = async (event, patrocinadorId) => {
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `imagenes/${patrocinadorId}/${event.target.files[0].name}`
    );

    try {
      await uploadBytes(storageRef, event.target.files[0]);
      const downloadURL = await getDownloadURL(storageRef);

      // Crear una URL temporal para previsualización de la imagen
      const previewURL = URL.createObjectURL(event.target.files[0]);

      // Actualizar la referencia de la imagen del patrocinador específico y la previsualización
      setImagenesPatrocinadores({
        ...imagenesPatrocinadores,
        [patrocinadorId]: downloadURL,
      });

      // Agregar la URL temporal de previsualización al estado de patrocinadores
      const updatedPatrocinadores = [...patrocinadores];
      const patrocinadorIndex = updatedPatrocinadores.findIndex(
        (p) => p.id === patrocinadorId
      );

      if (patrocinadorIndex !== -1) {
        updatedPatrocinadores[patrocinadorIndex] = {
          ...updatedPatrocinadores[patrocinadorIndex],
          imagen: downloadURL,
          preview: previewURL, // Agregar la URL de previsualización
        };

        // Actualizar el estado de los patrocinadores
        setPatrocinadores(updatedPatrocinadores);
      }
    } catch (error) {
      alert("Error al subir la imagen.");
      console.error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (descripcion === "" || fechaInicial === "" || fechaFinal === "") {
      setFormError(true);
      return;
    }
    handleUpdate();
    setFormError(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>
        {flagView ? "Ver Reto" : "Actualizar Reto"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} marginLeft={3}>
            Activo
            <Checkbox
              checked={activo}
              onChange={handleActivoChange}
              color="primary" // Opcional: cambia el color a "secondary" o "default" según tus preferencias
          />
          </Grid>
          <br />
          <Grid item xs={12}sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Descripcion"
              className="modal-container"
              value={descripcion}
              onChange={handleDescripcionChange}
              disabled={flagView}
            />
          </Grid>
          <br />
          <Grid item xs={12}sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Fecha de inicio del reto actual"
              className="modal-container"
              value={fechaInicial}
              onChange={handleFechaInicialChange}
              disabled={flagView}
              type="date"
            />
          </Grid>
          <br />
          <Grid item xs={12}sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Fecha final del reto actual"
              className="modal-container"
              value={fechaFinal}
              onChange={handleFechaFinalChange}
              disabled={flagView}
              type="date"
            />
          </Grid>
          <br />
          <Grid item xs={12}sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Fecha del proximo reto actual"
              className="modal-container"
              value={fechaProximo}
              onChange={handleFechaProximoChange}
              disabled={flagView}
              type="date"
            />
          </Grid>
          <br />
          <Grid item xs={12}sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Nombre"
              className="modal-container"
              value={nombre}
              onChange={handleNombreChange}
              disabled={flagView}
            />
          </Grid>
          <br />
          <Grid item xs={12}sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Plus"
              className="modal-container"
              value={plus}
              onChange={handlePlusChange}
              disabled={flagView}
            />
          </Grid>
          <br />
          <Grid item xs={12}sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Premios"
              className="modal-container"
              value={premios}
              onChange={handlePremiosChange}
              disabled={flagView}
            />
          </Grid>
          <br />
          {patrocinadores.map((patrocinador) => (
            <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }} key={patrocinador.id}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImagenChange(e, patrocinador.id)}
                disabled={flagView}
              />
              <br /><br />
              <TextField
                label="Nombre del Patrocinador"
                value={patrocinador.nombre}
                onChange={(e) => handlePatrocinadorChange(e, patrocinador.id, 'nombre')}
                disabled={flagView}
              />
              <br /><br />
              <TextField
                label="Link del Patrocinador"
                value={patrocinador.link}
                onChange={(e) => handlePatrocinadorChange(e, patrocinador.id, 'link')}
                disabled={flagView}
              />
              <br /><br />
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
          {!flagView && formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red", textAlign: "center" }}>Llene todos los formularios</p>
            </Grid>
          )}
          <Grid item xs={12} justifyContent="flex-end">
            <DialogActions>
              {flagView ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClose}
                >
                  Cerrar
                </Button>
              ) : (
                <>
                  <Button onClick={handleClose}>Cerrar</Button>
                  <Button type="submit" variant="contained" color="primary">
                    Guardar
                  </Button>
                </>
              )}
            </DialogActions>
          </Grid>
        </Grid>
      </form>
    </Dialog>
  );
};

export default EditarReto;
