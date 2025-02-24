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
import { useEffect } from 'react';
import { TableNoData } from 'src/components/table';
import EmptyContent from 'src/components/empty-content';
// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useMockedUser();
  const { t } = useTranslation();

  const theme = useTheme();

  const settings = useSettingsContext();
  const { car } = useGetCar();
  const { claims } = useGetAllClaim();
  const { drivers } = useGetDrivers();
  const { data } = useValues();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        {/* <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={<SeoIllustration />}
            action={
              <Button variant="contained" color="primary">
                Go Now
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid> */}

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title={t('vehicles')}
            percent={2.6}
            total={car?.length}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title={t('claims')}
            percent={0.2}
            total={claims?.length}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title={t('drivers')}
            percent={-0.1}
            total={drivers?.length > 0 ? drivers?.length : "0"}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title={t('vehicles')}
            chart={{
              series: [
                { label: t("available"), value: car?.filter(item => item?.status?.key == "available").length },
                { label: t("under_preparation"), value: car?.filter(item => item?.status?.key == "under_preparation").length },
                { label: t("rented"), value: car?.filter(item => item?.status?.key == "rented").length },
                { label: t("under_maintenance"), value: car?.filter(item => item?.status?.key == "under_maintenance").length },
              ],
            }}
          />
        </Grid>

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
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          {
            drivers?.length > 0 ?
              <AppCurrentDownload
                title={t('drivers')}
                chart={{
                  series: [
                    { label: t('drivers'), value: drivers?.length },
                    // { label: 'Window', value: 53345 },
                    // { label: 'iOS', value: 44313 },
                    // { label: 'Android', value: 78343 },
                  ],
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

        {/* <Grid xs={12} lg={8}>
          <AppNewInvoice
            title={t('allNoti')}
            tableData={_appInvoices}
            tableLabels={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title={t('log')} list={_appAuthors} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top Authors" list={_appAuthors} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <Stack spacing={3}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{
                series: 48,
              }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              color="info"
              chart={{
                series: 75,
              }}
            />
          </Stack>
        </Grid> */}
      </Grid>
    </Container>
  );
}
