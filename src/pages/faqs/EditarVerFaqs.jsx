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

const EditarFaqs = (props) => {
  const { onClose, open, object, onUpdate, flagView } = props;
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    if (object && object.object) {
      setPregunta(object.object.Pregunta);
      setRespuesta(object.object.Respuesta);
    }
  }, [object]);

  const handleClose = () => onClose();
  const handlePreguntaChange = (event) => setPregunta(event.target.value);
  const handleRespuestaChange = (event) => setRespuesta(event.target.value);

  const handleUpdate = async () => {
    const db = getFirestore();
    const collectionRef = doc(db, "Faqs", object.object.id);
    try {
      const faq = {
        id: object.object.id,
        Pregunta: pregunta,
        Respuesta: respuesta,
      };
      await setDoc(collectionRef, faq);
      toast.success("Actualizado", { autoClose: 3000 });
      onUpdate(faq);
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
    if (pregunta === "" || respuesta === "") {
      setFormError(true);
      return;
    }
    handleUpdate();
    setFormError(false);
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle  style={{ textAlign: "center" }}>
        {flagView ? "Ver pregunta frecuente" : "Actualizar pregunta frecuente"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Pregunta"
              className="modal-container"
              value={pregunta}
              onChange={handlePreguntaChange}
              disabled={flagView}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Respuesta"
              className="modal-container"
              value={respuesta}
              onChange={handleRespuestaChange}
              disabled={flagView}
              multiline
              rows={6}
            />
          </Grid>
          {!flagView && formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red", }}>Llene todos los formularios.</p>
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

export default EditarFaqs;