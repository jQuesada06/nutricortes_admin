import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Grid
} from "@mui/material";
import { collection, addDoc } from "@firebase/firestore";
import { toast } from "react-toastify";
import "./Ebook.css";
import { db } from "../../firebase/config";

const CrearEbook = (props) => {
  const { onClose, open, onCreate } = props;
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("sssss");
  const [precio, setPrecio] = useState("");
  const [formError, setFormError] = useState(false);

  const handleClose = () => onClose();
  const handleNameChange = (event) => setNombre(event.target.value);
  const handleDescriptionChange = (event) => setDescripcion(event.target.value);
  const handleImagenChange = (event) => setImagen(event.target.value);
  const handlePrecioChange = (event) => setPrecio(event.target.value);
  

  const handleCreate = async () => {
    const collectionRef = collection(db, "Ebooks");
    try {
      const plan = {
        Nombre: nombre,
        Descripcion: descripcion,
        Imagen: imagen,
        Precio: precio
      };
      const docRef = await addDoc(collectionRef, plan);
      plan.id = docRef.id;
      onCreate(plan);
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
    if (nombre === "" || descripcion === "" || imagen === "" || precio === "" ) {
      setFormError(true);
      return;
    }
    handleCreate();
    setFormError(false);
  };
  const clearFields = () => {
    setNombre("");
    setDescripcion("");
    setImagen("");
    setPrecio("");
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Agregar Nuevo eBook</DialogTitle>
      <DialogContent>Favor llenar todos los campos.</DialogContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{marginTop: 2, marginLeft: 2, marginRight: 2}}>
            <TextField
              className="nombre-container"
              label="Nombre"
              autoComplete="off"
              value={nombre}
              onChange={handleNameChange}
            />
          </Grid>
          <Grid item xs={12} sx={{marginLeft: 2, marginRight: 2}}>
            <TextField
              className="descripcion-container"
              label="Descripcion"
              autoComplete="off"
              value={descripcion}
              onChange={handleDescriptionChange}
            />
          </Grid>
          <Grid item xs={12} sx={{marginLeft: 2, marginRight: 2}}>
            <TextField
              className="imagen-container"
              label="Imagen"
              autoComplete="off"
              value={imagen}
              onChange={handleImagenChange}
            />
          </Grid>
          <Grid item xs={12} sx={{marginLeft: 2, marginRight: 2, marginBottom: 2}}>
            <TextField
              className="precio-container"
              label="Precio"
              autoComplete="off"
              value={precio}
              onChange={handlePrecioChange}
            />
          </Grid>
          {formError && (
            <Grid item xs={12} justifyContent="flex-end" sx={{marginLeft: 2, marginRight: 2}}>
              <p style={{ color: "red" }}>Llene todos los Campos.</p>
            </Grid>
          )}
          <Grid item xs={12} justifyContent="flex-end">
            <DialogActions>
              <Button onClick={(() => {handleClose() ; clearFields()})}>Cerrar</Button>
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

export default CrearEbook;
