import React, { useState } from "react";
import { createData } from "../../firebase/create";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Grid,
  Tooltip,
  Select,
  MenuItem,
  InputLabel,
  ListItem,
  ListItemText,
  List,
  Typography
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { getFirestore, collection, addDoc } from "@firebase/firestore";
import { toast } from "react-toastify";
import "./Planes.css";
import { db } from "../../firebase/config";

const CrearPlan = (props) => {
  const { onClose, open, onCreate } = props;
  const [nombre, setNombre] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [detalle, setDetalle] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [precio, setPrecio] = useState("");
  const [detalleError, setDetalleError] = useState(false)
  const [formError, setFormError] = useState(false);
  const [dense, setDense] = React.useState(false);

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
    if (detalle !== ""){
      setDetalles([...detalles, detalle]); // Agrega el nuevo elemento a la lista
      setDetalle("")
      setDetalleError(false)
    }
    else{
      setDetalleError(true);
    }
  };


  const handleCreate = async () => {
    const collectionRef = collection(db, "Planes");
    try {
      const plan = {
        Nombre: nombre,
        Modalidad: modalidad,
        Detalles: detalles,
        Precio: precio
      };
      createData("planes", plan);
      const docRef = await addDoc(collectionRef, plan);
      plan.id = docRef.id;
      onCreate(plan);
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
    if (nombre === "" || modalidad === "" || precio === "" || detalles.length === 0 ) {
      setFormError(true);
      return;
    }
    handleCreate();
    setFormError(false);
  };
  const clearFields = () => {
    setNombre("");
    setModalidad("");
    setDetalles([]);
    setPrecio("");
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Agregar Nuevo Plan</DialogTitle>
      <DialogContent>Favor llenar todos los campos.</DialogContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{marginLeft: 2, marginRight: 2}}>
            <TextField
              className="nombre-container"
              label="Nombre"
              autoComplete="off"
              value={nombre}
              onChange={handleNameChange}
            />
          </Grid>
          <Grid item xs={12} sx={{marginLeft: 2, marginRight: 2}}>
            <Select
              className="modalidad-container"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={modalidad}
              label="Modalidad"
              onChange={handleModalidadChange}
            >
              <MenuItem value={"Presencial"}>Presencial</MenuItem>
              <MenuItem value={"Virtual"}>Virtual</MenuItem>
            </Select>
          </Grid>
          <Grid container alignItems="center"  item xs={12} sx={{marginLeft: 2, marginRight: 2}}>
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
          <Grid item xs={12}>
            {detalles.length !== 0 ?
              <List dense={dense}>
                {detalles.map((element, index) => (
                  <ListItem key={index}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => deleteDetalle(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={element}
                    >{element}</ListItemText>
                  </ListItem>
                ))}
              </List> :

              (<Typography sx={{marginLeft: 2, marginRight: 2}}>*Agrega algun detalle</Typography>)
            }
          </Grid>
          <Grid item xs={12} sx={{marginLeft: 2, marginRight: 2}}>
            <TextField
              className="ubicacion-container"
              label="Precio"
              autoComplete="off"
              value={precio}
              onChange={handlePrecioChange}
            />
          </Grid>
          {formError && (
            <Grid item xs={12} justifyContent="flex-end" sx={{marginLeft: 2, marginRight: 2}}>
              <p style={{ color: "red" }}>Llene todos los Campos.</p>
            </Grid>
          )}
          <Grid item xs={12} justifyContent="flex-end">
            <DialogActions>
              <Button onClick={(() => {handleClose() ; clearFields()})}>Cerrar</Button>
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

export default CrearPlan;
