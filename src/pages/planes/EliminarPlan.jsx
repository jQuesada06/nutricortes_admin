import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { doc, deleteDoc } from "@firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase/config";

const EliminarPlan = (props) => {
  const { onClose, open, object, onRemove } = props;

  const handleClose = () => onClose();

  const handleDelete = async () => {
    const docRef = doc(db, "Planes", object.object.id);
    try {
      await deleteDoc(docRef);
      toast.success("Plan Eliminado", { autoClose: 3000 });
      onRemove(object.object.id);
    } catch (error) {
      toast.error("No se pudo eliminar el Plan", { autoClose: 3000 });
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirmación de borrado</DialogTitle>
      <DialogContent>¿Estás seguro de borrar a este Plan?</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleDelete} color="error">
          Borrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EliminarPlan;
