import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Grid,
} from "@mui/material";
import { setDoc, doc } from "@firebase/firestore";
import { toast } from "react-toastify";
import "./Recetas.css";
import { db } from "../../firebase/config";

const EditarReceta = (props) => {
  const { onClose, open, object, onUpdate, flagView } = props;
  const [categoria, setCategoria] = useState("");
  const [video, setVideo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [formError, setFormError] = useState(false);



  useEffect(() => {
    if (object && object.object) {
      setCategoria(object.object.Categoria);
      setVideo(object.object.Video);
      setTitulo(object.object.Titulo);
      setIngredientes(object.object.Ingredientes);
      setDescripcion(object.object.Descripcion);
    }
  }, [object]);

  const handleClose = () => onClose();
  const handleCategoriaChange = (event) => setCategoria(event.target.value);
  const handleVideoChange = (event) => setVideo(event.target.value);
  const handleTituloChange = (event) => setTitulo(event.target.value);
  const handleIngredientesChange = (event) => setIngredientes(event.target.value);
  const handleDescripcionChange = (event) => setDescripcion(event.target.value);



  const handleUpdate = async () => {
    const collectionRef = doc(db, "recetas", object.object.id);
    try {
      const receta = {
        id: object.object.id,
        Categoria: categoria,
        Video: video,
        Titulo: titulo,
        Ingredientes: ingredientes,
        Descripcion: descripcion,
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
    if (categoria === "" || video === "" || titulo === "" || ingredientes === "" || descripcion === "") {
      setFormError(true);
      return;
    }
    handleUpdate();
    setFormError(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {flagView ? "Ver Receta" : "Actualizar Receta"}
      </DialogTitle>
      <DialogContent>
        {flagView
          ? "Detallade de la Receta"
          : "Edite a los datos de la Receta existente."}
      </DialogContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Categoria"
              className="categoria-container"
              value={categoria}
              onChange={handleCategoriaChange}
              disabled={flagView}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
             label="Video"
             className="video-container"
             value={video}
             onChange={handleVideoChange}
             disabled={flagView}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
               label="Titulo"
               className="titulo-container"
               value={titulo}
               onChange={handleTituloChange}
               disabled={flagView}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
                 label="Ingredientes"
                 className="ingredientes-container"
                 value={ingredientes}
                 onChange={handleIngredientesChange}
                 disabled={flagView}
                 multiline
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Descripcion"
              className="descripcion-container"
              value={descripcion}
              onChange={handleDescripcionChange}
              disabled={flagView}
              multiline
            />
          </Grid>


          {!flagView && formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red" }}>Llene todos los formularios.</p>
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
