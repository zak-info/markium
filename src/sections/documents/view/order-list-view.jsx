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
import { RouterLink } from 'src/routes/components';

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
import { useTranslate } from 'src/locales';
import { useGetDocuments } from 'src/api/document';
import { useValues } from 'src/api/utils';
import { useGetCar } from 'src/api/car';
import { useGetDrivers } from 'src/api/drivers';
import PermissionsContext from 'src/auth/context/permissions/permissions-context';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...ORDER_STATUS_OPTIONS];

const defaultFilters = {
  attachment_name_id: '',
  status: 'all',
  expiry_date: null,
  release_date: null,
};

// ----------------------------------------------------------------------

export default function OrderListView() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const TABLE_HEAD = [
    // { id: 'orderNumber', label: t('vehicle'), width: 116 },
    { id: 'attachment_name_id', label: t('attachment_name'), width: 50 },
    { id: 'attachment_type_id', label: t('attachment_type'), width: 50 },
    { id: 'RD & ED', label: t('document_duration'), width: 140 },
    { id: 'attachable', label: t('attachable'), width: 140 },
    { id: 'document_duration_days', label: t('remaining'), width: 50 },
    // { id: 'status', label: t('status'), width: 140 },
    // { id: 'totalAmount2', label: t('workSite'), width: 140 },
    // { id: 'totalAmount2', label: t('tenantName'), width: 140 },

    { id: '', width: 88 },
  ];

  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();


  const { car } = useGetCar()
  const { drivers } = useGetDrivers()
  const { data } = useValues();

  const { documents, mutate } = useGetDocuments()
  console.log("documents : ", documents);

  const [tableData, setTableData] = useState(documents);
  useEffect(() => {
    setTableData(documents);
  }, [documents]);
  const [filters, setFilters] = useState(defaultFilters);

  // const dateError = isAfter(filters.release_date, filters.expiry_date);
  const dateError = null;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
    data,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset =
    !!filters?.attachment_name_id || filters?.status !== 'all' || (!!filters?.release_date && !!filters?.expiry_date);

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
      mutate();
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
      router.push(paths.dashboard.order.details(id));
    },
    [router]
  );
  // const handleEditRow = useCallback(
  //   (id) => {
  //     router.push(paths.dashboard.order.edit(id));
  //   },
  //   [router]
  // );

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
          heading={t('documentsList')}
          links={[
            {
              name: t('dashboard'),
              href: paths.dashboard.root,
            },
            {
              name: t('documentsList'),
              href: paths.dashboard.documents.root,
            },
            { name: t('documents') },
          ]}
          action={
            <PermissionsContext action={"create.attachment"} >
              <Button
                component={RouterLink}
                href={paths.dashboard.documents.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                {t('addNewDocument')}
              </Button>
            </PermissionsContext>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <OrderTableToolbar filters={filters} onFilters={handleFilters} dateError={dateError} />

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
                        attachment_name={data?.attachmenat_names?.find(item => item.id == row?.attachment_name_id)?.translations[0]?.name}
                        attachment_type={data?.attachment_types?.find(item => item.id == row?.attachment_type_id)?.translations[0]?.name}
                        attachable_primary={row?.attachable_type == "car" ? car?.find(item => item.id == row.attachable_id)?.model?.company?.translations?.name : drivers?.find(item => item?.id == row?.attachable_id)?.name}
                        attachable_second={row?.attachable_type == "car" ? car?.find(item => item.id == row.attachable_id)?.plat_number : drivers?.find(item => item?.id == row?.attachable_id)?.phone}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        // onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
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

function applyFilter({ inputData, comparator, filters, dateError, data }) {
  const { status, attachment_name_id, release_date, expiry_date } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (attachment_name_id) {
    inputData = inputData.filter(
      (item) =>
        // item.attachment_name_id.toString().toLowerCase().includes(attachment_name_id.toLowerCase())
        data?.attachmenat_names?.find(i => i?.id == item?.attachment_name_id)?.translations[0]?.name.toLowerCase().includes(attachment_name_id.toLowerCase())
    );
  }
  if (release_date) {
    inputData = inputData.filter(
      (item) =>
        new Date(item.release_date).toLocaleDateString().toLowerCase().includes(new Date(release_date).toLocaleDateString().toLowerCase())
    );
  }
  if (expiry_date) {
    inputData = inputData.filter(
      (item) =>
        //  item.expiry_date.toLowerCase().includes(expiry_date.toLowerCase())
        new Date(item.expiry_date).toLocaleDateString().toLowerCase().includes(new Date(expiry_date).toLocaleDateString().toLowerCase())
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.status === status);
  }
  // if (!dateError) {
  //   if (release_date && expiry_date) {
  //     inputData = inputData.filter((order) => isBetween(order.createdAt, release_date, expiry_date));
  //   }
  // }

  return inputData;
}
