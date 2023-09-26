import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const EliminarReto = (props) => {
  const { onClose, open, object, onRemove } = props;

  const handleClose = () => onClose();

  const handleDelete = async () => {
    const db = getFirestore();
    const docRef = doc(db, "Retos", object.object.id);
    try {
      await deleteDoc(docRef);
      toast.success("Reto Eliminado", { autoClose: 3000 });
      onRemove(object.object.id);
    } catch (error) {
      toast.error("No se pudo eliminar el reto", { autoClose: 3000 });
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirmación de borrado</DialogTitle>
      <DialogContent>¿Estás seguro de borrar este Reto?</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleDelete} color="error">
          Borrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EliminarReto;
