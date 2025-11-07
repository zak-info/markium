import { useState, useEffect, useCallback } from "react";
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

import _ from "lodash";

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

  // const hasChanges = () => {
  //   return JSON.stringify(originalTableData) !== JSON.stringify(tableData);
  // };

  const [isChangeing, setIsChanging] = useState(false)
  const hasChanges = () => {
    return !_.isEqual(originalTableData, tableData);
  };

  const [changeSin, setChangeSin] = useState(false)
  const getEditedRows = () => {
    // return tableData.filter((row, index) => JSON.stringify(row) !== JSON.stringify(originalTableData[index]));
    setChangeSin(true)
    return tableData.filter((row, index) => row?.new == "false" || row?.new == "true");
  };

  const handleEdit = (rowId, field) => {
    setIsChanging(true)
    setEditing({ rowId, field });
  };

  const handleChange = (event, rowId, field) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: event.target.value, new: row?.new == "true" ? "true" : "false" } : row))
    );
    setIsChanging(true)
  };

  const handleBlur = () => {
    setEditing({ rowId: null, field: null });
    setIsChanging(true)
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
    setPostloader(true)
    try {
      for (const row of editedRows) {
        let body = { maintenance_id: Number(maintenance_id), cost: Number(row?.cost), quantity: Number(row?.quantity), piece_status: row?.piece_status, note: row?.note }
        console.log("Saving changes 1 :", body);

        if (row?.is_periodic == "not-periodic") {
          body.spec_id = Number(row?.related_id);
        } else if (row?.is_periodic == "periodic") {
          body.period_maintenance_id = Number(body?.related_id);
        }

        if (row?.new === "true") {
          console.log("create");
          // await addNewMaintenanceClause(body);
        } else {
          console.log("edit");
          let editBody = { piece_status: body.piece_status, cost: body.cost, quantity: body.quantity, note: body?.note };
          if (!body.note) {
            delete editBody.note
          }
          console.log("Saving changes 2 :", editBody);
          await EditMaintenanceClause(row.id, editBody);
        }
      }
      enqueueSnackbar(t("operation_success"),);
      setOriginalTableData([...tableData]); // Reset original data after saving
      setChangeSin(false)
      setIsChanging(false)
    } catch (error) {
      showError(error)

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
                  setTableData={setTableData}
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
        {
          !addProcess ?
            <UserNewEditForm setAddProcess={setAddProcess} maintenance_id={maintenance_id} setTableData={setTableData} />
            : !isChangeing ?
            <Stack alignItems="flex-end" sx={{ m: 3 }}>
              <Button variant="contained" onClick={handleAddRow}>
                {t("addClause")}
              </Button>
            </Stack>
            :
            null
        }
      </TableContainer>
      <Divider sx={{ borderStyle: "dashed" }} />

      {/* Show Save Changes button only when data is modified */}
      {isChangeing ?
        <Stack alignItems="flex-end" sx={{ m: 3 }}>
          <LoadingButton type="submit" variant="contained" onClick={handleSaveChanges} loading={postloader}>
            {t('saveChange')}
          </LoadingButton>
          {/* <Button variant="contained" color="primary" onClick={handleSaveChanges}>
            {t("save_changes")}
          </Button> */}
        </Stack>
        :
        null
      }
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
import { addNewMaintenanceClause, deleteMaintenanceClause, EditMaintenanceClause } from "src/api/clauses";
import { LoadingButton } from "@mui/lab";
import { enqueueSnackbar } from "notistack";
import UserNewEditForm from "../clause/user-new-edit-form";
import ExpandableText from "./ExpandableText";
import showError from "src/utils/show_error";
import { createMaintenance } from "src/api/maintainance";
import { ConfirmDialog } from "src/components/custom-dialog";
import { useBoolean } from "src/hooks/use-boolean";

function AppNewInvoiceRow({ row, setTableData, tableLabels, editing, handleEdit, handleChange, handleBlur }) {
  const popover = usePopover();
  const confirm = useBoolean();
  // const loading = useBoolean(false);
  const [loading,setLoading] = useState(false);
  // useEffect(() => {
  //   loading.onFalse()
  // }, [])

  const handleDelete = useCallback(
    async (id) => {
      try {
        // loading.onTrue()
        setLoading(true)
        await deleteMaintenanceClause(row?.id)
        setTableData(prev => prev.filter(i => i.id != id));
        confirm.onFalse();
        setLoading(false)
        // loading.onFalse()
        enqueueSnackbar(t('operation_success'));
        console.info("DELETE", row.id);
      } catch (error) {
        showError(error)
      }
    },
    [enqueueSnackbar]
  );


  return (
    <>
      <TableRow>
        {tableLabels.map(({ id, editable, creatable, type, options, key_to_update }) => (
          <TableCell key={id} onClick={() => editable && handleEdit(row.id, id)} sx={{ width: id == "note" ? "40%" : "auto" }} >
            {editing.rowId === row.id && editing.field === id ? (
              editable ? (
                type === "select" ? (
                  <Select
                    value={row[id] || ""}
                    onChange={(e) => handleChange(e, row.id, key_to_update)}
                    onBlur={handleBlur}
                    autoFocus
                  >
                    {options?.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label} {/* ✅ Fixed typo */}
                      </MenuItem>
                    ))}
                  </Select>
                ) : type === "date" ? (
                  <DatePicker
                    value={row[id] || null}
                    format="dd/MM/yyyy"
                    onChange={(newValue) => handleChange({ target: { value: newValue } }, row.id, key_to_update)}
                    onBlur={handleBlur}
                  />
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
                id == "note" ?
                  <ExpandableText text={row[id]} />
                  :
                  row[id] || "--"
              )
            ) : (
              id == "note" ?
                <ExpandableText text={row[id]} />
                :
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
        <MenuItem onClick={() => { confirm.onTrue(); popover.onClose() }} sx={{ color: "error.main" }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t("delete")}
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('delete')}
        content={t('are_u_sure_to_delete',{item:t("the_clause"),item2:row?.clause+" "+row?.cost})}
        action={
          <LoadingButton
            loading={loading}
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete(row?.id);
            }}
          >
            {t('delete')}
          </LoadingButton>
        }
      />
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



