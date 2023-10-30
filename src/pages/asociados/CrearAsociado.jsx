import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  Grid,
} from "@mui/material";
import { collection, addDoc } from "@firebase/firestore";
import { toast } from "react-toastify";
import { db, storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import "./Asociados.css";

const CrearConsultorio = (props) => {
  const { onClose, open, onCreate } = props;
  const [nombre, setNombre] = useState("");
  const [logo, setLogo] = useState("");
  const [url, setUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [formError, setFormError] = useState(false);

  const handleClose = () => onClose();
  const handleNameChange = (event) => setNombre(event.target.value);
  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };
  const handleUrlChange = (event) => setUrl(event.target.value);
  const handleRemoveLogo = () => {
    setImagePreview(null);
  };

  const handleCreate = async () => {
    const collectionRef = collection(db, "asociados");

    let imageUrl = "";

    if (imagePreview) {
      try {
        const storageRef = ref(
          storage,
          `logos/${new Date().getTime()}_${imagePreview.name}`
        );
        await uploadBytes(storageRef, imagePreview);
        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error uploading image to Firebase Storage", error);
        toast.error("Error al subir la imagen", { autoClose: 3000 });
        return;
      }
    }

    try {
      const asociado = {
        Nombre: nombre,
        Logo: imageUrl,
        URL: url,
      };

      const docRef = await addDoc(collectionRef, asociado);
      asociado.id = docRef.id;
      onCreate(asociado);
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
    if (nombre === "" || !imagePreview || url === "") {
      setFormError(true);
      return;
    }
    setFormError(false);
    handleCreate();
  };
  const clearFields = () => {
    setNombre("");
    setLogo("");
    setUrl("");
    setImagePreview(null);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>
        Agregar nuevo Asociado
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              value={nombre}
              onChange={handleNameChange}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="logo-file"
              type="file"
              onChange={handleLogoChange}
            />
            <label htmlFor="logo-file">
              <Button variant="outlined" component="span">
                Seleccionar Logo
              </Button>
            </label>
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            {imagePreview && (
              <div>
                <img
                  src={imagePreview}
                  alt={`Logo-${nombre}`}
                  style={{ maxWidth: "100px" }}
                />
                <Button onClick={handleRemoveLogo}>X</Button>
              </div>
            )}
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="URL"
              variant="outlined"
              fullWidth
              value={url}
              onChange={handleUrlChange}
            />
          </Grid>
          {formError && (
            <Grid item xs={12}>
              <p style={{ color: "red", textAlign: "center" }}>
                Debe llenar todos los datos
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
