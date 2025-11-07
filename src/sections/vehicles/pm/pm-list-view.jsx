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

import { useGetCar, deleteCar, AddCarToMentainance, useGetCarMaintenance, useGetCarPeriodicMaintenance } from 'src/api/car';
import { Grid } from '@mui/material';
import AppNewInvoice from './app-new-invoice';
import UserNewEditForm from './user-new-edit-form';
import { useValues } from 'src/api/utils';
// ----------------------------------------------------------------------

const defaultFilters = {
  plat_number: '',
  production_year: "",
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function PmListView(id) {
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();
  const { maintenance } = useGetCarPeriodicMaintenance(id?.id);

  const TABLE_HEAD = [
    // { id: 'orderNumber', label: t('company'), width: 116 },
    { id: 'model', label: t('model'), width: 120 },
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

  const [tableData, setTableData] = useState(maintenance);
  useEffect(()=>{
    console.log("maintenances :" ,maintenance);
    setTableData(maintenance);
  },[maintenance])

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const dataFiltered = applyFilter({
    inputData: maintenance,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

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


  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);


  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.vehicle.edit(id));
    },
    [router]
  );



  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('periodic_maintenances')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            {
              name: t('vehicle'),
              href: paths.dashboard.vehicle.root,
            },
            { name: t('periodic_maintenances') },
          ]}
          // action={
          //   <Button
          //     component={RouterLink}
          //     href={paths.dashboard.vehicle.new}
          //     variant="contained"
          //     startIcon={<Iconify icon="mingcute:add-line" />}
          //   >
          //     {t('addVehicle')}
          //   </Button>
          // }
          sx={{
            mb: {
              xs: 3,
              md: 5,
            },
          }}
        />
        <Grid xs={12} md={12}>
          <UserNewEditForm tableData={tableData} car_id={id} />
          <AppNewInvoice
          sx={{marginTop:"20px"}}
            title={t('items')}
            tableData={tableData}
           

            tableLabels={[
              { id: 'name', label: t('item') },
              { id: 'period_value', label: t('period_value') },
              // { id: 'note', label: t('note') },
              { id: 'last_value', label: t('last_value') },
              { id: 'status', label: t('action') },
            ]}
          />
        </Grid>

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
  const { plat_number, production_year } = filters;

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
