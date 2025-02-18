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

// ----------------------------------------------------------------------

export default function OrderDetailsView({ id }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  // const currentMentainance = _orders.filter((order) => order.id === id)[0];

  const { maintenance, mutate } = useGetMaintenance();
  const { clauses } = useGetClauses(id)
  const maintenanceclauses = clauses.filter(item => item.maintenance_id == id)
  const [tableData, setTableData] = useState(clauses.filter(item => item.maintenance_id == id))
  useEffect(()=>{
    setTableData(clauses.filter(item => item.maintenance_id == id))
  },[clauses])

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
        backLink={paths.dashboard.order.root}
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
          {/* <UserNewEditForm maintenance_id={id}  /> */}
          <AppNewInvoice
            sx={{ marginTop: "10px" }}
            title={t('maintenanceItems')}
            maintenance_id={id}
            maintenanceclauses={maintenanceclauses}
            tableData={tableData}
            setTableData={setTableData}
            tableLabels={[
              { id: 'type', label: 'clause type' },
              { id: 'clause', label: 'clause ' },
              { id: 'cost', label: 'cost' },
              { id: 'qte', label: 'Qte' },
              { id: 'piece_status', label: 'piece status' },
              // { id: 'piece_status', label: 'piece status' },
              { id: 'total', label: 'total' },
              // { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>

        {/* <Grid xs={12} md={10}>
          <AppNewInvoice
            title={t('*  الأعطال المتكررة')}
            tableData={_appInvoices}
            tableLabels={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid> */}
      </Grid>
    </Container>
  );
}

OrderDetailsView.propTypes = {
  id: PropTypes.string,
};
