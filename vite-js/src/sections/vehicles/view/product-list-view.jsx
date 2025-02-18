import { useState, useCallback } from 'react';

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

import OrderTableRow from '../order-table-row';
import OrderTableToolbar from '../order-table-toolbar';
import OrderTableFiltersResult from '../order-table-filters-result';
import { useTranslate } from 'src/locales';
import { RouterLink } from 'src/routes/components';

import { useGetCar, deleteCar, AddCarToMentainance, markCarAsAvailable } from 'src/api/car';
import { useValues } from 'src/api/utils';
// ----------------------------------------------------------------------

const defaultFilters = {
  plat_number: '',
  production_year: "",
  status: 'All',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function OrderListView() {
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const { car, mutate } = useGetCar();
  const { data } = useValues()

  const TABLE_HEAD = [
    // { id: 'orderNumber', label: t('company'), width: 116 },
    { id: 'model', label: t('model'), width: 120, sorted: true },
    { id: 'plateNumber', label: t('plateNumber'), width: 120 },
    { id: 'manuYear', label: t('manuYear'), width: 90 },
    // { id: 'color', label: t('vehcileColor'), width: 120 },
    { id: 'vehicleCondition', label: t('vehicleCondition'), width: 140 },
    { id: 'driver', label: t('driver'), width: 100 },
    { id: 'contract', label: t('contract'), width: 100 },
    { id: 'actions', label: t('actions'), width: 90 },
    { id: '', width: 88 },
  ];

  const STATUS_OPTIONS = [
    { value: 'all', label: t('all') },
    { value: 'available', label: t('available') },
    { value: 'underProcessing', label: t('underProcessing') },
    { value: 'rented', label: t('rented') },
    { value: 'under_maintenance', label: t('under_maintenance') },
  ];

  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(car);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: car,
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
    !!filters.plat_number

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      // table.onResetPage();
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
      deleteCar(id)
        .then(() => {
          enqueueSnackbar('Delete success!');
          mutate();
        })
        .catch((err) => {
          enqueueSnackbar(err?.message, { variant: 'error' });
        });
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );
  const handleAddCarToMentainance = useCallback(
    async (id) => {
      const result = await AddCarToMentainance(id)
        .then(() => {
          enqueueSnackbar('Operation success!');
          mutate();
        })
        .catch((err) => {
          enqueueSnackbar(err?.message, { variant: 'error' });
        });
      console.log("result : ", result);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );
  const handleMarkCarAsAvailable = useCallback(
    async (id) => {
      const result = await markCarAsAvailable(id)
        .then(() => {
          enqueueSnackbar('Operation success!');
          mutate();
        })
        .catch((err) => {
          enqueueSnackbar(err?.message, { variant: 'error' });
        });
      console.log("result : ", result);
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
  const handleViewDriverRow = useCallback(
    (id) => {
      router.push(paths.dashboard.drivers.details(id));
    },
    [router]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.vehicle.edit(id));
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
          heading={t('vehiclesList')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            {
              name: t('vehicles'),
              href: paths.dashboard.vehicle.root,
            },
            { name: t('vehiclesList') },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.vehicle.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('addVehicle')}
            </Button>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />

        <Card sx={{ mb: 4 }}>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            <Tab
              key={"all"}
              iconPosition="end"
              value={"All"}
              label={"All"}
              icon={
                <Label
                  variant={'soft'}
                  color={'default'}
                >
                  {car.length}
                </Label>
              }
            />
            {data?.car_statuses?.map((tab) => (
              <Tab
                key={tab.key}
                iconPosition="end"
                value={tab?.key}
                label={tab?.translations[0]?.name}
                icon={
                  <Label
                    variant={
                      ((tab.key === 'all' || tab.key === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.key === 'available' && 'success') ||
                      (tab.key === 'underProcessing' && 'warning') ||
                      (tab.key === 'under_maintenance' && 'error') ||
                      'default'
                    }
                  >
                    {['available', 'under_preparation', 'under_maintenance', 'rented'].includes(
                      tab.key
                    )
                      ? car.filter((user) => user.status?.key === tab.key).length
                      : car.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <OrderTableToolbar
            filters={filters}
            onFilters={handleFilters}
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
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
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
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onDriverViewRow={() => handleViewDriverRow(row?.driver?.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onAddCarToMentainance={() => handleAddCarToMentainance(row.id)}
                        onMarkCarAsAvailable={() => handleMarkCarAsAvailable(row.id)}
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
            Are you sure want to delete <strong> {table?.selected?.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm?.onFalse();
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
  const { status, plat_number, production_year } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (plat_number) {
    const searchTerm = plat_number?.toLowerCase();
    inputData = inputData.filter(order =>
      order?.plat_number?.toLowerCase()?.includes(searchTerm) ||
      order?.color?.translations?.name?.toLowerCase()?.includes(searchTerm) ||
      order?.model?.translations?.name?.toLowerCase()?.includes(searchTerm) ||
      order?.model?.company?.translations?.name?.toLowerCase()?.includes(searchTerm) ||
      order?.production_year?.includes(searchTerm)
    );
  }
  if (status) {
    if (status == "All") {
      inputData = inputData;
    } else {
      inputData = inputData.filter(order =>
        order?.status?.key?.includes(status)
      );
    }
  }
  // if (production_year) {
  //   const searchTerm = production_year;
  //   inputData = inputData.filter(order => 
  //     order?.production_year?.includes(searchTerm)
  //   );
  // }



  // if (!dateError) {
  //   if (startDate && endDate) {
  //     inputData = inputData.filter((order) => isBetween(order.createdAt, startDate, endDate));
  //   }
  // }

  return inputData;
}
