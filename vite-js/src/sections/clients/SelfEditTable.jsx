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

export default function SelfEditTable({
  title,
  parentId,
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
  const hasChanges = () => {
    return JSON.stringify(originalTableData) !== JSON.stringify(tableData);
  };
  const getEditedRows = () => {
    // return tableData.filter((row, index) => JSON.stringify(row) !== JSON.stringify(originalTableData[index]));
    return tableData.filter((row, index) => row?.new == "false" || row?.new == "true");
  };

  const handleEdit = (rowId, field) => {
    setEditing({ rowId, field });
  };

  const handleChange = (event, rowId, field, type) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: type == "date" ? fDate(event.target.value,"yyyy-MM-dd") : event.target.value, new: row?.new == "true" ? "true" : "false" } : row))
    );
  };

  const handleBlur = () => {
    setEditing({ rowId: null, field: null });
  };

  const [addProcess, setAddProcess] = useState(true)

  const handleAddRow = () => {
    // const newRow = { id: tableData.length + 1, is_periodic: "not-periodic", clause: "", cost: "", qte: "", piece_status: "", total: "", new: "true" };
    // setTableData((prev) => [...prev, newRow]);
    // setEditing({ rowId: newRow.id, field: "type" }); // Start editing the first cell of the new row
    setAddProcess(false)
  };
  const handleAddRowold = () => {
    const newRow = { id: tableData.length + 1, is_periodic: "not-periodic", clause: "", cost: "", qte: "", piece_status: "", total: "", note: "", new: "true" };
    setTableData((prev) => [...prev, newRow]);
    setEditing({ rowId: newRow.id, field: "type" }); // Start editing the first cell of the new row
  };


  const [postloader, setPostloader] = useState(false)

  const handleSaveChanges = async () => {
    const editedRows = getEditedRows();

  };

  return (
    <>
      {/* <Card {...other}> */}
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
                  setTableData={setTableData}
                  maintenance_spec={data?.maintenance_specifications?.find((item) => item.id == row?.related_id)?.name}
                />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>

        {/* {
          !addProcess ?
            <UserNewEditForm setAddProcess={setAddProcess} parentId={parentId} setTableData={setTableData} />
            :
            <Stack alignItems="flex-end" sx={{ m: 3 }}>
              <Button variant="contained" onClick={handleAddRow}>
                {t("addClause")}
              </Button>
            </Stack>
        } */}
      </TableContainer>
      <Divider sx={{ borderStyle: "dashed" }} />

      {/* Show Save Changes button only when data is modified */}
      {/* {hasChanges() && (
        <Stack alignItems="flex-end" sx={{ m: 3 }}>
          <LoadingButton type="submit" variant="contained" onClick={handleSaveChanges} loading={postloader}>
            {t('saveChange')}
          </LoadingButton>
        </Stack>
      )} */}
      {/* </Card> */}
    </>
  );
}

SelfEditTable.propTypes = {
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
import UserNewEditForm from "../clause/user-new-edit-form";
import CarsAutocomplete from "src/components/hook-form/rhf-CarsAutocomplete";
import { fDate } from "src/utils/format-time";
// import ExpandableText from "./ExpandableText";

function AppNewInvoiceRow({ row, tableLabels, editing, handleEdit, handleChange, handleBlur, setTableData }) {
  const popover = usePopover();

  const handleDelete = () => {
    setTableData(prev => prev?.filter(item =>
      !(item?.clauseable_type === row?.clauseable_type && item?.clauseable_id === row?.clauseable_id)
    ));
    console.log("deleted");

    popover.onClose();
    console.info("DELETE", row.id);
  };


  return (
    <>
      <TableRow>
        {tableLabels.map(({ id, editable, creatable, type, options, key_to_update }) => (
          <TableCell key={id} onClick={() => editable && handleEdit(row.id, id)} sx={{ width: id == "note" ? "40%" : "auto" }} >
            {editing.rowId === row.id && editing.field === id ? (
              editable ? (
                type === "car_autocomplete" ?
                  <CarsAutocomplete options={options} name={key_to_update} label={t('car')} placeholder={t("search_by") + " ..."} />
                  :
                  type === "select" ? (
                    <Select
                      value={row[id] || ""}
                      onChange={(e) => handleChange(e, row.id, key_to_update)}
                      onBlur={handleBlur}
                      autoFocus
                    >
                      {options?.map((option, index) => (
                        <MenuItem key={index} value={option?.value}>
                          {option?.label} {/* ✅ Fixed typo */}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : type === "date" ? (
                    <>
                      {/* <DatePicker
                      value={row[id] || null}
                      format="dd/MM/yyyy"
                      onChange={(newValue) => handleChange({ target: { value: newValue } }, row.id, key_to_update,'date')}
                      onBlur={handleBlur}
                    /> */}
                      <DatePicker
                        name="date"
                        label={row?.label}
                        format="dd/MM/yyyy"
                        // value={contract?.cancle_at ? new Date(contract?.cancle_at) : values?.start_date ? new Date(values?.start_date) : new Date()}
                        // onChange={(date) => setValue('cancel_at', date)}
                        onChange={(newValue) => handleChange({ target: { value: newValue } }, row.id, key_to_update,'date')}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                          },
                        }}
                      />
                    </>
                  ) : (
                    <TextField
                      value={row[id] || ""}
                      type={type}
                      onChange={(e) => handleChange(e, row.id, key_to_update)}
                      onBlur={handleBlur}
                      autoFocus
                    />
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
        <MenuItem onClick={() => handleDelete()} sx={{ color: "error.main" }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t("delete")}
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



