import { useEffect, useState } from 'react';
import { Box, Button, Container, Skeleton } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useSettingsContext } from 'src/components/settings';
import PermissionsContext from 'src/auth/context/permissions/permissions-context';

import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';
import LineChart from '../line-chart';
import EmptyContent from 'src/components/empty-content';

import { useGetCompany } from 'src/api/company';
import { useGetCar } from 'src/api/car';
import { useGetAllClaim } from 'src/api/claim';
import { useGetDrivers } from 'src/api/drivers';
import { useGetContracts } from 'src/api/contract';
import { useGetStatistics } from 'src/api/statistics';
import { useValues } from 'src/api/utils';
import { useLocales } from 'src/locales';
import EcommerceSaleByGender from '../../e-commerce/ecommerce-sale-by-gender';

import Chart from 'src/components/chart';
import ChartLine from 'src/sections/_examples/extra/chart-view/chart-line';

import AppWidget from '../app-widget';
import { useGetMaintenance } from 'src/api/maintainance';
import EcommerceSalesOverview from '../../e-commerce/fin2-ecommerce-sales-overview';
import CarsListView from './Alerts/CarsListView';
import EcommerceWelcome from '../../e-commerce/error-ecommerce-welcome';
import AlertZaityMotivationIllustration from 'src/assets/illustrations/alert-zaity-motivation-illustration';
import Iconify from 'src/components/iconify';
import WEcommerceWelcome from '../../e-commerce/warning-ecommerce-welcome';
import { useGetClients } from 'src/api/client';
import ContractClaimsListView from './Alerts/ContractClaimsListView';
import { fDate } from 'src/utils/format-time';
import SecondaryZaityMotivationIllustration from 'src/assets/illustrations/secondary-zaity-motivation-illustration';
import DocumentsListView from './Alerts/DocumentsListView';
import ContractsListView from './Alerts/ContractsListView';

const langsNum = { en: 0, ar: 1 };

export default function DangerAlerts() {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useSettingsContext();
  const { currentLang } = useLocales();

  const { statistics, isLoading: loadingStatistics } = useGetStatistics();
  const { car, isLoading: loadingCars } = useGetCar();
  const { claims: Gclaims, isLoading: loadingClaims } = useGetAllClaim();
  const { drivers, isLoading: loadingDrivers } = useGetDrivers();
  const { contracts: Gcontracts, isLoading: loadingContracts } = useGetContracts();
  const { maintenance, maintenanceLoading } = useGetMaintenance()
  console.log("maintenance :", maintenance)


  const [claims, setClaims] = useState([]);
  const [contracts, setContracts] = useState([]);


  const { clients } = useGetClients()
  console.log("clients : ", clients?.find(item => item?.id == 1));
  console.log("contracts : ", contracts?.find(item => item?.id == 1));


  const formulateClaims = (list) => {
    return list.map((item) => {
      const contract = contracts?.find((c) => c.id === item?.contract_id);
      const client = clients?.find((cl) => cl.id === contract?.client_id);

      return {
        ...item,
        payment_date: fDate(new Date(item?.paiment_date)),
        date: fDate(new Date(item?.created_at)),
        gstatus: item?.status?.translations?.[0]?.name,
        contract: contract?.ref,
        client: client?.name,
        client_id: client?.id,
      };
    });
  };



  const [data, setDate] = useState(formulateClaims(claims));
  useEffect(() => {
    setDate(formulateClaims(claims?.filter( c => new Date(c.paiment_date) < new Date && c?.status?.key != "paid_claim" )))
  }, [claims, clients, contracts])


  useEffect(() => {
    setClaims(Gclaims);
    // ?.filter( c => ["overdue_claim","severely_overdue_claim"]?.includes(c.status?.key))
    // paid_claim
  }, [Gclaims,clients, contracts]);

  useEffect(() => {
    if (Gcontracts) setContracts(Gcontracts);
  }, [Gcontracts]);

  const loading = loadingStatistics || loadingCars || loadingClaims || loadingDrivers || loadingContracts;

  const renderChartSkeleton = () => <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />;


  function countMaintenanceByMonth(maintenances, key) {
    const counts = Array(12).fill(0); // 12 months initialized with 0
    maintenances?.forEach(contract => {
      if (contract[key]) {
        const date = new Date(contract[key]);
        const month = date.getMonth(); // 0–11
        counts[month] += 1;
      }
    });

    return counts;
  }

  console.log("countMaintenanceByMonth(maintenance) L ", countMaintenanceByMonth(maintenance))


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} >
      <Box mt={3} display="flex" rowGap={2} columnGap={2} justifyContent={"space-between"} flexDirection={{ xs: "column", lg: "row" }}  >
        <Grid xs={14} md={6} lg={8} >
          {(
            <>
              <EcommerceWelcome
                direction="column"
                id="demo__1"
                title={t("cars_log_alert")}
                // description={t("manage_your_business")}
                img={
                  <>
                    <AlertZaityMotivationIllustration />
                    <Iconify icon="eva:alert-triangle-fill" width={128} sx={{ position: "absolute" }} />
                  </>
                }
              />
            </>
          )}
        </Grid>
        <CarsListView />
      </Box>
      <Box mt={3} display="flex" rowGap={2} columnGap={2} justifyContent={"space-between"} flexDirection={{ xs: "column", lg: "row" }}  >
        <Grid xs={14} md={6} lg={8}>
          {(
            <>
            <EcommerceWelcome
                direction="column"
                id="demo__1"
                title={t("claims_to_late")}
                // description={t("manage_your_business")}
                img={
                  <>
                    <AlertZaityMotivationIllustration />
                    <Iconify icon="solar:dollar-minimalistic-bold-duotone" width={128} sx={{ position: "absolute" }} />
                  </>
                }
              />
             
            </>
          )}
        </Grid>
        <ContractClaimsListView claimsLoading={loadingClaims} data={data} with_contracts={true} />
      </Box>

      <Box mt={3} display="flex" rowGap={2} columnGap={2} justifyContent={"space-between"} flexDirection={{ xs: "column", lg: "row" }}  >
        <Grid xs={14} md={6} lg={6}>
          {(
            <>
            <EcommerceWelcome
                direction="column"
                id="demo__1"
                title={t("contract_in_30_days")}
                // description={t("manage_your_business")}
                img={
                  <>
                    <AlertZaityMotivationIllustration />
                    <Iconify icon="solar:hand-money-bold-duotone" width={128} sx={{ position: "absolute" }} />
                  </>
                }
              />
            </>
          )}
        </Grid>
        <ContractsListView  />
      </Box>
      <Box mt={3} display="flex" rowGap={2} columnGap={2} justifyContent={"space-between"} flexDirection={{ xs: "column", lg: "row" }}  >
        <Grid xs={14} md={6} lg={6}>
          {(
            <>
            <EcommerceWelcome
                direction="column"
                id="demo__1"
                title={t("attachments_soon")}
                // description={t("manage_your_business")}
                img={
                  <>
                    <AlertZaityMotivationIllustration />
                    <Iconify icon="solar:document-text-bold-duotone" width={128} sx={{ position: "absolute" }} />
                  </>
                }
              />
            </>
          )}
        </Grid>
        <DocumentsListView  />
      </Box>



    </Container>
  );
}
