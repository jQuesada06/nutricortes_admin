import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  Grid,
} from "@mui/material";
import { setDoc, doc } from "@firebase/firestore";
import { toast } from "react-toastify";
import "./Recetas.css";
import { db, storage } from "../../firebase/config";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

const EditarReceta = (props) => {
  const { onClose, open, object, onUpdate, flagView } = props;
  const [titulo, setTitulo] = useState("");
  const [ingredientes, setIngredientes] = useState([]);
  const [preparacion, setPreparacion] = useState("");
  const [rendimiento, setRendimiento] = useState(0);
  const [intercambio, setIntercambio] = useState("");
  const [video, setVideo] = useState("");
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [imagen, setImagen] = useState("");
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    if (object && object.object) {
      setTitulo(object.object.Titulo);
      setIngredientes(object.object.Ingredientes);
      setPreparacion(object.object.Preparacion);
      setRendimiento(object.object.Rendimiento);
      setIntercambio(object.object.Intercambio);
      setVideo(object.object.Video);
      setImagen(object.object.Imagen);
    }
  }, [object]);

  const handleClose = () => onClose();
  const handleTituloChange = (event) => setTitulo(event.target.value);
  const handleIngredientesChange = (event) =>
    setIngredientes(event.target.value);
  const handlePreparacionChange = (event) => setPreparacion(event.target.value);
  const handleRendimientoChange = (event) => setRendimiento(event.target.value);
  const handleIntercambioChange = (event) => setIntercambio(event.target.value);
  const handleVideoChange = (event) => setVideo(event.target.value);

  const handleImagenChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      toast.error("Debe seleccionar un archivo.", {
        autoClose: 5000,
      });
      return null;
    }
    const timestamp = new Date().getTime();
    const imageName = `${timestamp}_${image.name}`;
    const recetasRef = ref(storage, `recipe_images/${imageName}`);
    try {
      await uploadBytes(recetasRef, image);

      const downloadURL = await getDownloadURL(recetasRef);
      return downloadURL;
    } catch (error) {
      toast.error("Hubo un error al cargar la imagen", {
        autoClose: 3000,
      });
      return null;
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageURL(null);
  };

  const deleteImage = async () => {
    const recetasRef = ref(storage, imagen);
    deleteObject(recetasRef)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdate = async () => {
    const collectionRef = doc(db, "recetas", object.object.id);
    await deleteImage();
    const url = await uploadImage();
    try {
      const receta = {
        id: object.object.id,
        Titulo: titulo,
        Ingredientes: ingredientes,
        Preparacion: preparacion,
        Rendimiento: rendimiento,
        Intercambio: intercambio,
        Video: video,
        Imagen: url,
      };

      await setDoc(collectionRef, receta);
      toast.success("Actualizado", { autoClose: 3000 });
      onUpdate(receta);
    } catch (error) {
      alert(error);
      toast.error("¡Error al actualizar!", {
        autoClose: 3000,
      });
    }
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
      image === null
    ) {
      setFormError(true);
      return;
    }
    handleUpdate();
    setFormError(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>
        {flagView ? "Ver Receta" : "Actualizar Receta"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Título"
              className="modal-container"
              value={titulo}
              onChange={handleTituloChange}
              disabled={flagView}
            />
          </Grid>

          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Ingredientes"
              className="modal-container"
              value={ingredientes}
              onChange={handleIngredientesChange}
              disabled={flagView}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Preparación"
              className="modal-container"
              value={preparacion}
              onChange={handlePreparacionChange}
              disabled={flagView}
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
              disabled={flagView}
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
              label="Intercambio"
              className="modal-container"
              value={intercambio}
              onChange={handleIntercambioChange}
              disabled={flagView}
            />
          </Grid>

          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Link Video"
              className="modal-container"
              value={video}
              onChange={handleVideoChange}
              disabled={flagView}
            />
          </Grid>

          {!flagView && (
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
          )}

          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            {imageURL || imagen ? (
              <div>
                <img
                  src={imageURL || imagen}
                  alt={`Receta-${titulo}`}
                  style={{ maxWidth: "100px" }}
                />
                {!flagView && <Button onClick={handleRemoveImage}>X</Button>}
              </div>
            ) : null}
          </Grid>

          {!flagView && formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red", textAlign: "center" }}>
                Llene todos los formularios
              </p>
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

export default EditarReceta;
