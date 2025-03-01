import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import OrderDetailsInfo from '../order-details-info';
import OrderDetailsItems from '../order-details-item';
import OrderDetailsToolbar from '../order-details-toolbar';
import OrderDetailsHistory from '../order-details-history';
import AppNewInvoice from '../app-new-invoice';

import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';
import { useTranslate } from 'src/locales';
import { useGetMaintenance } from 'src/api/maintainance';
import { useGetCar } from 'src/api/car';
import { useGetClauses } from 'src/api/clauses';
import UserNewEditForm from 'src/sections/clause/user-new-edit-form';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Paper, Button
} from "@mui/material"
import AppNewInvoice2 from '../app-new-invoice2';
import AppNewInvoice3 from '../app-new-invoice3';
// ----------------------------------------------------------------------

export default function OrderDetailsView({ id }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const [data, setData] = useState([
    { id: 1, name: "Item 1", value: "Value 1" },
    { id: 2, name: "Item 2", value: "Value 2" },
  ]);

  const [editing, setEditing] = useState({ rowId: null, field: null });

  const handleEdit = (rowId, field) => {
    setEditing({ rowId, field });
  };

  const handleChange = (event, rowId, field) => {
    setData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: event.target.value } : row))
    );
  };

  const handleBlur = () => {
    setEditing({ rowId: null, field: null });
  };

  const handleAddRow = () => {
    const newRow = { id: data.length + 1, name: "", value: "" };
    setData((prev) => [...prev, newRow]);
    setEditing({ rowId: newRow.id, field: "name" }); // Start editing the first cell of the new row
  };


  // const currentMentainance = _orders.filter((order) => order.id === id)[0];

  const { maintenance, mutate } = useGetMaintenance();
  const { clauses } = useGetClauses(id)
  const maintenanceclauses = clauses.filter(item => item.maintenance_id == id)
  const [tableData, setTableData] = useState(clauses.filter(item => item.maintenance_id == id))
  useEffect(() => {
    setTableData(clauses.filter(item => item.maintenance_id == id))
  }, [clauses])

  const currentMentainance = maintenance?.find((i) => i.id == id);
  const { car } = useGetCar()
  const currentCar = car?.find((i) => i.id == currentMentainance?.car?.id);

  const [status, setStatus] = useState(currentMentainance?.status);

  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <OrderDetailsToolbar
        backLink={paths.dashboard.maintenance.root}
        orderNumber={currentMentainance?.orderNumber}
        createdAt={currentMentainance?.createdAt}
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
        idMaintenance={id}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              currentMentainance={currentMentainance}
              currentCar={currentCar}
              items={currentMentainance?.items}
              taxes={currentMentainance?.taxes}
              shipping={currentMentainance?.shipping}
              discount={currentMentainance?.discount}
              subTotal={currentMentainance?.subTotal}
              totalAmount={currentMentainance?.totalAmount}
            />
          </Stack>
        </Grid>

        {/* <Grid xs={12} md={4}>
          <OrderDetailsInfo
            customer={currentMentainance?.customer}
            delivery={currentMentainance?.delivery}
            payment={currentMentainance?.payment}
            shippingAddress={currentMentainance?.shippingAddress}
          />
        </Grid> */}
      </Grid>

      <Grid container spacing={3} sx={{ marginTop: "20px" }}>
        <Grid xs={12} md={12}>
          <AppNewInvoice3
            sx={{ marginTop: "10px" }}
            title={t('maintenanceItems')}
            maintenance_id={id}
            maintenanceclauses={maintenanceclauses}
            tableData={tableData?.map(item => ({...item,maintenance_spec:data?.maintenance_specifications?.find(item => item.id == row?.related_id)?.name}))}
            setTableData={setTableData}
            tableLabels={[
              { id: 'type', label: t('clause_type') },
              { id: 'clause', label: t('clause') },
              { id: 'cost', label: t('cost') },
              { id: 'qte', label: t('qte') },
              { id: 'piece_status', label: t('piece_status') },
              { id: 'total', label: t('total') },
              { id: '' },
            ]}
          />
        </Grid>
        {/* <Grid xs={12} md={12}>
          <AppNewInvoice2 />
        </Grid> */}
      </Grid>
    </Container>
  );
}

OrderDetailsView.propTypes = {
  id: PropTypes.string,
};
