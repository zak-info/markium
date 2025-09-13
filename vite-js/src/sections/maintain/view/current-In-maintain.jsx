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

import OrderTableRow from '../current-In-maintain-table-row';
import OrderTableToolbar from '../notification-table-toolbar';
import OrderTableFiltersResult from '../order-table-filters-result';
import { useTranslate } from 'src/locales';
import { RouterLink } from 'src/routes/components';

import { useGetCarUnderMaintenance } from 'src/api/car';
import { useGetMaintenance } from 'src/api/maintainance';

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

  const { car } = useGetCarUnderMaintenance();
  const { maintenance } = useGetMaintenance();

  console.log("useGetCarUnderMaintenance : ",car);

  const { t } = useTranslate();

  const TABLE_HEAD = [
    { id: 'id', label: t('id'), width: 60 },
    { id: 'plateNumber', label: t('plateNumber'), width: 180 },
    // { id: 'vehicle', label: t('vehicle'), width: 116 },
    { id: 'entryDate', label: t('entryDate'), width: 140 },
    // { id: 'manitainClassification', label: t('manitainClassification'), width: 140 },
    { id: 'expectedMaintainDays', label: t('expectedMaintainDays'),width: 200 },
    // { id: 'theRest', label: t('theRest') },

    { id: 'totalAmount', label: t('workSite'), width: 140 },
    { id: 'malfunction', label: t('status'), width: 100 },
    { id: 'malfunction', label: t('car_status'), width: 100 },
    { id: 'cause', label: t('cause'), width: 140 },
    { id: 'actions', label: t('actions'), width: 140 },

    // { id: 'tenantName', label: t('state'), width: 140 },
    // { id: 'driver', label: t('driver'), width: 140 },

    { id: '', width: 20 },
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

  const [tableData, setTableData] = useState(car);

  useEffect(() => {
    setTableData(car);

    console.log("tableData : ",car)
  }, [car]);

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
      router.push(paths.dashboard.maintenance.details(id));
    },
    [router]
  );
  const handleViewMaintenance = useCallback(
    (id) => {
      router.push(paths.dashboard.maintenance.details(id));
    },
    [router]
  );
  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.maintenance.new+"?car_id="+id);
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
          heading={t('inMaintenance')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            {
              name: t('maintenance'),
              href: paths.dashboard.maintenance.root,
            },
            { name: t('inMaintenance') },
          ]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     href={paths.dashboard.maintenance.new}
          //     variant="contained"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     {t('addMaintain')}
          //   </Button>
          // }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />

        <Card>
          {/* <Tabs
              value={filters.status}
              onChange={handleFilterStatus}
              sx={{
                px: 2.5,
                boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              }}
            >
              {STATUS_OPTIONS.map((tab) => (
                <Tab
                  key={tab.value}
                  iconPosition="end"
                  value={tab.value}
                  label={tab.label}
                  icon={
                    <Label
                      variant={
                        ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                      }
                      color={
                        (tab.value === 'completed' && 'success') ||
                        (tab.value === 'pending' && 'warning') ||
                        (tab.value === 'cancelled' && 'error') ||
                        'default'
                      }
                    >
                      {['completed', 'pending', 'cancelled', 'refunded'].includes(tab.value)
                        ? tableData.filter((user) => user.status === tab.value).length
                        : tableData.length}
                    </Label>
                  }
                />
              ))}
            </Tabs> */}

          <OrderTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            dateError={dateError}
          />

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
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                    )
                    .map((row) => (
                      <OrderTableRow
                        key={row.id}
                        row={row}
                        setTableData={setTableData}
                        maintenance={maintenance?.find(item=> item?.car_id == row?.id)}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={()=>handleEditRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onViewMaintenance={() => handleViewMaintenance(row.id)}
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
            count={dataFiltered.length}
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
        order.orderNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.customer.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.customer.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
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
