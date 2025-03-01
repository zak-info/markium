import { useState } from "react";
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
} from "@mui/material";

import { fCurrency } from "src/utils/format-number";
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { TableHeadCustom } from "src/components/table";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import { ListItemText } from "@mui/material";
import { toNumber } from "lodash";
import { useValues } from "src/api/utils";
import UserNewEditForm from "src/sections/clause/user-new-edit-form";
import { t } from "i18next";
import { Stack } from "@mui/system";

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
  const [editing, setEditing] = useState({ rowId: null, field: null });

  const handleEdit = (rowId, field) => {
    setEditing({ rowId, field });
  };

  const handleChange = (event, rowId, field) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: event.target.value } : row))
    );
  };

  const handleBlur = () => {
    setEditing({ rowId: null, field: null });
  };

  const handleAddRow = () => {
    const newRow = { id: tableData.length + 1, type: "", clause: "", cost: "", qte: "", piece_status: "", total: "" };
    setTableData((prev) => [...prev, newRow]);
    setEditing({ rowId: newRow.id, field: "type" }); // Start editing the first cell of the new row
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
          {/* <UserNewEditForm maintenance_id={maintenance_id} setTableData={setTableData} /> */}
        </Scrollbar>
        <Stack alignItems="flex-end" sx={{ m: 3 }}>
          <Button variant="contained" onClick={handleAddRow}>
            {t("add_new_row")}
          </Button>
        </Stack>
      </TableContainer>

      <Divider sx={{ borderStyle: "dashed" }} />

      {/* <Box sx={{ p: 2, textAlign: "right" }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
        >
          {t("view_all")}
        </Button>
      </Box> */}
    </Card>
  );
}

AppNewInvoice3.propTypes = {
  subheader: PropTypes.string,
  tableData: PropTypes.array,
  tableLabels: PropTypes.array,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function AppNewInvoiceRow({ row, maintenance_spec, editing, handleEdit, handleChange, handleBlur }) {
  const popover = usePopover();

  const handleDelete = () => {
    popover.onClose();
    console.info("DELETE", row.id);
  };

  return (
    <>
      <TableRow>
        {["type", "clause", "cost", "qte", "piece_status", "total"].map((field) => (
          <TableCell key={field} onClick={() => handleEdit(row.id, field)}>
            {editing.rowId === row.id && editing.field === field ? (
              <TextField
                value={row[field] || ""}
                onChange={(e) => handleChange(e, row.id, field)}
                onBlur={handleBlur}
                autoFocus
              />
            ) : (
              row[field] || "Click to edit"
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
