import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore"; // Importa "collection" aquí
import { toast } from "react-toastify";

const EliminarSeccionBiografia = (props) => {
  const { onClose, open, object, onRemove, rows, setRows, filteredRows, setFilteredRows } = props;

  const handleClose = () => onClose();

  const handleDelete = async () => {
    const db = getFirestore();
    const biografiaCollectionRef = collection(db, "Biografia");
    const biografiaDocumentRef = doc(biografiaCollectionRef, "0EcTr5XsdkxeuWtPiBpY");

    try {
      // Elimina la sección de Firebase
      const updatedSections = rows.filter((row) => row.id !== object.id);
      await setDoc(biografiaDocumentRef, { secciones: updatedSections }, { merge: true });

      // Actualiza las filas y las filas filtradas en la interfaz de usuario
      setFilteredRows(updatedSections);
      setRows(updatedSections);

      toast.success("Sección eliminada correctamente", { autoClose: 3000 });
      onRemove(object.id);
    } catch (error) {
      console.error("Error al eliminar la sección:", error);
      toast.error("No se pudo eliminar la sección", { autoClose: 3000 });
    }

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirmación de borrado</DialogTitle>
      <DialogContent>¿Estás seguro que deseas borrar esta sección?</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="success">
          Cancelar
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          Borrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EliminarSeccionBiografia;
