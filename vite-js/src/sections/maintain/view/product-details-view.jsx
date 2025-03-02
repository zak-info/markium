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
import { useGetMaintenance, useGetMaintenanceSpecs } from 'src/api/maintainance';
import { useGetCar, useGetCarPeriodicMaintenance } from 'src/api/car';
import { useGetClauses } from 'src/api/clauses';
import UserNewEditForm from 'src/sections/clause/user-new-edit-form';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Paper, Button
} from "@mui/material"
import AppNewInvoice2 from '../app-new-invoice2';
import AppNewInvoice3 from '../app-new-invoice3';
import { useValues } from 'src/api/utils';
// ----------------------------------------------------------------------

export default function OrderDetailsView({ id }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { data } = useValues();
  // const [data, setData] = useState([
  //   { id: 1, name: "Item 1", value: "Value 1" },
  //   { id: 2, name: "Item 2", value: "Value 2" },
  // ]);




  // const currentMentainance = _orders.filter((order) => order.id === id)[0];

  const { maintenance, mutate } = useGetMaintenance();
  const { clauses } = useGetClauses(id)
  const { maintenance_specs } = useGetMaintenanceSpecs()
  const { maintenance: periodic_maintenance } = useGetCarPeriodicMaintenance(maintenance?.car_id);
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
            maintenanceclauses={maintenanceclauses.map(item => item)}
            tableData={tableData?.map(item => ({ ...item, total: item.cost * item?.quantity, clause: data?.maintenance_specifications?.find(item2 => item2.id == item?.related_id)?.name }))}
            setTableData={setTableData}
            tableLabels={[
              { id: "related_type",key_to_update:"related_type",label: t("clause_type"), editable: true, type: "select", options: [{ value: "periodic", lable: t("periodic") }, { value: "not-periodic", lable: t("not_periodic") }]  ,width: 180},
              { id: "clause",      key_to_update:"related_id",  label: t("clause"),      editable: true, type: "select", options: [...periodic_maintenance , ...maintenance_specs]?.map(item => ({value : item.id , lable:item?.name})) ,width: 180},
              { id: "cost",        key_to_update:"cost" , label: t("cost"),              editable: true, type: "number",width: 140},
              { id: "quantity",    key_to_update:"quantity",  label: t("qte"),           editable: true, type: "number",width: 100 },
              { id: "piece_status",key_to_update:"piece_status",label: t("piece_status"),editable: true, type: "select", options: data?.piece_status_enum?.map(item => ({ value: item.key, lable: item?.translations[0]?.name })) ,width: 140},
              { id: "total",       key_to_update:"total",  label: t("total"),            editable: false ,width: 140},
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
