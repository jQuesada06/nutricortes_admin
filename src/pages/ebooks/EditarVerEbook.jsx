import React, { useState, useEffect } from "react";
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
  CardMedia
} from "@mui/material";
import { setDoc, doc } from '@firebase/firestore'
import { toast } from "react-toastify";
import "./Ebook.css";
import { db, storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";


const EditarEbook = (props) => {
  const { onClose, open, object, onUpdate, flagView } = props;
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
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
  const handlePrecioChange = (event) => setPrecio(event.target.value);


  const deleteImage = async () => {
    const ebooksRef = ref(storage, imagen)
    deleteObject(ebooksRef).then(() => {
      // File deleted successfully
    }).catch((error) => {
      console.log(error)
    });
  };

  const uploadImage = async () => {
    if (!image) {
      alert('Selecciona un archivo primero.');
      return;
    }
    const timestamp = new Date().getTime(); // Obtiene la marca de tiempo actual en milisegundos
    const imageName = `${timestamp}_${image.name}`;
    const ebooksRef = ref(storage, `ebooks/${imageName}`)
    try {
      await uploadBytes(ebooksRef, image);

      // Obtiene la URL de descarga del archivo subido
      const downloadURL = await getDownloadURL(ebooksRef);
      return downloadURL;
    } catch (error) {
      toast.error("Error al cargar la imagen", { autoClose: 3000 });
    }
  };

  
  const handleUpdate = async () => {
    const collectionRef = doc(db, "Ebooks", object.object.id);
    await deleteImage();
    const url = await uploadImage();
    try {
      
      const plan = {
        id: object.object.id,
        Nombre: nombre,
        Descripcion: descripcion,
        Imagen: url,
        Precio: precio
      };
      await setDoc(collectionRef, plan);
      toast.success("Actualizado", { autoClose: 3000 });
      onUpdate(plan);
    } catch (error) {
      alert(error);
      toast.error("¡Error al actualizar el ebook!", {
        autoClose: 3000,
      });
    }
    handleClose();
    setImage(null);
  };

  const clearFields = () => {
    setNombre("");
    setDescripcion("");
    setPrecio("");
    setImage(null)
    setImageURL(null)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (nombre === "" || descripcion === "" || precio === "") {
      setFormError(true);
      return;
    }
    handleUpdate();
    setFormError(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {flagView ? "Ver Ebook" : "Actualizar Ebook"}
      </DialogTitle>
      <DialogContent  style={{ marginBottom: "20px",  overflow: "hidden", overflowY: "hidden"}} >
        {flagView
          ? "Detallade del Ebook"
          : "Edite a los datos del Ebook existente."}
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
              label="Descripción"
              autoComplete="off"
              value={descripcion}
              onChange={handleDescriptionChange}
              disabled={flagView}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <Card>
              {flagView ? (
                <CardContent >
                <CardMedia sx={{ marginTop: "20px" }}
                  component="img"
                  alt="Imagen seleccionada"
                  height="auto"
                  image={imagen}
                />
              </CardContent>
              ) : (
                <CardContent >
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <Button variant="outlined" component="span">
                    Subir imagen
                  </Button>
                </label>
                {imageURL && (
                  <CardMedia sx={{ marginTop: "20px" }}
                    component="img"
                    alt="Imagen seleccionada"
                    height="auto"
                    image={imageURL}
                  />
                )}
              </CardContent>
              )}

            </Card>
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
                  <Button onClick={(() => { handleClose(); clearFields() })}>Cerrar</Button>
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
