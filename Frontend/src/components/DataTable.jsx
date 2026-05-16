import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  TextField,
  Box,
  IconButton
} from "@mui/material";
import { useState } from "react";

export default function DataTable({
  columns = [],
  rows = [],
  actions
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  // 🔍 Filter rows
  const filteredRows = rows.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <Paper sx={{ width: "100%", borderRadius: 3 }}>

      {/* 🔍 SEARCH */}
      <Box p={2}>
        <TextField
          fullWidth
          label="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* TABLE */}
      <TableContainer>
        <Table>

          {/* HEAD */}
          <TableHead>
            <TableRow>
              {columns.map((col, i) => (
                <TableCell key={i}>{col.label}</TableCell>
              ))}
              {actions && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>

          {/* BODY */}
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col, j) => (
                    <TableCell key={j}>
                      {row[col.field]}
                    </TableCell>
                  ))}

                  {/* ACTIONS */}
                  {actions && (
                    <TableCell>
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>

        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );
}