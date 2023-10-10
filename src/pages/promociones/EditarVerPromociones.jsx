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

const EditarPromociones = (props) => {
  const { onClose, open, object, onUpdate, flagView } = props;
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    if (object && object.object) {
      setTitulo(object.object.Titulo);
      setDescripcion(object.object.Descripcion);
    }
  }, [object]);

  const handleClose = () => onClose();
  const handleTituloChange = (event) => setTitulo(event.target.value);
  const handleDescripcionChange = (event) => setDescripcion(event.target.value);

  const handleUpdate = async () => {
    const db = getFirestore();
    const collectionRef = doc(db, "Promociones", object.object.id);
    try {
      const promociones = {
        id: object.object.id,
        Titulo: titulo,
        Descripcion: descripcion,
      };
      await setDoc(collectionRef, promociones);
      toast.success("Actualizado", { autoClose: 3000 });
      onUpdate(promociones);
    } catch (error) {
      alert(error);
      toast.error("¡Error al actualizar la pregunta frecuente!", {
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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{textAlign: "center"}} >
        {flagView ? "Ver promoción" : "Actualizar promoción"}
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
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
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

export default EditarPromociones;
