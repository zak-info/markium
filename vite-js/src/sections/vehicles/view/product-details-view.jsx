import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

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
import AppNewInvoiceBreakdown from '../app-new-breakdown';

import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';
import { useTranslate } from 'src/locales';
import { useGetCompanyByID, useGetBreakDown, useGetCarMaintenance } from 'src/api/car';

// ----------------------------------------------------------------------

export default function OrderDetailsView({ id }) {
  const settings = useSettingsContext();

  const { t } = useTranslate();

  const { carDetails } = useGetCompanyByID(id);

  const { breakdown } = useGetBreakDown(id);

  const { maintenance } = useGetCarMaintenance(id);

  const currentOrder = _orders.filter((order) => order.id === id)[0];

  const [status, setStatus] = useState(currentOrder?.status);

  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <OrderDetailsToolbar
        backLink={paths.dashboard.order.root}
        orderNumber={carDetails?.car_model_id}
        createdAt={carDetails?.created_at}
        status={carDetails?.status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              carDetails={carDetails}
              items={currentOrder?.items}
              taxes={currentOrder?.taxes}
              shipping={currentOrder?.shipping}
              discount={currentOrder?.discount}
              subTotal={currentOrder?.subTotal}
              totalAmount={currentOrder?.totalAmount}
            />

            {/* <OrderDetailsHistory history={currentOrder?.history} /> */}
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            carDetails={carDetails}
            customer={currentOrder?.customer}
            delivery={currentOrder?.delivery}
            payment={currentOrder?.payment}
            shippingAddress={currentOrder?.shippingAddress}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <AppNewInvoice
            title={t('maintenanceItems')}
            tableData={maintenance}
            tableLabels={[
              { id: 'id', label: t('maintenanceNumber') },
              { id: 'category', label: t('maintenanceName') },
              { id: 'price', label: t('date') },
              { id: 'status', label: t('cost') },
              { id: '' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <AppNewInvoiceBreakdown
            title={t('recurringFaults')}
            tableData={breakdown}
            tableLabels={[
              { id: 'id', label: t('maintenanceType') },
              { id: 'category', label: t('numberOfRepetitions') },
              { id: 'price', label: t('date') },
              { id: 'status', label: t('cost') },
              { id: '' },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

OrderDetailsView.propTypes = {
  id: PropTypes.string,
};
