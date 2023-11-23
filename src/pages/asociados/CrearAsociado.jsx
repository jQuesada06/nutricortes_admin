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
  const [logo, setLogo] = useState(null);
  const [logoURL, setLogoURL] = useState(null);
  const [url, setUrl] = useState("");

  const [formError, setFormError] = useState(false);

  const handleClose = () => onClose();
  const handleNameChange = (event) => setNombre(event.target.value);
  const handleUrlChange = (event) => setUrl(event.target.value);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    setLogo(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!logo) {
      toast.error("Debe seleccionar un archivo.", {
        autoClose: 5000,
      });
      return null;
    }
    const timestamp = new Date().getTime();
    const imageName = `${timestamp}_${logo.name}`;
    const logosRef = ref(storage, `asociados/${imageName}`);
    try {
      await uploadBytes(logosRef, logo);

      const downloadURL = await getDownloadURL(logosRef);
      return downloadURL;
    } catch (error) {
      toast.error("Hubo un error al cargar la imagen", {
        autoClose: 3000,
      });
      return null;
    }
  };

  const handleRemoveImage = () => {
    setLogo(null);
    setLogoURL(null);
  };

  const handleCreate = async () => {
    const urlLogo = await uploadImage();
    if (urlLogo) {
      const collectionRef = collection(db, "asociados");
      try {
        const asociado = {
          Nombre: nombre,
          Logo: urlLogo,
          URL: url,
        };

        const docRef = await addDoc(collectionRef, asociado);
        asociado.id = docRef.id;
        onCreate(asociado);
        toast.success("Agregado correctamente", {
          autoClose: 3000,
        });
        clearFields();
        handleClose();
      } catch (error) {
        toast.error("Hubo un error al agregar", {
          autoClose: 3000,
        });
      }
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (nombre === "" || !logo || url === "") {
      setFormError(true);
      return;
    }
    handleCreate();
    setFormError(false);
  };

  const clearFields = () => {
    setNombre("");
    setUrl("");
    setLogo(null);
    setLogoURL(null);
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
              id="imagen-file"
              type="file"
              onChange={handleLogoChange}
            />
            <label htmlFor="imagen-file">
              <Button variant="outlined" component="span">
                Seleccionar Imagen
              </Button>
            </label>
          </Grid>

          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            {logoURL && (
              <div>
                <img
                  src={logoURL}
                  alt={`Asociado-${nombre}`}
                  style={{ maxWidth: "100px" }}
                />
                <Button onClick={handleRemoveImage}>X</Button>
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
