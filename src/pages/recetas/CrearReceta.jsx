import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Grid,
  Tooltip,
} from "@mui/material";
import { getFirestore, collection, addDoc } from "@firebase/firestore";
import { toast } from "react-toastify";
import "./Recetas.css";
import { db } from "../../firebase/config";

const CrearReceta = (props) => {
  const { onClose, open, onCreate } = props;
  const [categoria, setCategoria] = useState("");
  const [video, setVideo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [formError, setFormError] = useState(false);



  const handleClose = () => onClose();
  const handleCategoriaChange = (event) => setCategoria(event.target.value);
  const handleVideoChange = (event) => setVideo(event.target.value);
  const handleTituloChange = (event) => setTitulo(event.target.value);
  const handleIngredientesChange = (event) => setIngredientes(event.target.value);
  const handleDescripcionChange = (event) => setDescripcion(event.target.value);

 

  const handleCreate = async () => {
    const collectionRef = collection(db, "recetas");
    try {
      const receta = {
        Categoria: categoria,
        Video: video,
        Titulo: titulo,
        Ingredientes: ingredientes,
        Descripcion: descripcion,
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
    if (categoria === "" || video === "" || titulo === "" || ingredientes === "" || descripcion === "" ) {
      setFormError(true);
      return;
    }
    handleCreate();
    setFormError(false);
  };
  const clearFields = () => {
    setCategoria("");
    setVideo("");
    setTitulo("");
    setIngredientes("");
    setDescripcion("");
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>Agregar nueva Receta</DialogTitle>
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
            <TextField
            className="modal-container"
            label="Categoría"
            autoComplete="off"
            value={categoria}
            onChange={handleCategoriaChange}
            />
          </Grid>

          <Grid item xs={12} sx={{marginLeft: 2, marginRight: 2}}>
            <TextField
             className="modal-container"
             label="Descripción"
             autoComplete="off"
             value={descripcion}
             onChange={handleDescripcionChange}
             multiline
             rows={4}
            />
          </Grid>

          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              className="modal-container"
              label="Ingredientes"
              autoComplete="off"
              value={ingredientes}
              onChange={handleIngredientesChange}
              rows={2}
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


          {formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red", textAlign: "center"  }}>Llene todos los formularios</p>
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
  );
};

export default CrearReceta;
