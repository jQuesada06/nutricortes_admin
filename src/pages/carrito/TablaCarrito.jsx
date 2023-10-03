import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchBar from '../faqs/SearchBar';
import "./Carrito.css"
import { db } from '../../firebase/config';
import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from "@firebase/firestore";
import { TablePagination } from '@mui/material';


function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.nombreUsuario}
        </TableCell>
        <TableCell component="th" scope="row">
          {`${row.fecha.toDate().getDate().toString()}/${row.fecha.toDate().getMonth() + 1}/${row.fecha.toDate().getFullYear().toString()}`}
        </TableCell>
        <TableCell align="right">{row.precioTotal + " ₡"}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Productos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Precio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.productos.map((productosRow, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {productosRow.nombre}
                      </TableCell>
                      <TableCell>{productosRow.precio + " ₡"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function TablaCarrito() {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const [data, setData] = useState([]);
  const [dataFiltered, setDataFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const newFilteredRows = data.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setDataFiltered(newFilteredRows);
  }, [data, searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      const carritoRef = collection(db, 'Carrito');
      const queryOrdenada = query(carritoRef, orderBy('fecha', 'desc'));
      const querySnapshot = await getDocs(queryOrdenada);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDataFiltered(data)
      setData(data)
    };
    fetchData().catch(console.error);
  }, []);

  return (
    <div style={{ height: 400, width: "95%" }}>
      <SearchBar
            onSearch={(searchTerm) => setSearchQuery(searchTerm)}
          />
    <TableContainer component={Paper} className='main-container'>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell> Cliente</TableCell>
            <TableCell> Fecha</TableCell>
            <TableCell align="right">Precio Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
        component="div"
        count={dataFiltered.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
      />
    </div>
  );
}
