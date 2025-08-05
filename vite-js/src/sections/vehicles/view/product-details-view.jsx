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
import AppNewInvoiceBreakdown from '../app-new-breakdown';

import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';
import { useTranslate } from 'src/locales';
import { useGetCompanyByID, useGetBreakDown, useGetCarMaintenance } from 'src/api/car';
import { Box, height, margin, width } from '@mui/system';
import { useGetDocuments } from 'src/api/document';
import { useValues } from 'src/api/utils';
import { Button, Card, Tab, Tabs } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import CarDocListView from '../CarDocTable/NotificationsListView';
import CarMaintenancesListView from '../CarMaintenancesTable/NotificationsListView';
import OrderDetailsInfo2 from '../order-details-info2';
import OrderDetailsInfo3 from '../order-details-info3';
import CarLogsListView from '../CarLogsTable/NotificationsListView';
import CarPmListView from '../CarPmTable/NotificationsListView';
import CarCostInputTable from '../CarCost&InputTable/NotificationsListView';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CostListView from '../CarCost&InputTable/CostListView';

// ----------------------------------------------------------------------

export default function OrderDetailsView({ id }) {
  const settings = useSettingsContext();

  const { t } = useTranslate();

  const { carDetails:c_d } = useGetCompanyByID(id);
  const [carDetails , setCarDetails] = useState(c_d);
  useEffect(()=>{
    setCarDetails(c_d)
  },[c_d])
  console.log("carDetails : ",carDetails);
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

  const [section, setSection] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSection(newValue);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <OrderDetailsToolbar
        backLink={paths.dashboard.order.root}
        orderNumber={carDetails?.car_model_id}
        createdAt={carDetails?.created_at}
        status={carDetails?.status}
        setCarDetails={setCarDetails}
        idCar={id}
        carDetails={carDetails}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />
      
      <Box
        rowGap={3}
        columnGap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(1, 1fr)',
        }}
      >

        <Box
          rowGap={3}
          columnGap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
          }}
        >
          {/* <Grid xs={12} md={4}>
            <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
              <OrderDetailsInfo2
                carDetails={carDetails}
                customer={currentOrder?.customer}
                delivery={currentOrder?.delivery}
                payment={currentOrder?.payment}
                shippingAddress={currentOrder?.shippingAddress}
              />
            </Stack>
          </Grid> */}
          <Grid xs={12} md={20}  >
            <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column', height: '100%' }}>
              <OrderDetailsInfo
                carDetails={carDetails}
                customer={currentOrder?.customer}
                delivery={currentOrder?.delivery}
                payment={currentOrder?.payment}
                shippingAddress={currentOrder?.shippingAddress}
              />
            </Stack>
          </Grid>
          {/* <Grid xs={12} md={4}>
            <OrderDetailsInfo3
              carDetails={carDetails}
              customer={currentOrder?.customer}
              delivery={currentOrder?.delivery}
              payment={currentOrder?.payment}
              shippingAddress={currentOrder?.shippingAddress}
            />
          </Grid> */}
        </Box>
        <Card sx={{ p: 1 }}>
          <Tabs
            value={section}
            onChange={handleTabChange}
            aria-label="icon position tabs example"
            textColor="primary"
          >
            <Tab icon={<Iconify icon="duo-icons:settings" />} iconPosition="start" label={t("maintenance")} />
            <Tab icon={<Iconify icon="lets-icons:file-dock-search-fill" />} iconPosition="start" label={t("documents")} />
            <Tab icon={<Iconify icon="lets-icons:alarm-fill" />} iconPosition="start" label={t("alerts")} />
            <Tab icon={<Iconify icon="lets-icons:refresh" />} iconPosition="start" label={t("periodic_maintenances")} />
            <Tab icon={<Iconify icon="solar:dollar-line-duotone" />} iconPosition="start" label={t("costAndInput")} />
          </Tabs>
        </Card>
        <Box
          rowGap={3}
          columnGap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
          }}
        >
          <Box
            rowGap={3}
            columnGap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
            }}
          >
            {
              section == 0 ?
                <Grid xs={12} md={6}>
                  <CarMaintenancesListView id={id} />
                </Grid>
                : section == 2 ?
                  <Grid xs={12} md={6}>
                    <CarLogsListView id={id} />
                  </Grid>
                  : section == 1 ?
                    <Grid xs={12} md={6}>
                      <CarDocListView id={id} />
                    </Grid>
                    : section == 3 ?
                      <Grid xs={12} md={6}>
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
                        <CarPmListView id={id} />
                      </Grid>
                      : section == 4 ?
                        <CostListView id={id} />
                        :
                        null
            }
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

OrderDetailsView.propTypes = {
  id: PropTypes.string,
};
