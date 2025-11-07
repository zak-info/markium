import PropTypes from 'prop-types';

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Paper, Button
} from "@mui/material";
import { Stack } from '@mui/system';

// ----------------------------------------------------------------------

export default function AppNewInvoice2({ title, maintenance_id, subheader, tableData, setTableData, tableLabels, ...other }) {
  const [data, setData] = useState([
    { id: 1, name: "Item 1", value: "Value 1" },
    { id: 2, name: "Item 2", value: "Value 2" },
  ]);

  const [editing, setEditing] = useState({ rowId: null, field: null });

  const handleEdit = (rowId, field) => {
    setEditing({ rowId, field });
  };

  const handleChange = (event, rowId, field) => {
    setData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: event.target.value } : row))
    );
  };

  const handleBlur = () => {
    setEditing({ rowId: null, field: null });
  };

  const handleAddRow = () => {
    const newRow = { id: data.length + 1, name: "", value: "" };
    setData((prev) => [...prev, newRow]);
    setEditing({ rowId: newRow.id, field: "name" }); // Start editing the first cell of the new row
  };
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {["name", "value"].map((field) => (
                <TableCell key={field} onClick={() => handleEdit(row.id, field)}>
                  {editing.rowId === row.id && editing.field === field ? (
                    <TextField
                      value={row[field]}
                      onChange={(e) => handleChange(e, row.id, field)}
                      onBlur={handleBlur}
                      autoFocus
                    />
                  ) : (
                    row[field] || "--"
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {/* Add New Row Button */}
        </TableBody>
      </Table>
      {/* <TableRow>
            <TableCell colSpan={2} align="center"> */}
      <Stack alignItems="flex-end" sx={{ m: 3 }}>
        <Button variant="contained" onClick={handleAddRow}>Add New Row</Button>
      </Stack>
      {/* </TableCell>
          </TableRow> */}
    </TableContainer>
  );
}

AppNewInvoice2.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

