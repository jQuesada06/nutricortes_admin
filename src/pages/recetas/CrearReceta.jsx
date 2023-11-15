import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  Grid,
  Autocomplete,
} from "@mui/material";
import { collection, addDoc } from "@firebase/firestore";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Recetas.css";
import { db, storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const CrearReceta = (props) => {
  /* Para una receta necesito
        titulo
        lista de ingredientes 
        preparación
        rendimiento en porciones: un número entero
        intercambio: un string
        link del video
        imagen
  */
  const { onClose, open, onCreate } = props;
  const [titulo, setTitulo] = useState("");
  const [ingredientes, setIngredientes] = useState([]);
  const [preparacion, setPreparacion] = useState("");
  const [rendimiento, setRendimiento] = useState(0);
  const [intercambio, setIntercambio] = useState("");
  const [video, setVideo] = useState("");
  const [imagen, setImagen] = useState(null);
  const [formError, setFormError] = useState(false);

  const handleClose = () => onClose();
  const handleTituloChange = (event) => setTitulo(event.target.value);
  const handlePreparacionChange = (event) => setPreparacion(event.target.value);
  const handleRendimientoChange = (event) => setRendimiento(event.target.value);
  const handleIntercambioChange = (event) => setIntercambio(event.target.value);
  const handleVideoChange = (event) => setVideo(event.target.value);

  const handleImagenChange = (event) => {
    {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          setImagen(e.target.result);
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveImage = () => {
    setImagen(null);
  };

  const [ingredientesOptions, setIngredientesOptions] = useState([
    "Huevos",
    "Cebolla",
  ]);

  const handleNewIngredientesChange = (event, newValue) => {
    setIngredientes(newValue);
    const lastIngredient = newValue[newValue.length - 1];
    if (!ingredientesOptions.includes(lastIngredient)) {
      setIngredientesOptions((prevOptions) => [...prevOptions, lastIngredient]);
    }
  };

  const handleCreate = async () => {
    const collectionRef = collection(db, "recetas");
    try {
      const storageRef = ref(storage, `recipe_images/${titulo}`);
      await uploadBytes(storageRef, imagen, { contentType: "image/jpeg" });

      const imageUrl = await getDownloadURL(storageRef);

      const receta = {
        Titulo: titulo,
        Ingredientes: ingredientes,
        Preparacion: preparacion,
        Rendimiento: rendimiento,
        Intercambio: intercambio,
        Video: video,
        Imagen: imageUrl,
      };
      const docRef = await addDoc(collectionRef, receta);
      receta.id = docRef.id;
      onCreate(receta);
      toast.success("Agregado correctamente", {
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Hubo un error al agregar", {
        autoClose: 3000,
      });
    }
    clearFields();
    handleClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      titulo === "" ||
      ingredientes.length === 0 ||
      preparacion === "" ||
      rendimiento === 0 ||
      intercambio === "" ||
      video === "" ||
      imagen === null
    ) {
      setFormError(true);
      return;
    }
    handleCreate();
    setFormError(false);
  };

  const clearFields = () => {
    setTitulo("");
    setIngredientes([]);
    setPreparacion("");
    setRendimiento(0);
    setIntercambio("");
    setVideo("");
    setImagen(null);
  };
  return (
    <div className="crear-receta">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ textAlign: "center" }}>
          Agregar nueva Receta
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
              <TextField
                className="modal-container"
                label="Título"
                autoComplete="off"
                value={titulo}
                onChange={handleTituloChange}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
              <Autocomplete
                multiple
                className="ingredientes-container"
                options={ingredientesOptions}
                value={ingredientes}
                onChange={handleNewIngredientesChange}
                getOptionLabel={(option) => option || ""}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="ingredientes-container"
                    label="Ingredientes"
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
              <TextField
                className="modal-container"
                label="Preparación"
                autoComplete="off"
                value={preparacion}
                onChange={handlePreparacionChange}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={3} sx={{ marginLeft: 2, marginRight: 2 }}>
              <TextField
                className="modal-container"
                type="number"
                label="Rendimiento"
                autoComplete="off"
                value={rendimiento}
                onChange={handleRendimientoChange}
                rows={2}
                InputProps={{
                  inputProps: {
                    min: 0,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
              <TextField
                className="modal-container"
                label="Intercambio"
                autoComplete="off"
                value={intercambio}
                onChange={handleIntercambioChange}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
              <TextField
                className="modal-container"
                label="Link video"
                autoComplete="off"
                value={video}
                onChange={handleVideoChange}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="imagen-file"
                type="file"
                onChange={handleImagenChange}
              />
              <label htmlFor="imagen-file">
                <Button variant="outlined" component="span">
                  Seleccionar Imagen
                </Button>
              </label>
            </Grid>

            <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
              {imagen && (
                <div>
                  <img
                    src={imagen}
                    alt={`Receta-${titulo}`}
                    style={{ maxWidth: "100px" }}
                  />
                  <Button onClick={handleRemoveImage}>X</Button>
                </div>
              )}
            </Grid>

            {formError && (
              <Grid item xs={12} justifyContent="flex-end">
                <p style={{ color: "red", textAlign: "center" }}>
                  Llene todos los formularios
                </p>
              </Grid>
            )}
            <Grid item xs={12} justifyContent="flex-end">
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
      <ToastContainer />
    </div>
  );
};

export default CrearReceta;
