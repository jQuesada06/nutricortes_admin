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
import "./Resenas.css";
import { db } from "../../firebase/config";

const EditarResena = (props) => {
  const { onClose, open, object, onUpdate, flagView } = props;
  const [id, setId] = useState("");
  const [usuario, setUsuario] = useState("");
  const [detalle, setDetalle] = useState("");
  const [puntuacion, setDPuntuacion] = useState("");
  const [formError, setFormError] = useState(false);



  useEffect(() => {
    if (object && object.object) {
      setId(object.object.Id);
      setUsuario(object.object.Usuario);
      setDetalle(object.object.Detalle);
      setDPuntuacion(object.object.Puntuacion);
    }
  }, [object]);

  const handleClose = () => onClose();
  const handleIdChange = (event) => setId(event.target.value);
  const handleUsuarioChange = (event) => setUsuario(event.target.value);
  const handleDetalleChange = (event) => setDetalle(event.target.value);
  const handlePuntuacionChange = (event) => setDPuntuacion(event.target.value);


  const handleUpdate = async () => {
    const collectionRef = doc(db, "resenas", object.object.id);
    try {
      const resena = {
        id: object.object.id,
        Id: id,
        Usuario: usuario,
        Detalle: detalle,
        Puntuacion: puntuacion,
      };
      await setDoc(collectionRef, resena);
      toast.success("Actualizado", { autoClose: 3000 });
      onUpdate(resena);
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
    if (id === "" || usuario === "" || detalle === "" || puntuacion === "" ) {
      setFormError(true);
      return;
    }
    handleUpdate();
    setFormError(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>
        {flagView ? "Ver Reseña" : "Actualizar Reseña"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
               label="Id"
               className="modal-container"
               autoComplete="off"
               value={id}
               onChange={handleIdChange}
               disabled={flagView}
            />
          </Grid>
          <Grid item xs={12}sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Usuario"
              className="modal-container"
              value={usuario}
              autoComplete="off"
              onChange={handleUsuarioChange}
              disabled={flagView}
            />
          </Grid>
          <Grid item xs={12}sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
             label="Detalle"
             className="modal-container"
             value={detalle}
             autoComplete="off"
             onChange={handleDetalleChange}
             disabled={flagView}
             multiline
             rows={3}
            />
          </Grid>
          <Grid item xs={12}sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
             label="Puntuación"
             className="modal-container"
             value={puntuacion}
             autoComplete="off"
             onChange={handlePuntuacionChange}
             disabled={flagView}
            />
          </Grid>

          {!flagView && formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red" , textAlign: "center" }}>Llene todos los formularios</p>
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

export default EditarResena;
