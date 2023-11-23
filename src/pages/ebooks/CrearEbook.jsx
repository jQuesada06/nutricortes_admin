import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardMedia,
  InputLabel
} from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "@firebase/firestore";
import { toast } from "react-toastify";
import "./Ebook.css";
import { db, storage } from "../../firebase/config";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import categoryItems from './categoryOptions.json';
import FormControl from '@mui/material/FormControl';


const CrearEbook = (props) => {
  const { onClose, open, onCreate } = props;
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [precio, setPrecio] = useState(null);
  const [formError, setFormError] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [image, setImage] = useState(null);
  const [category, setCategory] = React.useState('');

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
  const handlePrecioChange = (event) => {
    const inputValue = event.target.value;
    // Verifica si el valor ingresado es un número
    if (!isNaN(inputValue)) {
      setPrecio(parseInt(inputValue, 10)); // Convierte el valor a un número entero
    }
  };
  const handleCategoryChange = (event) => setCategory(event.target.value);

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
      const ebook = {
        Nombre: nombre,
        Descripcion: descripcion,
        Imagen: url,
        Precio: precio,
        Categoria: category
      };
      const docRef = await addDoc(collectionRef, ebook);
      ebook.id = docRef.id;
      onCreate(ebook);
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
    setPrecio(null);
    setImage(null);
    setImageURL(null);
    setCategory('')
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
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }} >
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Categoría</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={category}
                  label="Categoría"
                  onChange={handleCategoryChange}
                  sx={{ width: '100%' }}
                >
                  {
                    categoryItems.options.map((element, index) => (
                      <MenuItem key={index} value={element.value}>{element.tittle}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Box>
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
