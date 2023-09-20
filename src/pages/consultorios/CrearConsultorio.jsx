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
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./Consultorios.css";

const CrearConsultorio = (props) => {
  const { onClose, open, onCreate } = props;
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [formError, setFormError] = useState(false);

  const handleClose = () => onClose();
  const handleNameChange = (event) => setNombre(event.target.value);
  const handlePhoneChange = (event) => setTelefono(event.target.value);
  const handleLocationChange = (event) => setUbicacion(event.target.value);

  const isPhoneValid = (phone) => {
    if (phone.length === 0) return true;
    const phoneRegex = /^\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handleCreate = async () => {
    const db = getFirestore();
    const collectionRef = collection(db, "consultorios");
    try {
      const consultorio = {
        Nombre: nombre,
        Telefono: telefono,
        Ubicacion: ubicacion,
      };
      const docRef = await addDoc(collectionRef, consultorio);
      consultorio.id = docRef.id;
      onCreate(consultorio);
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
    if (nombre === "" || telefono === "" || ubicacion === "") {
      setFormError(true);
      return;
    }
    handleCreate();
    setFormError(false);
  };
  const clearFields = () => {
    setNombre("");
    setTelefono("");
    setUbicacion("");
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Agregar Nuevo Consutorio</DialogTitle>
      <DialogContent>Favor llenar todos los campos.</DialogContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              className="nombre-container"
              label="Nombre"
              autoComplete="off"
              value={nombre}
              onChange={handleNameChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Tooltip title="Ejemplo: 8888-8888" arrow followCursor>
              <TextField
                className="telefono-container"
                label="Telefono"
                autoComplete="off"
                value={telefono}
                error={!isPhoneValid(telefono)}
                onChange={handlePhoneChange}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <TextField
              className="ubicacion-container"
              label="Ubicacion"
              autoComplete="off"
              value={ubicacion}
              onChange={handleLocationChange}
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

export default CrearConsultorio;
