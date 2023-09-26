import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, IconButton, Button } from "@mui/material";
import { Visibility, Delete, Edit } from "@mui/icons-material";
import { getFirestore, collection, getDocs } from "firebase/firestore";

import CrearPromociones from "./CrearPromociones";
import EditarVerPromociones from "./EditarVerPromociones";
import EliminarPromociones from "./EliminarPromociones";

const TablaPromociones = () => {
  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = useState(rows);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEditView, setOpenEditView] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [flagView, setFlagView] = React.useState(false);
  const [object, setObject] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const columns = [
    { field: "Titulo", headerName: "Titulo", width: 200 },
    { field: "Descripcion", headerName: "Descripcion", width: 200 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton
            color="error"
            aria-label="delete"
            variant="contained"
            size="small"
            onClick={() => {
              setOpenDelete(true);
              setObject({ object: params.row });
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
              setObject({ object: params.row });
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
              setOpenEditView(true);
              setFlagView(true);
              setObject({ object: params.row });
            }}
          >
            <Visibility />
          </IconButton>
        </>
      ),
    },
  ];

  const handleDelete = (id) => {
    const updatedFilteredRows = filteredRows.filter((row) => row.id !== id);
    const updatedRows = rows.filter((row) => row.id !== id);
    setFilteredRows(updatedFilteredRows);
    setRows(updatedRows);
  };

  const handleCreate = (object) => {
    setFilteredRows([object, ...filteredRows]);
    setRows([object, ...rows]);
  };

  const handleUpdate = (object) => {
    const index = rows.findIndex((row) => row.id === object.id);
    const filteredIndex = filteredRows.findIndex((row) => row.id === object.id);
    const rowsUpdated = [...rows];
    rowsUpdated[index] = object;
    setRows(rowsUpdated);
    const rowsFilteredUpdated = [...filteredRows];
    rowsFilteredUpdated[filteredIndex] = object;
    setRows(rowsFilteredUpdated);
  };

  const handleClose = () => {
    setOpenDelete(false);
    setOpenCreate(false);
    setOpenEditView(false);
    setFlagView(false);
  };

  useEffect(() => {
    const newFilteredRows = rows.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredRows(newFilteredRows);
  }, [rows, searchQuery]);

  useEffect(() => {
    const db = getFirestore();
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Promociones"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRows(data);
      setFilteredRows(data);
    };
    fetchData().catch(console.error);
  }, []);

  return (
    <>
      <div style={{ height: 400, width: "95%" }}>
        <div style={{ textAlign: "right" }}>
          <TextField
            label="Buscar"
            className="buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => {
              setOpenCreate(true);
            }}
            color="primary"
          >
            Agregar Promocion
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
      <EditarVerPromociones
        open={openEditView}
        onClose={handleClose}
        onUpdate={handleUpdate}
        object={object}
        flagView={flagView}
      />
      <EliminarPromociones
        open={openDelete}
        onClose={handleClose}
        onRemove={handleDelete}
        object={object}
      />
      <CrearPromociones
        open={openCreate}
        onClose={handleClose}
        onCreate={handleCreate}
      />
    </>
  );
};

export default TablaPromociones;
