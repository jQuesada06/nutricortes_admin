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
import { db, storage } from "../../firebase/config";
import "./Asociados.css";

const EditarConsultorio = (props) => {
  const { onClose, open, object, onUpdate, flagView } = props;
  const [nombre, setNombre] = useState("");
  const [logo, setLogo] = useState("");
  const [logoURL, setLogoURL] = useState("");
  const [url, setUrl] = useState("");
  const [imagen, setImagen] = useState("");

  const [formError, setFormError] = useState(false);

  useEffect(() => {
    if (object && object.object) {
      setNombre(object.object.Nombre);
      setLogo(object.object.Logo);
      setUrl(object.object.URL);
    }
  }, [object]);

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
    const recetasRef = ref(storage, `asociados/${imageName}`);
    try {
      await uploadBytes(recetasRef, logo);

      const downloadURL = await getDownloadURL(recetasRef);
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

  const deleteImage = async () => {
    const recetasRef = ref(storage, imagen);
    deleteObject(recetasRef)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdate = async () => {
    const collectionRef = doc(db, "asociados", object.object.id);
    await deleteImage();
    const urlLogo = await uploadImage();
    try {
      const asociado = {
        id: object.object.id,
        Nombre: nombre,
        Logo: urlLogo,
        URL: url,
      };
      await setDoc(collectionRef, asociado);
      toast.success("Actualizado", { autoClose: 3000 });
      onUpdate(asociado);
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
    if (nombre === "" || !logo || url === "") {
      setFormError(true);
      return;
    }
    handleUpdate();
    setFormError(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>
        {flagView ? "Ver Asociado" : "Actualizar Asociado"}
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

          {!flagView && (
            <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
              <Grid
                item
                xs={12}
                sx={{ marginLeft: 2, marginRight: 2, marginBottom: 2 }}
              >
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="imagen-file"
                  type="file"
                  onChange={handleLogoChange}
                />
                <label htmlFor="imagen-file">
                  <Button variant="outlined" component="span">
                    Seleccionar Logo
                  </Button>
                </label>
              </Grid>
            </Grid>
          )}

          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            {logoURL || logo ? (
              <div>
                <img
                  src={logoURL || logo}
                  alt={`Asociado-${nombre}`}
                  style={{ maxWidth: "100px" }}
                />
                {!flagView && <Button onClick={handleRemoveImage}>X</Button>}
              </div>
            ) : null}
          </Grid>

          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="URL"
              className="url-container"
              value={url}
              onChange={handleUrlChange}
              disabled={flagView}
              multiline
              rows={4}
            />
          </Grid>
          {!flagView && formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red", textAlign: "center" }}>
                Llene todos los formularios
              </p>
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
