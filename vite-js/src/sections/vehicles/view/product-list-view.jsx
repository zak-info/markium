import { useState, useCallback, useContext, useEffect } from 'react';

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
import { useGetContracts } from 'src/api/contract';
import { useGetCompany } from 'src/api/company';
import { useGetClients } from 'src/api/client';
import PermissionsContext from 'src/auth/context/permissions/permissions-context';
// ----------------------------------------------------------------------

const defaultFilters = {
  plat_number: '',
  rented: '',
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
  console.log("car : car : ", car);
  const { data } = useValues()
  const { contracts } = useGetContracts()
  const { clients } = useGetClients()

  const TABLE_HEAD = [
    // { id: 'orderNumber', label: t('company'), width: 116 },
    { id: 'plateNumber', label: t('plateNumber'), width: 90 },
    { id: 'model', label: t('model'), width: 100, sorted: true },
    { id: 'manuYear', label: t('manufacturingYear'), width: 80 },
    // { id: 'color', label: t('vehcileColor'), width: 120 },
    { id: 'vehicleCondition', label: t('vehicleCondition'), width: 120 },
    { id: 'driver', label: t('driver'), width: 180 },
    { id: 'company', label: t('client'), width: 180, align: "start" },
    { id: 'contract', label: t('contract'), width: 60, align: "start" },
    { id: 'actions', label: t('actions'), width: 60, align: "right" },
    // { id: '', width: 88 },
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
  console.log(contracts);

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
          enqueueSnackbar(t('operation_success'));
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
          enqueueSnackbar(t('operation_success'));
          "Operation success"
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
          enqueueSnackbar(t('operation_success'));
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
  const handleViewContractRow = useCallback(
    (id) => {
      router.push(paths.dashboard.clients.contractsDetails(id));
    },
    [router]
  );

  const handleViewCompanyRow = useCallback(
    (id) => {
      router.push(paths.dashboard.clients.details(id));
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
            <>
              <PermissionsContext action={'create.car'}>
                <Button
                  component={RouterLink}
                  href={paths.dashboard.vehicle.new}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  {t('addVehicle')}
                </Button>
              </PermissionsContext>
            </>
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
              label={t("all")}
              icon={
                <Label
                  variant={'soft'}
                  color={'default'}
                >
                  {car.length}
                </Label>
              }
            />
            {data?.car_statuses?.map(item => ({ ...item, translations: item?.key == "under_maintenance" ? [{ name: "تحت الصيانة" }] : item?.translations }))?.map((tab) => (
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
                      (tab.key === 'under_preparation' && 'secondary') ||
                      (tab.key === 'under_maintenance' && 'error') ||
                      'default'
                    }
                  >
                    {['available', 'under_preparation', 'under_maintenance'].includes(tab.key)
                      ? car.filter((user) => user.status?.key === tab.key).length
                      : car.length

                    }
                  </Label>
                }
              />
            ))}
            <Tab
              key={"rented"}
              iconPosition="end"
              value={"rented"}
              label={t("rented")}
              icon={
                <Label
                  variant={'soft'}
                  color={'warning'}
                >
                  {car.filter((user) => user?.is_rented).length}
                </Label>
              }
            />
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
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1060 }}>
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
                      <>
                        <OrderTableRow
                          key={row.id}
                          row={row}
                          contract={contracts.find(contract => contract?.clauses?.some(clause => clause.clauseable_type == "car" && clause.clauseable_id == row?.id))}
                          companies={clients}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                          onDriverViewRow={() => handleViewDriverRow(row?.driver?.id)}
                          onContractViewRow={(id) => handleViewContractRow(id)}
                          onCompanyViewRow={(id) => handleViewCompanyRow(id)}
                          onEditRow={() => handleEditRow(row.id)}
                          onAddCarToMentainance={() => handleAddCarToMentainance(row.id)}
                          onMarkCarAsAvailable={() => handleMarkCarAsAvailable(row.id)}
                        />
                      </>
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
  const { status, plat_number, production_year, rented } = filters;

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
  if (rented) {
    if (rented == "rented") {
      inputData = inputData.filter(order =>
        order?.is_rented
      );
    }
  }
  if (status) {
    if (status == "All") {
      inputData = inputData;
    } else if (status == "rented") {
      inputData = inputData.filter(order =>
        order?.is_rented
      );
    } else {
      inputData = inputData.filter(order =>
        order?.status?.key?.includes(status)
      );
    }
  }
  return inputData;
}
