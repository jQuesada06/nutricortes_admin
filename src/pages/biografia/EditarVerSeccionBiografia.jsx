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
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./Consultorios.css";

const EditarVerSeccionBiografia = (props) => {
  const { onClose, open, object, onUpdate, flagView, rows } = props;
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    if (object && object.id) {
      setTitulo(object.titulo);
      setDescripcion(object.descripcion);
    }
  }, [object]);

  const handleClose = () => onClose();
  const handleTituloChange = (event) => setTitulo(event.target.value);
  const handleDescripcionChange = (event) => setDescripcion(event.target.value);

  const handleUpdate = async () => {
    const db = getFirestore();
    const biografiaDocumentRef = doc(db, "Biografia", "0EcTr5XsdkxeuWtPiBpY");
    
    try {
      const seccion = {
        titulo: titulo,
        descripcion: descripcion,
      };
      const seccionId = object.id; // Mantén el mismo ID
  
      // Asegúrate de declarar la variable rows
      const updatedSections = rows.map((row) =>
        row.id === seccionId ? { id: seccionId, ...seccion } : row
      );
  
      await setDoc(biografiaDocumentRef, { secciones: updatedSections }, { merge: true });
      toast.success("Actualizado", { autoClose: 3000 });
      onUpdate({ id: seccionId, ...seccion }); // Mantener el mismo ID
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("¡Error al actualizar la sección de biografía!", {
        autoClose: 3000,
      });
    }
    handleClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (titulo === "" || descripcion === "") {
      setFormError(true);
      return;
    }
    handleUpdate();
    setFormError(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle style={{ textAlign: "center" }}>
        {flagView ? "Ver sección de Biografía" : "Actualizar sección de Biografía"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} container justifyContent="center" alignItems="center" mb={2}>
            <TextField
              label="Título"
              className="modal-container"
              value={titulo}
              onChange={handleTituloChange}
              disabled={flagView}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} container justifyContent="center" alignItems="center" mb={2}>
            <TextField
              label="Descripción"
              className="modal-container"
              value={descripcion}
              onChange={handleDescripcionChange}
              disabled={flagView}
              multiline
              rows={6}
            />
          </Grid>
          {!flagView && formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red",  textAlign: "center" }}>Llene todos los formularios</p>
            </Grid>
          )}
          <Grid item xs={12} justifyContent="flex-end" >
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
                  <Button onClick={handleClose}>
                    Cerrar
                  </Button>
                  <Button type="submit" variant="contained" >
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

export default EditarVerSeccionBiografia;
