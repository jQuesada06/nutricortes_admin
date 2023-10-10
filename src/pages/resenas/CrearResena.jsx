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
import "./Resenas.css";
import { db } from "../../firebase/config";


const CrearResena = (props) => {
  const { onClose, open, onCreate } = props;
  const [id, setId] = useState("");
  const [usuario, setUsuario] = useState("");
  const [detalle, setDetalle] = useState("");
  const [puntuacion, setPuntuacion] = useState("");
  const [formError, setFormError] = useState(false);


  const handleClose = () => onClose();
  const handleIdChange = (event) => setId(event.target.value);
  const handleUsuarioChange = (event) => setUsuario(event.target.value);
  const handleDetalleChange = (event) => setDetalle(event.target.value);
  const handlePuntuacionChange = (event) => setPuntuacion(event.target.value);


 
  const handleCreate = async () => {
    const collectionRef = collection(db, "resenas");
    try {
      const resena = {
        Id: id,
        Usuario: usuario,
        Detalle: detalle,
        Puntuacion: puntuacion,
      };
      const docRef = await addDoc(collectionRef, resena);
      resena.id = docRef.id;
      onCreate(resena);
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
    if (id === "" || usuario === "" || detalle === "" || puntuacion === "" ) {
      setFormError(true);
      return;
    }
    handleCreate();
    setFormError(false);
  };
  const clearFields = () => {
    setId("");
    setUsuario("");
    setDetalle("");
    setPuntuacion("");
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }} >Agregar nueva Reseña</DialogTitle>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
               className="modal-container"
               label="Id"
               autoComplete="off"
               value={id}
               onChange={handleIdChange}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
              <TextField
                 className="modal-container"
                 label="Usuario"
                 autoComplete="off"
                 value={usuario}
                 onChange={handleUsuarioChange}
              />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              className="modal-container"
              label="Detalle"
              autoComplete="off"
              value={detalle}
              onChange={handleDetalleChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
          <TextField
                 className="modal-container"
                 label="Puntuación"
                 autoComplete="off"
                 value={puntuacion}
                 onChange={handlePuntuacionChange}
            />
          </Grid>
          {formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red", textAlign: "center" }}>Llene todos los formularios</p>
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

export default CrearResena;
