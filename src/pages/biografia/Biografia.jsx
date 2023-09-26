import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import './VerBiografia.css';
import CrearSeccionBiografia from './CrearSeccionBiografia';
import TablaSeccionBiografia from './TablaSeccionBiografia';


function VerBiografia() {
  const [biografia, setBiografia] = useState({
    nombre: '',
    codigo: '',
    descripcion: '',
    imagen: '',
  });

  const [editMode, setEditMode] = useState({
    nombre: false,
    codigo: false,
    descripcion: false,
    imagen: false,
  });

  const [originalImagen, setOriginalImagen] = useState('');

  useEffect(() => {
    const obtenerBiografia = async () => {
      try {
        const firestore = getFirestore();
        const biografiaRef = doc(firestore, 'Biografia', '0EcTr5XsdkxeuWtPiBpY');
        const biografiaSnapshot = await getDoc(biografiaRef);

        if (biografiaSnapshot.exists()) {
          const datosBiografia = biografiaSnapshot.data();
          setBiografia(datosBiografia);
          setOriginalImagen(datosBiografia.imagen);
        }
      } catch (error) {
        console.error('Error al obtener los datos de la biografía', error);
      }
    };

    obtenerBiografia();
  }, []);

  const handleModificar = (campo) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [campo]: campo === 'imagen' ? true : !prevEditMode[campo], // Mostrar botones de guardar y cancelar solo para la imagen
    }));
  };

  const handleGuardar = async (campo) => {
    try {
      const firestore = getFirestore();
      const biografiaRef = doc(firestore, 'Biografia', '0EcTr5XsdkxeuWtPiBpY');

      await updateDoc(biografiaRef, {
        [campo]: biografia[campo],
      });

      setEditMode((prevEditMode) => ({
        ...prevEditMode,
        [campo]: false,
      }));
    } catch (error) {
      console.error('Error al guardar los datos de la biografía', error);
    }
  };

  const handleInputChange = (campo, event) => {
    setBiografia({
      ...biografia,
      [campo]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setBiografia({
        ...biografia,
        imagen: reader.result,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleCancelarImagen = () => {
    setBiografia({
      ...biografia,
      imagen: originalImagen,
    });
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      imagen: false,
    }));
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Ver Biografía</Typography>
        </Grid>
        <Grid item xs={6}>
          <Paper style={{ padding: '16px' }}>
            <Typography variant="h6">Nombre</Typography>
            {editMode.nombre ? (
              <TextField
                fullWidth
                value={biografia.nombre}
                onChange={(e) => handleInputChange('nombre', e)}
              />
            ) : (
              <Typography>{biografia.nombre}</Typography>
            )}
            {editMode.nombre ? (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleGuardar('nombre')}
                  style={{ marginTop: '16px', marginLeft: '8px' }}
                >
                  Guardar
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setEditMode({ ...editMode, nombre: false })}
                  style={{ marginTop: '16px', marginLeft: '8px' }}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleModificar('nombre')}
                style={{ marginTop: '16px' }}
              >
                Modificar
              </Button>
            )}
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper style={{ padding: '16px' }}>
            <Typography variant="h6">Código</Typography>
            {editMode.codigo ? (
              <TextField
                fullWidth
                value={biografia.codigo}
                onChange={(e) => handleInputChange('codigo', e)}
              />
            ) : (
              <Typography>{biografia.codigo}</Typography>
            )}
            {editMode.codigo ? (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleGuardar('codigo')}
                  style={{ marginTop: '16px', marginLeft: '8px' }}
                >
                  Guardar
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setEditMode({ ...editMode, codigo: false })}
                  style={{ marginTop: '16px', marginLeft: '8px' }}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleModificar('codigo')}
                style={{ marginTop: '16px' }}
              >
                Modificar
              </Button>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ padding: '16px', display: 'flex' }}>
            <div style={{ width: '70%' }}>
              <Typography variant="h6">Descripción</Typography>
              {editMode.descripcion ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={biografia.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e)}
                />
              ) : (
                <Typography>{biografia.descripcion}</Typography>
              )}
              {editMode.descripcion ? (
                <>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleGuardar('descripcion')}
                    style={{ marginTop: '16px', marginLeft: '8px' }}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() =>
                      setEditMode({ ...editMode, descripcion: false })
                    }
                    style={{ marginTop: '16px', marginLeft: '8px' }}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleModificar('descripcion')}
                  style={{ marginTop: '16px' }}
                >
                  Modificar
                </Button>
              )}
            </div>
            <div style={{ width: '30%', marginLeft: '16px' }}>
              <Typography variant="h6">Imagen</Typography>
              {editMode.imagen ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="image-input"
                  />
                  <label htmlFor="image-input">
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      Seleccionar
                    </Button>
                  </label>
                  <div
                    style={{
                      width: '100%',
                      paddingBottom: '100%',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={biografia.imagen}
                      alt="Imagen de la Biografía"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </div>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCancelarImagen}
                    style={{ marginTop: '16px', marginLeft: '8px' }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleGuardar('imagen')}
                    style={{ marginTop: '16px', marginLeft: '8px' }}
                  >
                    Guardar
                  </Button>
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: '100%',
                      paddingBottom: '100%',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={biografia.imagen}
                      alt="Imagen de la Biografía"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </div>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleModificar('imagen')}
                    style={{ marginTop: '16px' }}
                  >
                    Modificar
                  </Button>
                </>
              )}
            </div>
          </Paper>
        </Grid>
      </Grid>
      <div style={{ margin: '16px' }}></div>
      <CrearSeccionBiografia />
      <TablaSeccionBiografia />
    </Container>
  );
  
}

export default VerBiografia;