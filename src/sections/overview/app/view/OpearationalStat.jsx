import { useEffect, useState } from 'react';
import { Box, Container, IconButton, MenuItem, Skeleton, Stack, Typography } from '@mui/material';
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
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import ClaimsStat from './ClaimsStat';
import AnalyticsConversionRates from '../../analytics/analytics-conversion-rates';
import { useGetMaintenance } from 'src/api/maintainance';

import { color } from '@mui/system';
import EcommerceSalesOverview from '../../e-commerce/fin-ecommerce-sales-overview';
import BankingWidgetSummary from '../../banking/fin-banking-widget-summary';

import { _bankingCreditCard } from 'src/_mock';
import BankingCurrentBalance from '../../banking/fin-banking-current-balance';
import BankingBalanceStatistics from '../../banking/fin-banking-balance-statistics';

const langsNum = { en: 0, ar: 1 };

export default function OpearationalStat() {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useSettingsContext();
  const { currentLang } = useLocales();

  const { statistics, isLoading: loadingStatistics } = useGetStatistics();
  const { car, carLoading: loadingCars } = useGetCar();
  const { claims: Gclaims, claimsLoading: loadingClaims } = useGetAllClaim();
  const { drivers, driversLoading: loadingDrivers } = useGetDrivers();
  const { contracts: Gcontracts, contractsLoading: loadingContracts } = useGetContracts();
  const { maintenance, maintenanceLoading } = useGetMaintenance()
  console.log("Gcontracts L :", Gcontracts)

  const [claims, setClaims] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [contracts, setContracts] = useState([]);


  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const months = monthNames.map(name => ({ x: name, y: 0 }));



  useEffect(() => {
    if (Gclaims) setClaims(Gclaims);
  }, [Gclaims]);

  useEffect(() => {
    if (Gcontracts) setContracts(Gcontracts);

    contracts?.forEach(contract => {
      if (contract?.created_at) {
        const date = new Date(contract.created_at);
        const month = date.getMonth(); // 0–11
        months[month].y += 1;
      }
    });
    console.log("months : ", months)

  }, [Gcontracts]);

  useEffect(() => {
    if (maintenance) setMaintenances(maintenance);
  }, [maintenance]);

  const loading = loadingStatistics || loadingCars || loadingClaims || loadingDrivers || loadingContracts;

  const renderChartSkeleton = () => <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />;

  const popover = usePopover();

  const handleThisWeek = () => {
    setClaims(Gclaims?.filter(item => new Date(item?.paiment_date) >= new Date(Date.now() - 7 * 86400000)));
    setContracts(Gcontracts?.filter(item => new Date(item?.created_at) >= new Date(Date.now() - 7 * 86400000)))
  }

  const handleThisMonth = () => {
    setClaims(Gclaims?.filter(item => new Date(item?.paiment_date) >= new Date(Date.now() - 30 * 86400000)));
    setContracts(Gcontracts?.filter(item => new Date(item?.created_at) >= new Date(Date.now() - 30 * 86400000)))
  }

  const handleThisYear = () => {
    setClaims(Gclaims?.filter(item => new Date(item?.paiment_date) >= new Date(Date.now() - 365 * 86400000)));
    setContracts(Gcontracts?.filter(item => new Date(item?.created_at) >= new Date(Date.now() - 365 * 86400000)))
  }


  function countContractsByMonth(contracts, key) {
    const counts = Array(12).fill(0); // 12 months initialized with 0

    contracts?.forEach(contract => {
      if (contract[key]) {
        const date = new Date(contract[key]);
        const month = date.getMonth(); // 0–11
        counts[month] += 1;
      }
    });

    return counts;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" justifyContent="flex-end">
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
          <Typography variant="body2" color="text.secondary">
            {t("filter")}
          </Typography>
        </IconButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        <MenuItem
          onClick={() => {
            handleThisWeek(),
              popover.onClose();
          }}
        >
          {t('this_week')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleThisMonth(),
              popover.onClose();
          }}
        >
          {t('this_month')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleThisYear(),
              popover.onClose();
          }}
        >
          {t('this_year')}
        </MenuItem>
      </CustomPopover>
      <Box mt={3} display="grid" rowGap={2} columnGap={2} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}>
        <BankingWidgetSummary
          title={t("total_gain")}
          icon="solar:bookmark-bold"
          total={
            claims && claims.length > 0
              ? ((claims.filter(item => item?.status?.key === "paid_claim").length / claims.length) * 100).toFixed(2) + " %"
              : "0 %"
          }
          chart={{
            series: claims?.filter(item => item?.status?.key === "paid_claim")?.map(claim => ({
              x: new Date(claim?.paiment_date)?.getFullYear(),
              y: claim?.net ?? 0,
            })) ?? [],
          }}
        />

        <BankingWidgetSummary
          title={t("auto_renew_contracts")}
          color='secondary'
          icon="solar:document-text-bold-duotone"
          total={contracts?.filter(i => i.auto_renewal == 1)?.length || 0}
          chart={{
            series: months
          }}
        />
        <Grid xs={12} md={5} >
          <BankingCurrentBalance list={[
            {
              id: 1,
              title: t("total_claims_amount"),
              balance: (claims?.filter(item => item?.status?.key == "paid_claim")?.reduce((acc, obj) => acc + obj.net, 0) + " " + t("rsa") || 0),
              // cardType: 'mastercard',
              cardHolder: "zaki zaki",
              cardNumber: '**** **** **** 3640',
              cardValid: '11/22',
            },
            {
              id: 1,
              title: t("total_contracts"),
              balance: (contracts?.reduce((acc, obj) => acc + obj.total_cost, 0) || 0) + " " + t("rsa"),
              // cardType: 'mastercard',
              cardHolder: "zaki zaki",
              cardNumber: '**** **** **** 3640',
              cardValid: '11/22',
            },
          ]} />
        </Grid>

      </Box>
      <Box mt={3} display="grid" rowGap={2} columnGap={2} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}>
        <PermissionsContext action={'read.claim'}>
          <Grid xs={12} md={6} lg={4}>
            {loadingClaims ? renderChartSkeleton() : (
              <>
                <LineChart
                  title={t('claims')}
                  handleThisWeek={() => setClaims(Gclaims?.filter(item => new Date(item?.paiment_date) >= new Date(Date.now() - 7 * 86400000)))}
                  handleThisMonth={() => setClaims(Gclaims?.filter(item => new Date(item?.paiment_date) >= new Date(Date.now() - 30 * 86400000)))}
                  handleThisYear={() => setClaims(Gclaims?.filter(item => new Date(item?.paiment_date) >= new Date(Date.now() - 365 * 86400000)))}
                  chart={{
                    colors: ["#FF5630", "#C684FF", "#00A76F", "#987324"],
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

              </>
            )}
          </Grid>
        </PermissionsContext>
        <PermissionsContext action={'read.contract'}>
          <Grid xs={12} md={6} lg={4}>
            {loadingContracts ? renderChartSkeleton() : (
              <LineChart
                title={t('contracts')}
                handleThisWeek={() => setContracts(Gcontracts?.filter(item => new Date(item?.created_at) >= new Date(Date.now() - 7 * 86400000)))}
                handleThisMonth={() => setContracts(Gcontracts?.filter(item => new Date(item?.created_at) >= new Date(Date.now() - 30 * 86400000)))}
                handleThisYear={() => setContracts(Gcontracts?.filter(item => new Date(item?.created_at) >= new Date(Date.now() - 365 * 86400000)))}
                chart={{
                  colors: ["#FF5630", "#00A76F", "#00A76F", "#987324"],
                  series: [
                    { label: t('activated'), value: contracts?.filter(item => new Date(item?.periods?.[0]?.end_date) > new Date()).length },
                    { label: t('finished'), value: contracts?.filter(item => new Date(item?.periods?.[0]?.end_date) <= new Date()).length },
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
        <PermissionsContext action={'read.maintenance'}>
          <Grid xs={12} md={6} lg={4}>
            {maintenanceLoading ? renderChartSkeleton() : (
              <LineChart
                title={t('maintenances')}
                handleThisWeek={() => setMaintenances(maintenance?.filter(item => new Date(item?.created_at) >= new Date(Date.now() - 7 * 86400000)))}
                handleThisMonth={() => setMaintenances(maintenance?.filter(item => new Date(item?.created_at) >= new Date(Date.now() - 30 * 86400000)))}
                handleThisYear={() => setMaintenances(maintenance?.filter(item => new Date(item?.created_at) >= new Date(Date.now() - 365 * 86400000)))}
                chart={{
                  colors: ["#00A76F", "#FF5630", "#678FFF", "#987324"],
                  series: [
                    { label: t('completed'), value: maintenances?.filter(item => item?.status?.key == "completed").length },
                    { label: t('pending'), value: maintenances?.filter(item => item?.status?.key == "pending").length },
                  ],
                }}
                labels={[t('maintenances')]}
              />
            )}
          </Grid>
        </PermissionsContext>
      </Box>
      {/*  */}
      <Grid xs={12} md={12} lg={16} mt={4}>
        <BankingBalanceStatistics
          title={t("time_rev")}
          // subheader="(+43% Income | +12% Expense) than last year"
          // 8e33ff
          chart={{
            categories: [t('jan'),t('feb'),t('mar') ,t('apr'),t('may') ,t('jun'),t('jul') ,t('aug') ,t('sep') ],
            series: [
              {
                type: 'Year',
                data: [
                  {
                    name: t("contracts"),
                    data: countContractsByMonth(contracts, "created_at"),
                  },
                  {
                    name: t('paid_claims'),
                    data: countContractsByMonth(claims?.filter(i => i?.status?.key == "paid_claim"), "paiment_date"),
                  },
                  {
                    name: t('maintenances'),
                    data: countContractsByMonth(maintenances, "created_at"),
                  },
                ],
              },
            ],
          }}
        />
      </Grid>
      <Box mt={3} display="grid" columnGap={2} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
        <PermissionsContext action={'read.claim'}>
          <Grid xs={12} md={12} lg={16}>
            <EcommerceSalesOverview title={t("ada_kpi")} data={
              [
                { label: t("claims"), totalAmount: claims?.length, value: 200, color: "primary" },
                { label: t("contracts"), totalAmount: contracts?.length, value: 200, color: "secondary" },
                { label: t("maintenances"), totalAmount: maintenance?.length, value: 200, color: "warning" },
              ]
            } />
          </Grid>
        </PermissionsContext>
      </Box>
    </Container>
  );
}
