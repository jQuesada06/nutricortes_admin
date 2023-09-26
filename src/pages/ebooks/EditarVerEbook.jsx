import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Grid
} from "@mui/material";
import { setDoc, doc } from '@firebase/firestore'
import { toast } from "react-toastify";
import "./Ebook.css";
import { db } from "../../firebase/config";

const EditarEbook = (props) => {
  const { onClose, open, object, onUpdate, flagView } = props;
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [precio, setPrecio] = useState("");
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    if (object && object.object) {
      setNombre(object.object.Nombre);
      setDescripcion(object.object.Descripcion);
      setImagen(object.object.Imagen);
      setPrecio(object.object.Precio);
    }
  }, [object]);

  const handleClose = () => onClose();
  const handleNameChange = (event) => setNombre(event.target.value);
  const handleDescriptionChange = (event) => setDescripcion(event.target.value);
  const handleImagenChange = (event) => setImagen(event.target.value);
  const handlePrecioChange = (event) => setPrecio(event.target.value);
  


  const handleUpdate = async () => {
    const collectionRef = doc(db, "Ebooks", object.object.id);
    try {
      const plan = {
        id: object.object.id,
        Nombre: nombre,
        Descripcion: descripcion,
        Imagen: imagen,
        Precio: precio
      };
      await setDoc(collectionRef, plan);
      toast.success("Actualizado", { autoClose: 3000 });
      onUpdate(plan);
    } catch (error) {
      alert(error);
      toast.error("¡Error al actualizar el ebook!", {
      });
    }
    handleClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (nombre === "" || descripcion === "" || imagen === "" || precio === "") {
      setFormError(true);
      return;
    }
    handleUpdate();
    setFormError(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {flagView ? "Ver Plan" : "Actualizar Plan"}
      </DialogTitle>
      <DialogContent>
        {flagView
          ? "Detallade del Plan"
          : "Edite a los datos del Plan existente."}
      </DialogContent>
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
            <TextField
              className="nombre-container"
              label="Descripcion"
              autoComplete="off"
              value={descripcion}
              onChange={handleDescriptionChange}
              disabled={flagView}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              className="imagen-container"
              label="Imagen"
              autoComplete="off"
              value={imagen}
              onChange={handleImagenChange}
              disabled={flagView}
            />
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

export default EditarEbook;
