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
import "./Consultorios.css";
import Autocomplete from "@mui/material/Autocomplete";
import { db } from "../../firebase/config";

const EditarConsultorio = (props) => {
  const { onClose, open, object, onUpdate, flagView } = props;
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [formError, setFormError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [latitud, setLatitude] = useState(0);
  const [longitud, setLongitude] = useState(0);

  const options = ["Mañana", "Tarde"];

  useEffect(() => {
    if (object && object.object) {
      setNombre(object.object.Nombre);
      setTelefono(object.object.Telefono);
      setUbicacion(object.object.Ubicacion);
      setHorarios(object.object.Horarios || []);
      setLatitude(object.object.Coordenadas.Latitud);
      setLongitude(object.object.Coordenadas.Longitud);
    }
  }, [object]);

  const handleClose = () => onClose();
  const handleNameChange = (event) => setNombre(event.target.value);
  const handleLocationChange = (event) => setUbicacion(event.target.value);

  const handlePhoneChange = (event) => {
    let input = event.target.value.replace(/\D/g, "");

    if (event.nativeEvent.inputType === "deleteContentBackward") {
      if (input.length === 5) {
        input = input.substring(0, input.length - 1);
      }
    } else {
      input = input.slice(0, 8).replace(/(\d{4})(\d{0,4})/, "$1-$2");
    }

    const hasError = input.length < 8 && input.length > 0;

    setTelefono(input);
    setPhoneError(hasError);
  };

  const handleLatChange = (event) => {
    setLatitude(event.target.value);
  };
  const handleLonChange = (event) => {
    setLongitude(event.target.value);
  };

  const handleUpdate = async () => {
    const collectionRef = doc(db, "consultorios", object.object.id);
    try {
      const consultorio = {
        id: object.object.id,
        Nombre: nombre,
        Telefono: telefono,
        Ubicacion: ubicacion,
        Horarios: horarios,
        Coordenadas: {
          Latitud: latitud,
          Longitud: longitud,
        },
      };
      await setDoc(collectionRef, consultorio);
      toast.success("Actualizado", { autoClose: 3000 });
      onUpdate(consultorio);
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
    if (nombre === "" || telefono === "" || ubicacion === "") {
      setFormError(true);
      return;
    }
    handleUpdate();
    setFormError(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>
        {flagView ? "Ver Consultorio" : "Actualizar Consultorio"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Nombre"
              className="nombre-container"
              value={nombre}
              onChange={handleNameChange}
              disabled={flagView}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Teléfono"
              className="telefono-container"
              value={telefono}
              onChange={handlePhoneChange}
              disabled={flagView}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 2,
              marginRight: 2,
            }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Grid item xs={6} sx={{ marginLeft: 4, marginRight: 4 }}>
                <TextField
                  className="latitude-container"
                  label="Latitude"
                  autoComplete="off"
                  value={latitud}
                  onChange={handleLatChange}
                  disabled={flagView}
                />
              </Grid>
              <Grid item xs={6} sx={{ marginLeft: 2, marginRight: 2 }}>
                <TextField
                  className="longitude-container"
                  label="Longitude"
                  autoComplete="off"
                  value={longitud}
                  onChange={handleLonChange}
                  disabled={flagView}
                />
              </Grid>
            </div>
          </div>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            {flagView ? (
              <TextField
                className="horarios-container"
                label="Horarios"
                disabled={flagView}
                fullWidth
                value={horarios}
                InputProps={{
                  readOnly: true,
                }}
              />
            ) : (
              <Autocomplete
                multiple
                disabled={flagView}
                className="horarios-container"
                options={options}
                value={horarios}
                onChange={(event, newValue) => setHorarios(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="horarios-container"
                    label="Horarios"
                    fullWidth
                  />
                )}
              />
            )}
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

export default EditarConsultorio;
