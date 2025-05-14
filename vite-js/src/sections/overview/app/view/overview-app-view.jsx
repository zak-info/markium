import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import AppWidget from '../app-widget';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppNewInvoice from '../app-new-invoice';
import AppTopAuthors from '../app-top-authors';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';
import LineChart from '../line-chart';
import { useTranslation } from 'react-i18next';

import { useGetCompany } from 'src/api/company';
import { useGetCar } from 'src/api/car';
import { useGetAllClaim } from 'src/api/claim';
import { useGetDrivers } from 'src/api/drivers';
import { useValues } from 'src/api/utils';
import { useContext, useEffect, useState } from 'react';
import { TableNoData } from 'src/components/table';
import EmptyContent from 'src/components/empty-content';
import { useGetStatistics } from 'src/api/statistics';
import { useLocales } from 'src/locales';
import PermissionsContext from 'src/auth/context/permissions/permissions-context';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const langsNum = { en: 0, ar: 1 }

export default function OverviewAppView() {
  const { user } = useMockedUser();
  const { t } = useTranslation();

  const theme = useTheme();

  const settings = useSettingsContext();

  const { statistics } = useGetStatistics();
  const { currentLang } = useLocales()
  console.log("currentLang : ", currentLang);
  const { car } = useGetCar();
  const { claims } = useGetAllClaim();
  console.log("statistics : ", statistics);
  console.log("cars_by_status : ", statistics?.cars_by_status?.map(item => ({ lable: item?.status?.key, value: item?.count })));
  const { drivers } = useGetDrivers();
  const { data } = useValues();
  // const {SystemData} = useContext(DataContext);
  // const [data , setData] = useState(SystemData);
  // useEffect(()=>{
  //   setData(SystemData)
  // },[SystemData])



  return (
    <Container rowGa maxWidth={settings.themeStretch ? false : 'xl'}>
      {/* <Grid container spacing={3}> */}

      <Box
        // rowGap={3}
        columnGap={2}
        width={"100%"}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(3, 1fr)',
        }}
      >
        <PermissionsContext action={'read.car'}>
          <Grid xs={12} md={4}>
            <AppWidgetSummary
              title={t('vehicles')}
              percent={2.6}
              total={statistics?.counts?.cars}
              chart={{
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>
        </PermissionsContext>
        <PermissionsContext action={'read.claim'}>
          <Grid xs={12} md={4}>
            <AppWidgetSummary
              title={t('claims')}
              percent={0.2}
              total={statistics?.counts?.claims}
              chart={{
                colors: [theme.palette.info.light, theme.palette.info.main],
                series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
              }}
            />
          </Grid>
          </PermissionsContext>
        <PermissionsContext action={'read.driver'}>
          <Grid xs={12} md={4}>
            <AppWidgetSummary
              title={t('drivers')}
              percent={-0.1}
              total={statistics?.counts?.drivers}
              chart={{
                colors: [theme.palette.warning.light, theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          </Grid>
          </PermissionsContext>
      </Box>
      <Box
        // rowGap={3}
        mt={3}
        columnGap={2}
        width={"100%"}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(3, 1fr)',
        }}
      >
        <PermissionsContext action={'read.car'}>
          <Grid xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title={t('vehicles')}
              // series: [
              //   { label: t("available"), value: car?.filter(item => item?.status?.key == "available").length },
              //   { label: t("under_preparation"), value: car?.filter(item => item?.status?.key == "under_preparation").length },
              //   { label: t("rented"), value: car?.filter(item => item?.status?.key == "rented").length },
              //   { label: t("under_maintenance"), value: car?.filter(item => item?.status?.key == "under_maintenance").length },
              // ],
              chart={{
                series: statistics?.cars_by_status?.map(item => ({
                  label: item?.status?.translations[langsNum[currentLang.value]]?.name,
                  value: item?.count
                })) || []
              }}

            />
          </Grid>
        </PermissionsContext>
        <PermissionsContext action={'read.claim'}>
          <Grid xs={12} md={6} lg={4}>
            <LineChart
              title={t('claims')}
              chart={{
                series: [
                  { label: t('not_yet_claim'), value: claims?.filter(item => item?.status?.key == "not_yet_claim").length },
                  { label: t('due_claim'), value: claims?.filter(item => item?.status?.key == "due_claim").length },
                  { label: t('overdue_claim'), value: claims?.filter(item => item?.status?.key == "overdue_claim").length },
                  { label: t('severely_overdue_claim'), value: claims?.filter(item => item?.status?.key == "severely_overdue_claim").length },
                  { label: t('paid_claim'), value: claims?.filter(item => item?.status?.key == "paid_claim").length },
                ],
              }}
              chartss={{
                series: statistics?.claims_by_status?.map(item => ({
                  label: item?.status?.translations[langsNum[currentLang.value]]?.name,
                  value: item?.count
                })) || []
              }}
            />
          </Grid>
        </PermissionsContext>
        <PermissionsContext action={'read.driver'}>
          <Grid xs={12} md={6} lg={4}>
            {
              drivers?.length > 0 ?
                <AppCurrentDownload
                  title={t('drivers')}
                  chart={{
                    series: [
                      { label: t('not_rented'), value: statistics?.drivers_by_rental?.not_rented },
                      { label: t('rented'), value: statistics?.drivers_by_rental?.rented },
                    ],
                  }}

                  chartssss={{
                    series: [
                      { lable: t("rented"), value: statistics?.drivers_by_rental?.rented },
                      { lable: t("not_rented"), value: statistics?.drivers_by_rental?.not_rented }
                    ]
                  }}
                />
                :
                <>

                  {/* <TableNoData notFound={true} /> */}
                  <EmptyContent
                    filled
                    title={t("no_data")}
                    sx={{
                      py: 10,
                    }}
                  />
                </>
            }
          </Grid>
        </PermissionsContext>
      </Box>

      {/* </Grid> */}
    </Container>
  );
}
