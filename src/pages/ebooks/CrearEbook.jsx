import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "@firebase/firestore";
import { toast } from "react-toastify";
import "./Ebook.css";
import { db, storage, storageEbooksRef } from "../../firebase/config";

const CrearEbook = (props) => {
  const { onClose, open, onCreate } = props;
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [precio, setPrecio] = useState("");
  const [formError, setFormError] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => onClose();
  const handleNameChange = (event) => setNombre(event.target.value);
  const handleDescriptionChange = (event) => setDescripcion(event.target.value);
  const handlePrecioChange = (event) => setPrecio(event.target.value);

  const uploadImage = async () => {
    if (!image) {
      alert("Selecciona un archivo primero.");
      return;
    }
    const timestamp = new Date().getTime(); // Obtiene la marca de tiempo actual en milisegundos
    const imageName = `${timestamp}_${image.name}`;
    const ebooksRef = ref(storage, `ebooks/${imageName}`);
    try {
      await uploadBytes(ebooksRef, image);

      // Obtiene la URL de descarga del archivo subido
      const downloadURL = await getDownloadURL(ebooksRef);
      return downloadURL;
    } catch (error) {
      console.log(error);
      alert("Error al cargar la imagen.");
    }
  };

  const handleCreate = async () => {
    const collectionRef = collection(db, "Ebooks");

    const url = await uploadImage();

    try {
      const plan = {
        Nombre: nombre,
        Descripcion: descripcion,
        Imagen: url,
        Precio: precio,
      };
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
    if (nombre === "" || descripcion === "" || precio === "") {
      setFormError(true);
      return;
    }
    handleCreate();
    setFormError(false);
  };
  const clearFields = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setImage(null);
    setImageURL(null);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>
        Agregar nuevo eBook
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{ marginTop: 2, marginLeft: 2, marginRight: 2 }}
          >
            <TextField
              className="nombre-container"
              label="Nombre"
              autoComplete="off"
              value={nombre}
              onChange={handleNameChange}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              className="descripcion-container"
              label="Descripción"
              autoComplete="off"
              value={descripcion}
              onChange={handleDescriptionChange}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <Card>
              <CardContent>
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <Button variant="outlined" component="span">
                    Subir imagen
                  </Button>
                </label>
                {imageURL && (
                  <CardMedia
                    sx={{ marginTop: "20px" }}
                    component="img"
                    alt="Imagen seleccionada"
                    height="auto"
                    image={imageURL}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ marginLeft: 2, marginRight: 2, marginBottom: 2 }}
          >
            <TextField
              className="precio-container"
              label="Precio"
              autoComplete="off"
              value={precio}
              onChange={handlePrecioChange}
            />
          </Grid>
          {formError && (
            <Grid
              item
              xs={12}
              justifyContent="flex-end"
              sx={{ marginLeft: 2, marginRight: 2 }}
            >
              <p style={{ color: "red", textAlign: "center" }}>
                Llene todos los Campos
              </p>
            </Grid>
          )}
          <Grid item xs={12} justifyContent="flex-end">
            <DialogActions>
              <Button
                onClick={() => {
                  handleClose();
                  clearFields();
                }}
              >
                Cerrar
              </Button>
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

export default CrearEbook;
