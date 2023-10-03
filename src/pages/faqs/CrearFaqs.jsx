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
import "./Consultorios.css";

const CrearFaqs = (props) => {
  const { onClose, open, onCreate } = props;
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [formError, setFormError] = useState(false);

  const handleClose = () => onClose();
  const handlePreguntaChange = (event) => setPregunta(event.target.value);
  const handleRespuestaChange = (event) => setRespuesta(event.target.value);

  const handleCreate = async () => {
    const db = getFirestore();
    const collectionRef = collection(db, "Faqs");
    try {
      const faq = {
        Pregunta: pregunta,
        Respuesta: respuesta,
      };
      const docRef = await addDoc(collectionRef, faq);
      faq.id = docRef.id;
      onCreate(faq);
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
    if (pregunta === "" || respuesta === "" ) {
      setFormError(true);
      return;
    }
    handleCreate();
    setFormError(false);
  };
  const clearFields = () => {
    setPregunta("");
    setRespuesta("");
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle style={{ textAlign: "center" }}>
        Nueva pregunta frecuente
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}  >
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              className="modal-container"
              label="Pregunta"
              autoComplete="off"
              value={pregunta}
              onChange={handlePreguntaChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              className="modal-container"
              label="Respuesta"
              autoComplete="off"
              value={respuesta}
              onChange={handleRespuestaChange}
              multiline
              rows={6}
            />
          </Grid>
          {formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red" , textAlign: "center" }}>Llene todos los formularios</p>
            </Grid>
          )}
          <Grid item xs={12} justifyContent="flex-end">
            <DialogActions>
              <Button onClick={handleClose} >
                Cerrar
                </Button>
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

export default CrearFaqs;