import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  Grid,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import { collection, addDoc } from "@firebase/firestore";
import { toast } from "react-toastify";
import "./Consultorios.css";
import { db } from "../../firebase/config";

const CrearConsultorio = (props) => {
  const { onClose, open, onCreate } = props;
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [formError, setFormError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);

  const options = ["Mañana", "Tarde"];

  const handleClose = () => onClose();
  const handleNameChange = (event) => setNombre(event.target.value);
  const handleLocationChange = (event) => setUbicacion(event.target.value);
  const handleLatitudChange = (event) => setLatitud(event.target.value);
  const handleLogitudChange = (event) => setLongitud(event.target.value);

  const isPhoneValid = (phone) => {
    if (phone.length === 0) return true;
    const phoneRegex = /^\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

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

  const handleCreate = async () => {
    const collectionRef = collection(db, "consultorios");
    try {
      const consultorio = {
        Nombre: nombre,
        Telefono: telefono,
        Ubicacion: ubicacion,
        Horarios: horarios,
        Coordenadas: {
          Latitud: latitud,
          Longitud: longitud,
        },
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
    if (
      nombre === "" ||
      telefono === "" ||
      ubicacion === "" ||
      latitud === "" ||
      longitud === ""
    ) {
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
    setHorarios([]);
    setLatitud(0);
    setLongitud(0);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>
        Agregar nuevo Consutorio
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              className="nombre-container"
              label="Nombre"
              autoComplete="off"
              value={nombre}
              onChange={handleNameChange}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
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
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
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
                  onChange={handleLatitudChange}
                />
              </Grid>
              <Grid item xs={6} sx={{ marginLeft: 2, marginRight: 2 }}>
                <TextField
                  className="longitude-container"
                  label="Longitude"
                  autoComplete="off"
                  value={longitud}
                  onChange={handleLogitudChange}
                />
              </Grid>
            </div>
          </div>

          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <Autocomplete
              multiple
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
          </Grid>
          {formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red", textAlign: "center" }}>
                Llene todos los formularios
              </p>
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
