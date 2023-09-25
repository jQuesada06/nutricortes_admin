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
import { getFirestore, setDoc, doc} from '@firebase/firestore'
import { toast } from "react-toastify";
import "./Consultorios.css";
import { db } from "../../firebase/config";

const EditarConsultorio = (props) => {
  const { onClose, open, object, onUpdate, flagView } = props;
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    if (object && object.object) {
      setNombre(object.object.Nombre);
      setTelefono(object.object.Telefono);
      setUbicacion(object.object.Ubicacion);
    }
  }, [object]);

  const handleClose = () => onClose();
  const handleNameChange = (event) => setNombre(event.target.value);
  const handlePhoneChange = (event) => setTelefono(event.target.value);
  const handleLocationChange = (event) => setUbicacion(event.target.value);

  const handleUpdate = async () => {
    const collectionRef = doc(db, "consultorios", object.object.id);
    try {
      const consultorio = {
        id: object.object.id,
        Nombre: nombre,
        Telefono: telefono,
        Ubicacion: ubicacion,
      };
      await setDoc(collectionRef, consultorio);
      toast.success("Actualizado", { autoClose: 3000 });
      onUpdate(consultorio);
    } catch (error) {
      alert(error);
      toast.error("¡Error al actualizar al profesor!", {
        autoClose: 3000,
      });
    }
    handleClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (nombre === "" || telefono === "" || ubicacion === "") {
      setFormError(true);
      return;
    }
    handleUpdate();
    setFormError(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {flagView ? "Ver Consultorio" : "Actualizar Consultorio"}
      </DialogTitle>
      <DialogContent>
        {flagView
          ? "Detallade del Consultorio"
          : "Edite a los datos del Consultorio existente."}
      </DialogContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              className="nombre-container"
              value={nombre}
              onChange={handleNameChange}
              disabled={flagView}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Teléfono"
              className="telefono-container"
              value={telefono}
              onChange={handlePhoneChange}
              disabled={flagView}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Ubicación"
              className="ubicacion-container"
              value={ubicacion}
              onChange={handleLocationChange}
              disabled={flagView}
              multiline
              rows={4}
            />
          </Grid>
          {!flagView && formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red" }}>Llene todos los formularios.</p>
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

export default EditarConsultorio;
