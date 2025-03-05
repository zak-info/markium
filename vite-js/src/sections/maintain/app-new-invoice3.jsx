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
  Paper,
  Stack,
  TextField,
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
    setOriginalTableData(tableData);
  }, []);
  // useEffect(() => {
  //   console.log("tableData : ", tableData);
  //   console.log("originalTableData : ", originalTableData);
  //   // console.log(hasChanges());
  // }, [tableData]);
  const hasChanges = () => {
    return JSON.stringify(originalTableData) !== JSON.stringify(tableData);
  };
  const getEditedRows = () => {
    // return tableData.filter((row, index) => JSON.stringify(row) !== JSON.stringify(originalTableData[index]));
    return tableData.filter((row, index) => row?.new == "false"  || row?.new == "true"  );
  };

  const handleEdit = (rowId, field) => {
    setEditing({ rowId, field });
  };

  const handleChange = (event, rowId, field) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: event.target.value, new: row?.new == "true" ? "true" : "false" } : row))
    );
  };

  const handleBlur = () => {
    setEditing({ rowId: null, field: null });
  };

  const handleAddRow = () => {
    const newRow = { id: tableData.length + 1, type: "", clause: "", cost: "", qte: "", piece_status: "", total: "", new: "true" };
    setTableData((prev) => [...prev, newRow]);
    setEditing({ rowId: newRow.id, field: "type" }); // Start editing the first cell of the new row
  };


  const [postloader, setPostloader] = useState(false)

  const handleSaveChanges = async () => {
    const editedRows = getEditedRows();
    setPostloader(true)
    try {
      for (const row of editedRows) {
        let body = { maintenance_id:Number(maintenance_id), cost: Number(row?.cost), quantity: Number(row?.quantity), piece_status: row?.piece_status,  }
        if (row?.related_type == "not-periodic" || row?.is_periodic == 0) {
          body.spec_id = Number(row?.related_id); 
        }else if(row?.related_type == "periodic" || row?.is_periodic == 1 ) {
          body.period_maintenance_id = Number(body?.related_id);
        }
        console.log("Saving changes:", body);
        if (row?.new === "true") {
          console.log("create");
          await addNewMaintenanceClause(body);
        } else {
          console.log("edit");
          await EditMaintenanceClause(body);
        }
      }
      enqueueSnackbar("Success operation",);
      setOriginalTableData([...tableData]); // Reset original data after saving
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message ? error?.message : "Somthing Went Wrong", { variant: 'error' });

    }
    setPostloader(false)

    // Send editedRows to the backend
    // Example: axios.post('/api/update-table', { updatedRows: editedRows })

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
          <LoadingButton type="submit" variant="contained" onClick={handleSaveChanges} loading={postloader}>
            {t('save_changes')}
          </LoadingButton>
          {/* <Button variant="contained" color="primary" onClick={handleSaveChanges}>
            {t("save_changes")}
          </Button> */}
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
import { addNewMaintenanceClause, EditMaintenanceClause } from "src/api/clauses";
import { LoadingButton } from "@mui/lab";
import { enqueueSnackbar } from "notistack";

function AppNewInvoiceRow({ row, tableLabels, editing, handleEdit, handleChange, handleBlur }) {
  const popover = usePopover();

  const handleDelete = () => {
    popover.onClose();
    console.info("DELETE", row.id);
  };

  return (
    <>
      <TableRow>
        {tableLabels.map(({ id, editable, type, options, key_to_update }) => (
          <TableCell key={id} onClick={() => editable && handleEdit(row.id, id)}>
            {editing.rowId === row.id && editing.field === id ? (
              editable ? (
                type === "select" ? (
                  <Select value={row[id] || ""} onChange={(e) => handleChange(e, row.id, key_to_update)} onBlur={handleBlur} autoFocus>
                    {options.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.lable}
                      </MenuItem>
                    ))}
                  </Select>
                ) : type === "date" ? (
                  <DatePicker value={row[id] || null} onChange={(newValue) => handleChange({ target: { value: newValue } }, row.id, key_to_update)} onBlur={handleBlur} />
                ) : (
                  <TextField value={row[id] || ""} type={type} onChange={(e) => handleChange(e, row.id, key_to_update)} onBlur={handleBlur} autoFocus />
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
