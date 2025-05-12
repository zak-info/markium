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

import OrderTableRow from '../order-table-row';
import OrderTableToolbar from '../order-table-toolbar';
import OrderTableFiltersResult from '../order-table-filters-result';
import { useLocales, useTranslate } from 'src/locales';
import { RouterLink } from 'src/routes/components';

import { useGetMaintenance, deleteMaintenance } from 'src/api/maintainance';
import { useGetCar } from 'src/api/car';
import { useValues } from 'src/api/utils';
import { useGetDrivers } from 'src/api/drivers';
import PermissionsContext from 'src/auth/context/permissions/permissions-context';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function OrderListView() {
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const days = { en: "dais", ar: "يوم" }
  const { currentLang } = useLocales()

  const TABLE_HEAD = [
    { id: 'id', label: t('id'), width: 80 },
    { id: 'plateNumber', label: t('plateNumber'), width: 116 },
    // { id: 'orderNumber', label: t('vehicle'), width: 144 },
    { id: 'workSite', label: t('workSite'), width: 144 },
    { id: 'remaining_days', label: t('remainingDate'), width: 144 },
    // { id: 'tenantName', label: t('tenantName'), width: 144 },
    { id: 'maintainStatus', label: t('maintainStatus'), width: 140 },
    { id: 'driver', label: t('driver'), width: 140 },
    { id: 'actions', label: t('actions'), width: 140 },
  ];

  const STATUS_OPTIONS = [
    { value: 'all', label: t('all') },
    { value: 'pending', label: t('pending') },
    { value: 'completed', label: t('completed') },
    // { value: 'under_maintenance', label: t('under_maintenance') },
    // { value: 'plat_number', label: t('plat_number') },

  ];

  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();


  const { car } = useGetCar()
  const { drivers } = useGetDrivers()
  const { data } = useValues();

  const { maintenance, mutate } = useGetMaintenance();
  console.log("maintenance : ", maintenance);
  const [tableData, setTableData] = useState([]);
  // exit_date,
  // status,
  // maintenance_manager,
  // car_model,
  // cause,
  // driver_phone_number,
  // plat_number,
  // car,
  // state,
  // occupant_name,
  // type,

  useEffect(() => {
    setTableData([...maintenance]);
  }, [maintenance]);

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
      deleteMaintenance(id)
        .then((res) => {
          enqueueSnackbar(res?.data?.message);
          mutate();
        })
        .catch((error) => {
          enqueueSnackbar(error?.data?.message, { variant: 'error' });
        });
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
  const handleViewMaintenance = useCallback(
    (id) => {
      router.push(paths.dashboard.maintenance.details(id));
    },
    [router]
  );

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.maintenance.edit(id));
    },
    [router]
  );
  const handleMarkAsCompleted = useCallback(
    (id) => {
      router.push(paths.dashboard.maintenance.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('plat_number', newValue);
    },
    [handleFilters]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('maintainList')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            {
              name: t('maintenance'),
              href: paths.dashboard.maintenance.root,
            },
            { name: t('maintainList') },
          ]}
          action={

            <PermissionsContext action={"create.maintenance"} >
              <Button
                component={RouterLink}
                href={paths.dashboard.maintenance.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                {t('addMaintain')}
              </Button>
            </PermissionsContext>
          }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />

        <Card>
          <Tabs
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
                      // (tab.value === 'damaged' && 'error') ||
                      'default'
                    }
                  >
                    {['completed', 'pending'].includes(tab.value)
                      ? tableData.filter((user) => user?.status?.key === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

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
                    .reverse()
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <OrderTableRow
                        key={row.id}
                        row={row}
                        days={days[currentLang?.value]}
                        car_model={car?.find(item => item?.model?.id == row?.car?.car_model_id)?.model?.translations?.name}
                        work_site={data?.states?.find(item => item?.id == row?.state_id)?.translations[0]?.name}
                        driver={drivers?.find(item => item.id == row?.car?.driver_id) || { name: t("---"), phone: "...." }}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onMarkAsCompleted={() => handleMarkAsCompleted(row.id)}
                        onViewRow={() => handleViewRow(row.car.id)}
                        onViewMaintenance={() => handleViewMaintenance(row?.id)}
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
  const { status, name, startDate, endDate, plat_number } = filters;

  // const stabilizedThis = inputData.map((el, index) => [el, index]);

  // stabilizedThis.sort((a, b) => {
  //   const order = comparator(a[0], b[0]);
  //   if (order !== 0) return order;
  //   return a[1] - b[1];
  // });

  // inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.company?.name?.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        order.car?.plat_number?.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  if (plat_number) {
    inputData = inputData.filter(
      (order) =>
        order.car?.plat_number?.toLowerCase().includes(plat_number.toLowerCase())
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

