import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, IconButton, Button } from "@mui/material";
import { Visibility, Delete, Edit } from "@mui/icons-material";
import { getFirestore, collection, getDoc, doc, setDoc } from "firebase/firestore";
import CrearSeccionBiografia from "./CrearSeccionBiografia";
import EditarVerSeccionBiografia from "./EditarVerSeccionBiografia";
import EliminarSeccionBiografia from "./EliminarSeccionBiografia"; // Importa el componente EliminarSeccionBiografia
import SearchBar from "./SearchBar";

const TablaSeccionBiografia = () => {
  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEditView, setOpenEditView] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [flagView, setFlagView] = React.useState(false);
  const [object, setObject] = React.useState({});
  const [searchQuery, setSearchQuery] = React.useState("");

  const db = getFirestore();
  const biografiaCollectionRef = collection(db, "Biografia");
  const biografiaDocumentRef = doc(biografiaCollectionRef, "0EcTr5XsdkxeuWtPiBpY");

  const handleEditView = (object, flagView) => {
    setOpenEditView(true);
    setObject(object);
    setFlagView(flagView);
  };

  const columns = [
    { field: "titulo", headerName: "Título", width: 200 },
    { field: "descripcion", headerName: "Descripción", width: 200 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="error"
            aria-label="delete"
            variant="contained"
            size="small"
            onClick={() => {
              setOpenDelete(true);
              setObject(params.row);
            }}
          >
            <Delete />
          </IconButton>
          <IconButton
            color="success"
            aria-label="edit"
            variant="contained"
            size="small"
            onClick={() => {
              setOpenEditView(true);
              setObject(params.row);
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="view"
            variant="contained"
            size="small"
            onClick={() => {
              handleEditView(params.row, true, rows); // Pasa 'rows' como prop
            }}
          >
            <Visibility />
          </IconButton>
        </>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      // Elimina el elemento de la matriz "secciones" en Firestore
      const updatedSections = rows.filter((row) => row.id !== id);
      await setDoc(biografiaDocumentRef, { secciones: updatedSections }, { merge: true });

      setFilteredRows(updatedSections);
      setRows(updatedSections);
      setOpenDelete(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleCreate = async (object) => {
    try {
      // Agrega un nuevo elemento a la matriz "secciones" en Firestore
      const updatedSections = [object, ...rows];
      await setDoc(biografiaDocumentRef, { secciones: updatedSections }, { merge: true });

      setFilteredRows(updatedSections);
      setRows(updatedSections);
      setOpenCreate(false);
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const handleUpdate = async (object) => {
    try {
      // Actualiza un elemento en la matriz "secciones" en Firestore
      const updatedSections = rows.map((row) => (row.id === object.id ? object : row));
      await setDoc(biografiaDocumentRef, { secciones: updatedSections }, { merge: true });

      setFilteredRows(updatedSections);
      setRows(updatedSections);
      setOpenEditView(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleClose = () => {
    setOpenDelete(false);
    setOpenCreate(false);
    setOpenEditView(false);
    setFlagView(false);
  };

  useEffect(() => {
    const db = getFirestore();
    const biografiaCollectionRef = collection(db, "Biografia");
    const biografiaDocumentRef = doc(biografiaCollectionRef, "0EcTr5XsdkxeuWtPiBpY");

    const fetchData = async () => {
      try {
        const docSnapshot = await getDoc(biografiaDocumentRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          if (data && data.secciones) {
            setRows(data.secciones);
            setFilteredRows(data.secciones);
          }
        }
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div style={{ height: 400, width: "80%", marginLeft: "10%", marginTop: "10%" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <SearchBar onSearch={(searchTerm) => setSearchQuery(searchTerm)} />
          <Button
            variant="contained"
            onClick={() => {
              setOpenCreate(true);
            }}
            color="primary"
          >
            Agregar
          </Button>
        </div>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          autoPageSize
          disableRowSelectionOnClick
          disableColumnMenu={true}
        />
      </div>
      <EditarVerSeccionBiografia
        open={openEditView}
        onClose={handleClose}
        onUpdate={handleUpdate}
        object={object}
        flagView={flagView}
        rows={rows} // Agrega esta línea para pasar la prop 'rows'
      />
      <EliminarSeccionBiografia
        open={openDelete}
        onClose={handleClose}
        onRemove={handleDelete}
        object={object}
        rows={rows}
        setRows={setRows}
        filteredRows={filteredRows}
        setFilteredRows={setFilteredRows}
      />
      <CrearSeccionBiografia 
        open={openCreate} 
        onClose={handleClose} 
        onCreate={handleCreate} />
    </>
  );
};

export default TablaSeccionBiografia;
