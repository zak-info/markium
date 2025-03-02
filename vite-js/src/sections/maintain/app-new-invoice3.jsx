import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  Table,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  CardHeader,
  IconButton,
  TableContainer,
  TextField,
  Paper,
  Stack,
} from "@mui/material";

import { useValues } from "src/api/utils";
import Scrollbar from "src/components/scrollbar";
import { TableHeadCustom } from "src/components/table";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import { t } from "i18next";

export default function AppNewInvoice3({
  title,
  maintenance_id,
  maintenanceclauses,
  subheader,
  tableData,
  setTableData,
  tableLabels,
  ...other
}) {
  const { data } = useValues();
  const [originalTableData, setOriginalTableData] = useState(tableData); // Store initial data
  const [editing, setEditing] = useState({ rowId: null, field: null });

  useEffect(() => {
    // setOriginalTableData([...tableData]); // Update original data when tableData changes externally
    console.log("tableData : ",tableData);
    console.log("originalTableData : ",originalTableData);
    console.log(hasChanges());
  }, [tableData]);

  // Function to compare tableData with originalTableData
  const hasChanges = () => {
    return JSON.stringify(originalTableData) !== JSON.stringify(tableData);
  };

  

  // Function to find edited rows
  const getEditedRows = () => {
    return tableData.filter((row, index) => JSON.stringify(row) !== JSON.stringify(originalTableData[index]));
  };

  const handleEdit = (rowId, field) => {
    setEditing({ rowId, field });
  };

  const handleChange = (event, rowId, field) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: event.target.value,new:false } : row))
    );
  };

  const handleBlur = () => {
    setEditing({ rowId: null, field: null });
  };

  const handleAddRow = () => {
    const newRow = { id: tableData.length + 1, type: "", clause: "", cost: "", qte: "", piece_status: "", total: "",new:true };
    setTableData((prev) => [...prev, newRow]);
    setEditing({ rowId: newRow.id, field: "type" }); // Start editing the first cell of the new row
  };

  const handleSaveChanges = () => {
    const editedRows = getEditedRows();
    console.log("Saving changes: ", editedRows);

    // Send editedRows to the backend
    // Example: axios.post('/api/update-table', { updatedRows: editedRows })

    setOriginalTableData([...tableData]); // Reset original data after saving
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer component={Paper} sx={{ overflow: "unset" }}>
        <Scrollbar>
          <Table sx={{ minWidth: 680 }}>
            <TableHeadCustom headLabel={tableLabels} />
            <TableBody>
              {tableData?.map((row) => (
                <AppNewInvoiceRow
                  key={row.id}
                  tableLabels={tableLabels}
                  row={row}
                  editing={editing}
                  handleEdit={handleEdit}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  maintenance_spec={data?.maintenance_specifications?.find((item) => item.id == row?.related_id)?.name}
                />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
        <Stack alignItems="flex-end" sx={{ m: 3 }}>
          <Button variant="contained" onClick={handleAddRow}>
            {t("add_new_row")}
          </Button>
        </Stack>
      </TableContainer>
      <Divider sx={{ borderStyle: "dashed" }} />

      {/* Show Save Changes button only when data is modified */}
      {hasChanges() && (
        <Stack alignItems="flex-end" sx={{ m: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSaveChanges}>
            {t("save_changes")}
          </Button>
        </Stack>
      )}
    </Card>
  );
}

AppNewInvoice3.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ---------------------------------------------------------

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Select } from "@mui/material";
import Iconify from "src/components/iconify";

function AppNewInvoiceRow({ row, tableLabels, editing, handleEdit, handleChange, handleBlur }) {
  const popover = usePopover();

  const handleDelete = () => {
    popover.onClose();
    console.info("DELETE", row.id);
  };

  return (
    <>
      <TableRow>
        {tableLabels.map(({ id, editable, type, options,key_to_update }) => (
          <TableCell key={id} onClick={() => editable && handleEdit(row.id, id)}>
            {editing.rowId === row.id && editing.field === id ? (
              editable ? (
                type === "select" ? (
                  <Select value={row[id] || ""} onChange={(e) => handleChange(e, row.id, key_to_update)} onBlur={handleBlur} autoFocus>
                    {options.map((option,index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.lable}
                      </MenuItem>
                    ))}
                  </Select>
                ) : type === "date" ? (
                  <DatePicker value={row[id] || null} onChange={(newValue) => handleChange({ target: { value: newValue } }, row.id, id)} onBlur={handleBlur} />
                ) : (
                  <TextField value={row[id] || ""} type={type} onChange={(e) => handleChange(e, row.id, id)} onBlur={handleBlur} autoFocus />
                )
              ) : (
                row[id] || "--"
              )
            ) : (
              row[id] || "--"
            )}
          </TableCell>
        ))}

        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton color={popover.open ? "inherit" : "default"} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 160 }}>
        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

AppNewInvoiceRow.propTypes = {
  row: PropTypes.object,
  maintenance_spec: PropTypes.string,
  editing: PropTypes.object,
  handleEdit: PropTypes.func,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
};
