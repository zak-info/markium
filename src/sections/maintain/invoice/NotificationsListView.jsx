import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import OrderTableRow from './notifications-table-row';
import OrderTableToolbar from './notification-table-toolbar';
import OrderTableFiltersResult from './notifications-tabel-filters-result';
import { useTranslate } from 'src/locales';
import { RouterLink } from 'src/routes/components';
import { useGetMaintenanceLogs } from 'src/api/maintainance';
import { useGetCar } from 'src/api/car';
import { useGetDocuments } from 'src/api/document';
import { useValues } from 'src/api/utils';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function InvoiceListView({id}) {
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const TABLE_HEAD = [
    // { id: 'document', label: t('documents') },
    // { id: 'attach', label: t('document') },
    { id: 'invoice', label: t('invoice') },
    { id: 'link', label: t('link') },
    { id: 'delete', label: t('delete') },
  ];

  const STATUS_OPTIONS = [
    { value: 'all', label: t('all') },
    { value: 'completed', label: t('available') },
    { value: 'pending', label: t('underProcessing') },
    { value: 'refunded', label: t('rented') },
    { value: 'cancelled', label: t('maintain') },
  ];

  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();
  // const { logs } = useGetMaintenanceLogs()
  const { documents } = useGetDocuments()
  const carDocuments = documents.filter(item => item.attachable_id == id && item.attachable_type == "car")

  const { data } = useValues()

  const [tableData, setTableData] = useState([{id:1,title:"invoice 1",link:"#"}]);
  useEffect(() => {
    setTableData(carDocuments)
  }, [documents])

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset =
    !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row?.id !== id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row?.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.maintenance.new + "?car_id=" + id);
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  return (
    <>
      {/* <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ pt: "10px" }} > */}
        <Card  sx={{ mt: "10px" }}>
        <Typography variant="h4" sx={{ mt:"10px",mx:"10px"  }}>
          {t('documents')}
        </Typography>
          {/* <OrderTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            dateError={dateError}
          /> */}

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row?.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                // onSort={table.onSort}
                // onSelectAllRows={(checked) =>
                //   table.onSelectAllRows(
                //     checked,
                //     dataFiltered.map((row) => row?.id)
                //   )
                // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OrderTableRow
                        key={row?.id}
                        row={row}
                        // attachement_name={data?.attachmenat_names?.find(item => item.id == row.attachment_name_id)?.translations[0]?.name}
                        // status={data?.attachemnt_notification_statuses?.find(item => item.id == row.attachment_name_id)?.translations[0]?.name}
                        selected={table.selected.includes(row?.id)}
                        onSelectRow={() => table.onSelectRow(row?.id)}
                        onDeleteRow={() => handleDeleteRow(row?.id)}
                        onViewRow={() => handleViewRow(row?.id)}
                        onCreateRow={() => handleEditRow(row.data?.car_id || row.new_values?.car_id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {/* <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          /> */}
        </Card>
      {/* </Container> */}

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        order?.name?.toLowerCase()?.includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => isBetween(order.createdAt, startDate, endDate));
    }
  }

  return inputData;
}
