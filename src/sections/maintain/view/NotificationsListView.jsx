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

import OrderTableRow from '../notifications-table-row';
import OrderTableToolbar from '../notification-table-toolbar';
import OrderTableFiltersResult from '../notifications-tabel-filters-result';
import { useTranslate } from 'src/locales';
import { RouterLink } from 'src/routes/components';
import { useGetMaintenanceLogs } from 'src/api/maintainance';
import { useGetCar } from 'src/api/car';
import { useValues } from 'src/api/utils';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function NotificationsListView() {
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const TABLE_HEAD = [
    // { id: 'plateNumber', label: t('plateNumber'), width: 116 },
    { id: 'id', label: t('id'), width: 40 },

    // { id: 'vehicle', label: t('vehicle'), width: 116 },
    // { id: 'entry_date', label: t('entry date'), width: 120 },
    { id: 'rem_days', label: t('date'), width: 140 },
    { id: 'rem_days', label: t('duration'), width: 100 },
    { id: 'employee', label: t('employee'), width: 120 },
    // { id: 'createdAt', label: t('alert'), width: 140 },
    // { id: 'workSite', label: t('workSite'), width: 140 },
    { id: 'status', label: t('status'), width: 80 },
    // { id: 'driver', label: t('driver') },
    { id: '', width: 88 },
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
  const { logs } = useGetMaintenanceLogs()
  const { car } = useGetCar()
  const { data } = useValues()

  const [tableData, setTableData] = useState(logs.filter(item => item?.action == 'action_required' && item?.enabled));
  useEffect(() => {
    setTableData(logs.filter(item => item?.action == 'action_required' && item?.enabled))
  }, [logs])

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    car: car,
    data: data,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = 20;

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
      const deleteRow = tableData.filter((row) => row.id !== id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.vehicle.details(id));
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
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('allNoti')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            {
              name: t('maintenance'),
              href: paths.dashboard.maintenance.root,
            },
            { name: t('allNoti') },
          ]}
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />
        <Card>

          <OrderTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            dateError={dateError}
          />

          {/* {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
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
              <Table size={'small'} sx={{ minWidth: 960 }}>
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
                //     dataFiltered.map((row) => row.id)
                //   )
                // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    ).reverse()
                    .map((row) => (
                      <OrderTableRow
                        key={row.id}
                        row={row}
                        car={car?.find(item => item?.id == row?.data?.car_id || item?.id == row?.new_values?.car_id)}
                        action={data?.maintenance_log_action_enum?.find(item => item?.key == row?.action)?.translations[0]?.name}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
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

          <TablePaginationCustom
            count={dataFiltered.filter(item => item?.action == 'action_required' && item?.enabled).length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
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
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, car, data, comparator, filters, dateError }) {
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
        car?.find(item => item?.id == order?.data?.car_id)?.plat_number?.toLowerCase()?.includes(name.toLowerCase()) ||
        car?.find(item => item?.id == order?.data?.car_id)?.model?.translations?.name?.toLowerCase()?.includes(name.toLowerCase()) ||
        car?.find(item => item?.id == order?.data?.car_id)?.model?.company?.translations?.name?.toLowerCase()?.includes(name.toLowerCase()) ||
        data?.maintenance_log_action_enum?.find(item => item?.key == order?.action)?.translations[0]?.name?.toLowerCase()?.includes(name.toLowerCase())
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
