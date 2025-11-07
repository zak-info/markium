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
import { useLocales, useTranslate } from 'src/locales';
import { useGetMaintenance, useGetMaintenanceSpecs, useShowMaintenance } from 'src/api/maintainance';
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
import InvoiceListView from '../invoice/NotificationsListView';
import { Box } from '@mui/system';
import { useGetDetailedDriver } from 'src/api/drivers';
// ----------------------------------------------------------------------

export default function OrderDetailsView({ id }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { data } = useValues();
  const p_n = { periodic: { en: "periodic", ar: "دوري" }, not_periodic: { en: "not_periodic", ar: "غير دوري" } }
  const { currentLang } = useLocales()


  // const [data, setData] = useState([
  //   { id: 1, name: "Item 1", value: "Value 1" },
  //   { id: 2, name: "Item 2", value: "Value 2" },
  // ]);




  // const currentMentainance = _orders.filter((order) => order.id === id)[0];

  // const { maintenance, mutate } = useGetMaintenance();
  const { maintenance, mutate } = useShowMaintenance(id);

  const { driver } = useGetDetailedDriver(maintenance?.car?.driver_id);
  const { clauses } = useGetClauses(id)
  const { maintenance_specs } = useGetMaintenanceSpecs()
  const maintenanceclauses = clauses.filter(item => item.maintenance_id == id)
  console.log(" maintenance : maintenance : maintenance : ", maintenance);

  const [tableData, setTableData] = useState(clauses.filter(item => item.maintenance_id == id))
  useEffect(() => {
    setTableData(clauses.filter(item => item.maintenance_id == id))
    console.log("data :: ", clauses.filter(item => item.maintenance_id == id));
  }, [clauses])

  // const currentMentainance = maintenance?.find((i) => i.id == id);
  const [currentMentainance, setCurrentMentainance] = useState(maintenance)
  useEffect(() => {
    setCurrentMentainance(maintenance);
  }, [maintenance])
  console.log("currentMentainance : ", currentMentainance);
  console.log("id : ", id);
  const { maintenance: periodic_maintenance } = useGetCarPeriodicMaintenance(currentMentainance?.car_id);
  const { car } = useGetCar()
  const currentCar = car?.find((i) => i.id == currentMentainance?.car?.id);

  console.log("spec or per : ", [...periodic_maintenance, ...maintenance_specs?.filter(item => !item?.is_periodic)]);
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
        status={currentMentainance?.status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
        idMaintenance={id}
        driver={driver}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={18} >
          <OrderDetailsItems
            maintenanceclauses={maintenanceclauses}
            currentMentainance={currentMentainance}
            setCurrentMentainance={setCurrentMentainance}
            maintenance_type={data?.maintenance_type_enum?.find(item => item.key == currentMentainance?.maintainance_type)?.translations[0]?.name}
            currentCar={currentCar}
            driver={driver}
            items={currentMentainance?.items}
            taxes={currentMentainance?.taxes}
            shipping={currentMentainance?.shipping}
            discount={currentMentainance?.discount}
            subTotal={currentMentainance?.subTotal}
            totalAmount={currentMentainance?.totalAmount}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ marginTop: "20px" }}>
        <Grid xs={12} md={12}>
          <AppNewInvoice3
            sx={{ marginTop: "10px" }}
            title={t('maintenanceItems')}
            maintenance_id={id}
            maintenanceclauses={maintenanceclauses.map(item => item)}
            tableData={tableData?.map(item => ({
              ...item,
              total: item.cost * item?.quantity,
              clause: data?.maintenance_specifications?.find(item2 => item2.id == item?.related_id)?.name,
              is_periodic: !!item?.is_periodic ? p_n?.periodic[currentLang?.value] : p_n?.not_periodic[currentLang?.value],
              tpiece_status: data?.piece_status_enum?.find(item2 => item2.key == item?.piece_status)?.translations[0]?.name,

            }))}
            setTableData={setTableData}
            tableLabels={[
              // { id: "is_periodic", key_to_update: "is_periodic", label: t("clause_type"), editable: false, creatable: true, type: "select", options: [{ value: "periodic", label: t("periodic") }, { value: "not-periodic", label: t("not_periodic") }], width: 100 },
              { id: "clause", key_to_update: "related_id", label: t("clause"), editable: false, creatable: true, type: "select", options: [...periodic_maintenance, ...maintenance_specs?.filter(item => !item?.is_periodic)]?.map(item => ({ value: item.id, label: item?.name })), width: 100 },
              { id: "cost", key_to_update: "cost", label: t("cost"), editable: true, creatable: true, type: "number", width: 100 },
              { id: "quantity", key_to_update: "quantity", label: t("qte"), editable: true, creatable: true, type: "number", width: 60 },
              { id: "tpiece_status", key_to_update: "piece_status", label: t("piece_status"), editable: true, creatable: true, type: "select", options: data?.piece_status_enum?.map(item => ({ value: item.key, label: item?.translations[0]?.name })), width: 100 },
              { id: "total", key_to_update: "total", label: t("total"), editable: false, creatable: false, width: 100 },
              { id: "note", key_to_update: "note", label: t("note"), editable: true, creatable: true, width: 300 },
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
