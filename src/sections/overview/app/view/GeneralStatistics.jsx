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
import EcommerceWelcome from '../../e-commerce/ecommerce-welcome';
import ZaityMotivationIllustration from 'src/assets/illustrations/zaity-motivation-illustration';
import Chart from 'src/components/chart';
import ChartLine from 'src/sections/_examples/extra/chart-view/chart-line';

import AppWidget from '../app-widget';
import { useGetMaintenance } from 'src/api/maintainance';
import EcommerceSalesOverview from '../../e-commerce/fin2-ecommerce-sales-overview';


const langsNum = { en: 0, ar: 1 };

export default function GeneralStatistics() {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useSettingsContext();
  const { currentLang } = useLocales();

  const { statistics, isLoading: loadingStatistics } = useGetStatistics();
  const { car: Gcar, isLoading: loadingCars } = useGetCar();
  const [car, setCar] = useState(Gcar)
  useEffect(() => {
    setCar(Gcar)
  }, [Gcar])
  const { claims: Gclaims, isLoading: loadingClaims } = useGetAllClaim();
  const { drivers, isLoading: loadingDrivers } = useGetDrivers();
  const { contracts: Gcontracts, isLoading: loadingContracts } = useGetContracts();
  const { maintenance, maintenanceLoading } = useGetMaintenance()
  console.log("maintenance :", maintenance)

  const [claims, setClaims] = useState([]);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    if (Gclaims) setClaims(Gclaims);
  }, [Gclaims]);

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

  function getAverageMaintenancePerCar(maintenance, cars) {
    // find cars that actually exist in maintenance
    const carsInMaintenance = cars.filter(c =>
      maintenance.some(m => m.car_id === c.id)
    );

    if (carsInMaintenance.length === 0) return 0;

    // total maintenance days
    const totalDays = maintenance.reduce((sum, m) => {
      const start = new Date(m.entry_date);
      const end = new Date(m.exit_date);
      const days = (end - start) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);

    // divide only by cars that had maintenance
    return totalDays / carsInMaintenance.length;
  }


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box mt={3} display="grid" rowGap={2} columnGap={2} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}>
        <Grid xs={12} md={6} lg={4}>
          {(
            <>
              <EcommerceWelcome
                direction="column"
                id="demo__1"
                title={t("hi_welcome_back")}
                description={t("manage_your_business")}
                img={<ZaityMotivationIllustration />}
              // action={
              //   <Button variant="contained" color="primary">
              //     Go Now
              //   </Button>
              // }
              />
            </>
          )}
        </Grid>
        <PermissionsContext action={'read.car'}>
          <Grid xs={12} md={6} lg={4}>
            {/* loadingCars ? renderChartSkeleton() : */}
            {/* <EmptyContent filled title={t("no_data")} sx={{ py: 10 }} /> */}
            {
              loadingCars || !car?.length ? (
                renderChartSkeleton()
              )
                :
                (
                  <>
                    {/* <EcommerceSaleByGender
                      title={t('vehicles')}
                      total={car?.length}
                      chart={{
                        // colors: ["#6457AA", "#423524", "#678FFF", "#987324"],
                        series: statistics?.cars_by_status?.map(item => ({
                          label: item?.status?.key === 'available' ? t('activated') :
                            item?.status?.key === 'rented' ? t('bussy') :
                              item?.status?.key === 'under_maintenance' ? t('under_maintenance') :
                                item?.status?.translations?.[langsNum[currentLang.value]]?.name || 'N/A',
                          value: item?.count || 0
                        })) || []
                      }}
                    /> */}
                    <AppCurrentDownload
                      title={t('vehicles')}
                      locale='ar'
                      chart={{
                        // colors: ["#6457AA", "#423524", "#678FFF", "#987324"],
                        series: statistics?.cars_by_status?.map(item => ({
                          label: item?.status?.key === 'available' ? t('activated') :
                            item?.status?.key === 'rented' ? t('bussy') :
                              item?.status?.key === 'under_maintenance' ? t('under_maintenance') :
                                item?.status?.translations?.[langsNum[currentLang.value]]?.name || 'N/A',
                          value: item?.count || 0
                        })) || []
                      }}
                    />
                  </>
                )
            }
          </Grid>
        </PermissionsContext>
        <PermissionsContext action={'read.driver'}>
          <Grid xs={12} md={6} lg={4}>
            {/* <EmptyContent filled title={t("no_data")} sx={{ py: 10 }} /> */}
            {loadingDrivers || !drivers?.length ? (
              renderChartSkeleton()
            ) : (
              <>
                {/* <EcommerceSaleByGender
                  title={t('drivers')}
                  total={drivers?.length}
                  chart={{
                    series: [
                      { label: t('available'), value: statistics?.drivers_by_rental?.not_rented || 0 },
                      { label: t('bussy'), value: statistics?.drivers_by_rental?.rented || 0 },
                    ]
                  }}
                /> */}
                <AppCurrentDownload
                  title={t('drivers')}
                  locale='ar'
                  chart={{
                    series: [
                      { label: t('available'), value: statistics?.drivers_by_rental?.not_rented || 0 },
                      { label: t('bussy'), value: statistics?.drivers_by_rental?.rented || 0 },
                    ]
                  }}
                />
              </>
            )}
          </Grid>
        </PermissionsContext>
      </Box>

      <Box mt={3} display="grid" columnGap={2} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
        <PermissionsContext action={'read.claim'}>
          <Grid xs={12} md={12} lg={16}>
            <EcommerceSalesOverview title={t("operational_kpi")} data={
              [
                { label: t("car_renting"), totalAmount: car?.length, value: ((car?.filter(i => i.status?.key == "rented")?.length / car?.length) * 100).toFixed(2), color: "primary" },
                { label: t("avrg_car_maintenance"), totalAmount: getAverageMaintenancePerCar(maintenance, car).toFixed(0) + " " + t("days"), value: 0, color: "secondary" },
                // { label: t("maintenance_dates"), totalAmount: 300, value: 0, color: "warning" },
              ]
            } />
          </Grid>
        </PermissionsContext>
        <ChartLine
          title={t("maintenance_over_time")}
          categories={[t('jan'), t('feb'), t('mar'), t('apr'), t('may'), t('jun'), t('jul'), t('aug'), t('sep'), t('oct'), t('nov'), t('dec')]}
          series={[
            {
              data: countMaintenanceByMonth(maintenance, "created_at"),
            },
          ]}
        />

      </Box>
    </Container>
  );
}
