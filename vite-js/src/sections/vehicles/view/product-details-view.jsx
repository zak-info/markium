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
import { margin, width } from '@mui/system';
import { useGetDocuments } from 'src/api/document';
import { useValues } from 'src/api/utils';
import { Button } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function OrderDetailsView({ id }) {
  const settings = useSettingsContext();

  const { t } = useTranslate();

  const { carDetails } = useGetCompanyByID(id);
  const { documents } = useGetDocuments()
  const carDocuments = documents.filter(item => item.attachable_id == id && item.attachable_type == "car")

  // const {data} = useValues()


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
          </Stack>
        </Grid>
        <Grid xs={12} md={4}>
          <div className='' style={{}}>
            <OrderDetailsInfo
              carDetails={carDetails}
              customer={currentOrder?.customer}
              delivery={currentOrder?.delivery}
              payment={currentOrder?.payment}
              shippingAddress={currentOrder?.shippingAddress}
            />
            <AppNewInvoiceBreakdown
              style={{ marginTop: "20px" }}
              title={t('Vehicul_Documents')}
              tableData={carDocuments}
              tableLabels={[
                { id: 'document', label: t('document') },
                { id: 'attach', label: t('attach') },
                { id: 'invoice', label: t('invoice') },
                // { id: 'status', label: t('cost') },
              ]}
            />
          </div>
        </Grid>

      </Grid>

      <Grid container spacing={3} className='w-full flex flex-col pt-6 gap-4'>
        <Grid xs={12} md={12}>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <Button
              component={RouterLink}
              href={paths.dashboard.vehicle.pm(id)}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('addNewPeriodicMaintenance')}
            </Button>
          </Stack>
          <AppNewInvoice
            title={t('maintenanceItems')}
            tableData={maintenance}
            sx={{marginTop:"10px"}}
            tableLabels={[
              // { id: 'id', label: t('maintenanceNumber') },
              { id: 'maintenanceName', label: t('maintenanceName') },
              { id: 'note', label: t('note') },
              { id: 'EnD_ExD', label: t('EnD_ExD') },
              { id: 'status', label: t('cost') },
            ]}
          />
        </Grid>
        <Grid xs={12} md={12}>
          {/* <AppNewInvoiceBreakdown
            title={t('recurringFaults')}
            tableData={breakdown}
            tableLabels={[
              { id: 'id', label: t('maintenanceType') },
              { id: 'category', label: t('numberOfRepetitions') },
              { id: 'status', label: t('cost') },
            ]}
          /> */}
        </Grid>
      </Grid>
    </Container>
  );
}

OrderDetailsView.propTypes = {
  id: PropTypes.string,
};
