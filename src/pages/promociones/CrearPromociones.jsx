import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Grid,
} from "@mui/material";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./Promociones.css";

const CrearPromociones = (props) => {
  const { onClose, open, onCreate } = props;
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [formError, setFormError] = useState(false);

  const handleClose = () => onClose();
  const handleTituloChange = (event) => setTitulo(event.target.value);
  const handleDescripcionChange = (event) => setDescripcion(event.target.value);

  const handleCreate = async () => {
    const db = getFirestore();
    const collectionRef = collection(db, "Promociones");
    try {
      const promocion = {
        Titulo: titulo,
        Descripcion: descripcion,
      };
      const docRef = await addDoc(collectionRef, promocion);
      promocion.id = docRef.id;
      onCreate(promocion);
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
    if (titulo === "" || descripcion === "" ) {
      setFormError(true);
      return;
    }
    handleCreate();
    setFormError(false);
  };
  const clearFields = () => {
    setTitulo("");
    setDescripcion("");
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Agregar nueva promocion</DialogTitle>
      <DialogContent>Favor llenar todos los campos.</DialogContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              className="titulo-container"
              label="Titulo"
              autoComplete="off"
              value={titulo}
              onChange={handleTituloChange}
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className="descripcion-container"
              label="Descripción"
              autoComplete="off"
              value={descripcion}
              onChange={handleDescripcionChange}
              multiline
              rows={4}
            />
          </Grid>
          {formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red" }}>Llene todos los formularios.</p>
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

export default CrearPromociones;