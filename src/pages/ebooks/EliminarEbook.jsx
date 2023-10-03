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
import { db, storage } from "../../firebase/config";
import { ref, deleteObject } from "firebase/storage";

const EliminarEbook = (props) => {
  const { onClose, open, object, onRemove } = props;

  const handleClose = () => onClose();

  const deleteImage = async () => {
    const ebooksRef = ref(storage, object.object.Imagen)
    deleteObject(ebooksRef).then(() => {
      // File deleted successfully
    }).catch((error) => {
      console.log(error)
    });
  };

  const handleDelete = async () => {
    const docRef = doc(db, "Ebooks", object.object.id);
    try {
      await deleteImage();
      await deleteDoc(docRef);
      toast.success("eBook Eliminado", { autoClose: 3000 });
      onRemove(object.object.id);
    } catch (error) {
      toast.error("No se pudo eliminar el eBook", { autoClose: 3000 });
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirmación de borrado</DialogTitle>
      <DialogContent>¿Estás seguro de borrar a este eBook?</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleDelete} color="error">
          Borrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EliminarEbook;
