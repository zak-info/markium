import { useEffect, useState } from 'react';
import { Box, Container, Skeleton } from '@mui/material';
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

const langsNum = { en: 0, ar: 1 };

export default function OverviewAppView() {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useSettingsContext();
  const { currentLang } = useLocales();

  const { statistics, isLoading: loadingStatistics } = useGetStatistics();
  const { car, isLoading: loadingCars } = useGetCar();
  const { claims: Gclaims, isLoading: loadingClaims } = useGetAllClaim();
  const { drivers, isLoading: loadingDrivers } = useGetDrivers();
  const { contracts: Gcontracts, isLoading: loadingContracts } = useGetContracts();

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

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box display="grid" columnGap={2} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}>
        <PermissionsContext action={'read.car'}>
          <Grid xs={12} md={4}>
            {loading ? renderChartSkeleton() : (
              <AppWidgetSummary
                title={t('vehicles')}
                percent={2.6}
                total={statistics?.counts?.cars || 0}
                chart={{ series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20] }}
              />
            )}
          </Grid>
        </PermissionsContext>
        <PermissionsContext action={'read.claim'}>
          <Grid xs={12} md={4}>
            {loading ? renderChartSkeleton() : (
              <AppWidgetSummary
                title={t('claims')}
                percent={0.2}
                total={statistics?.counts?.claims || 0}
                chart={{
                  colors: [theme.palette.info.light, theme.palette.info.main],
                  series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
                }}
              />
            )}
          </Grid>
        </PermissionsContext>
        <PermissionsContext action={'read.driver'}>
          <Grid xs={12} md={4}>
            {loading ? renderChartSkeleton() : (
              <AppWidgetSummary
                title={t('drivers')}
                percent={-0.1}
                total={statistics?.counts?.drivers || 0}
                chart={{
                  colors: [theme.palette.warning.light, theme.palette.warning.main],
                  series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
                }}
              />
            )}
          </Grid>
        </PermissionsContext>
      </Box>

      <Box mt={3} display="grid" columnGap={2} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}>
        <PermissionsContext action={'read.car'}>
          <Grid xs={12} md={6} lg={4}>
            {loading ? renderChartSkeleton() : (
              <AppCurrentDownload
                title={t('vehicles')}
                chart={{
                  series: statistics?.cars_by_status?.map(item => ({
                    label: item?.status?.key === 'available' ? t('activated') :
                           item?.status?.key === 'rented' ? t('out_of_service') :
                           item?.status?.key === 'under_maintenance' ? t('under_maintenance') :
                           item?.status?.translations?.[langsNum[currentLang.value]]?.name || 'N/A',
                    value: item?.count || 0
                  })) || []
                }}
              />
            )}
          </Grid>
        </PermissionsContext>

        <PermissionsContext action={'read.claim'}>
          <Grid xs={12} md={6} lg={4}>
            {loading ? renderChartSkeleton() : (
              <LineChart
                title={t('claims')}
                handleThisWeek={() => setClaims(Gclaims?.filter(item => new Date(item?.paiment_date) >= new Date(Date.now() - 7 * 86400000)))}
                handleThisMonth={() => setClaims(Gclaims?.filter(item => new Date(item?.paiment_date) >= new Date(Date.now() - 30 * 86400000)))}
                handleThisYear={() => setClaims(Gclaims?.filter(item => new Date(item?.paiment_date) >= new Date(Date.now() - 365 * 86400000)))}
                chart={{
                  colors: ["#6457AA", "#423524", "#678FFF", "#987324"],
                  series: [
                    { label: t('due_claim'), value: claims?.filter(item => item?.status?.key === 'due_claim').length },
                    { label: t('activated'), value: claims?.filter(item => ['not_yet_claim', 'overdue_claim', 'severely_overdue_claim'].includes(item?.status?.key)).length },
                    { label: t('paid_claim'), value: claims?.filter(item => item?.status?.key === 'paid_claim').length },
                  ],
                }}
                labels={[t('paid_claim'), t('activated'), t('due_claim')]}
                chartss={{
                  series: statistics?.claims_by_status?.map(item => ({
                    label: item?.status?.translations?.[langsNum[currentLang.value]]?.name,
                    value: item?.count || 0
                  })) || []
                }}
              />
            )}
          </Grid>
        </PermissionsContext>

        <PermissionsContext action={'read.driver'}>
          <Grid xs={12} md={6} lg={4}>
            {loading || !drivers?.length ? (
              <EmptyContent filled title={t("no_data")} sx={{ py: 10 }} />
            ) : (
              <AppCurrentDownload
                title={t('drivers')}
                chart={{
                  series: [
                    { label: t('available'), value: statistics?.drivers_by_rental?.not_rented || 0 },
                    { label: t('bussy'), value: statistics?.drivers_by_rental?.rented || 0 },
                  ],
                }}
              />
            )}
          </Grid>
        </PermissionsContext>
      </Box>

      <Box mt={3} display="grid" columnGap={2} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}>
        <PermissionsContext action={'read.contract'}>
          <Grid xs={12} md={4}>
            {loading ? renderChartSkeleton() : (
              <AppWidgetSummary
                title={t('contracts')}
                percent={0.2}
                total={contracts?.length || 0}
                chart={{
                  colors: [theme.palette.info.light, theme.palette.info.main],
                  series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
                }}
              />
            )}
          </Grid>
        </PermissionsContext>
      </Box>

      <Box mt={3} display="grid" columnGap={2} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}>
        <PermissionsContext action={'read.contract'}>
          <Grid xs={12} md={6} lg={4}>
            {loading ? renderChartSkeleton() : (
              <LineChart
                title={t('contracts')}
                handleThisWeek={() => setContracts(Gcontracts?.filter(item => new Date(item?.created_at) >= new Date(Date.now() - 7 * 86400000)))}
                handleThisMonth={() => setContracts(Gcontracts?.filter(item => new Date(item?.created_at) >= new Date(Date.now() - 30 * 86400000)))}
                handleThisYear={() => setContracts(Gcontracts?.filter(item => new Date(item?.created_at) >= new Date(Date.now() - 365 * 86400000)))}
                chart={{
                  series: [
                    { label: t('activated'), value: contracts?.filter(item => new Date(item?.periods?.[0]?.start_date) > new Date()).length },
                    { label: t('finished'), value: contracts?.filter(item => new Date(item?.periods?.[0]?.start_date) <= new Date()).length },
                  ],
                }}
                labels={[t('contracts')]}
                chartss={{
                  series: statistics?.claims_by_status?.map(item => ({
                    label: item?.status?.translations?.[langsNum[currentLang.value]]?.name,
                    value: item?.count || 0
                  })) || []
                }}
              />
            )}
          </Grid>
        </PermissionsContext>
      </Box>
    </Container>
  );
}
