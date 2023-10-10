import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Grid,
  ListItem,
  ListItemText,
  List,
  Typography,
  Select,
  MenuItem
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { getFirestore, setDoc, doc } from '@firebase/firestore'
import { toast } from "react-toastify";
import "./Planes.css";
import { db } from "../../firebase/config";

const EditarPlan = (props) => {
  const { onClose, open, object, onUpdate, flagView } = props;
  const [nombre, setNombre] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [detalle, setDetalle] = useState("");
  const [detalles, setDetalles] = useState([]);
  const [precio, setPrecio] = useState("");
  const [dense, setDense] = React.useState(false);
  const [formError, setFormError] = useState(false);
  const [detalleError, setDetalleError] = useState(false)

  useEffect(() => {
    if (object && object.object) {
      setNombre(object.object.Nombre);
      setModalidad(object.object.Modalidad);
      setDetalles(object.object.Detalles);
      setPrecio(object.object.Precio);
    }
  }, [object]);

  const handleClose = () => onClose();
  const handleNameChange = (event) => setNombre(event.target.value);
  const handleModalidadChange = (event) => setModalidad(event.target.value);
  const handleDetalleChange = (event) => setDetalle(event.target.value);
  const handlePrecioChange = (event) => setPrecio(event.target.value);
  const deleteDetalle = (key) => {
    const newDetalles = [...detalles]; // Copiamos la lista actual
    newDetalles.splice(key, 1); // Eliminamos el elemento en la posición dada
    setDetalles(newDetalles); // Actualizamos el estado con la nueva lista
  };

  const addDetalle = () => {
    if (detalle !== "") {
      setDetalles([...detalles, detalle]); // Agrega el nuevo elemento a la lista
      setDetalle("")
      setDetalleError(false)
    }
    else {
      setDetalleError(true);
    }
  };

  const handleUpdate = async () => {
    const collectionRef = doc(db, "Planes", object.object.id);
    try {
      const plan = {
        id: object.object.id,
        Nombre: nombre,
        Modalidad: modalidad,
        Detalles: detalles,
        Precio: precio
      };
      await setDoc(collectionRef, plan);
      toast.success("Actualizado", { autoClose: 3000 });
      onUpdate(plan);
    } catch (error) {
      alert(error);
      toast.error("¡Error al actualizar el Plan!", {
        autoClose: 3000,
      });
    }
    handleClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (nombre === "" || modalidad === "" || precio === "" || detalles.length === 0) {
      setFormError(true);
      return;
    }
    handleUpdate();
    setFormError(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>
        {flagView ? "Ver Plan" : "Actualizar Plan"}
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
              disabled={flagView}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <Select
              className="modalidad-container"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={modalidad}
              label="Modalidad"
              onChange={handleModalidadChange}
              disabled={flagView}
            >
              <MenuItem value={"Presencial"}>Presencial</MenuItem>
              <MenuItem value={"Virtual"}>Virtual</MenuItem>
            </Select>
          </Grid>
          <Grid container hidden={flagView} alignItems="center" item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <Grid item xs={11} >
              <TextField
                helperText={detalleError ? "Detalle en blanco" : " "}
                className="ubicacison-container"
                label="Detalle"
                autoComplete="off"
                value={detalle}
                onChange={handleDetalleChange}
              />
            </Grid>
            <Grid item xs={1} >
              <IconButton edge="end" aria-label="add" onClick={() => addDetalle()}>
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={12} hidden={!flagView} sx={{ marginLeft: 2, marginRight: 2 }} >
            <Typography  variant="h6" >
              Detalles
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {detalles.length !== 0 ?
              <List dense={dense}>
                {detalles.map((element, index) => (
                  <ListItem key={index} disabled={flagView}
                    secondaryAction={
                      <IconButton style={{ display: flagView ? 'none' : 'block' }} edge="end" aria-label="delete" onClick={() => deleteDetalle(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }>

                    <ListItemText
                      primary={'• ' + element}
                    >{element}</ListItemText>
                  </ListItem>
                ))}
              </List> :

              (<Typography sx={{ marginLeft: 2, marginRight: 2 }}>*Agrega algún detalle</Typography>)
            }
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              className="ubicacion-container"
              label="Precio"
              autoComplete="off"
              value={precio}
              onChange={handlePrecioChange}
              disabled={flagView}
            />
          </Grid>
          {!flagView && formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red",textAlign: "center"  }}>Llene todos los formularios</p>
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

export default EditarPlan;
