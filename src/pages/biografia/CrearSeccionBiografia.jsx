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

const CrearSeccionBiografia = (props) => {
  const { onClose, open, onCreate } = props;
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [formError, setFormError] = useState(false);

  const handleClose = () => onClose();
  const handleTituloChange = (event) => setTitulo(event.target.value);
  const handleDescripcionChange = (event) => setDescripcion(event.target.value);

  const handleCreate = async () => {
    const db = getFirestore();
    const collectionRef = collection(db, "Biografia", "0EcTr5XsdkxeuWtPiBpY", "secciones");
    try {
      const seccion = {
        titulo: titulo,
        descripcion: descripcion,
      };
      // Agregar un documento con un ID generado automáticamente
      const docRef = await addDoc(collectionRef, seccion);
      seccion.id = docRef.id; // Asignar el ID generado automáticamente al objeto seccion
      onCreate(seccion);
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
    if (titulo === "" || descripcion === "") {
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
      <DialogTitle>Nueva sección de Biografía</DialogTitle>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} container justifyContent="center" alignItems="center" mb={2}>
            <TextField
              className="modal-container"
              label="Título"
              autoComplete="off"
              value={titulo}
              onChange={handleTituloChange}
            />
          </Grid>
          <Grid item xs={12} container justifyContent="center" alignItems="center" mb={2}>
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
          {formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red" }}>Llene todos los formularios.</p>
            </Grid>
          )}
          <Grid item xs={12} justifyContent="flex-end">
            <DialogActions>
              <Button onClick={handleClose} variant="contained" color="error">
                Cerrar
              </Button>
              <Button type="submit" variant="contained" color="success">
                Guardar
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </form>
    </Dialog>
  );
};

export default CrearSeccionBiografia;
