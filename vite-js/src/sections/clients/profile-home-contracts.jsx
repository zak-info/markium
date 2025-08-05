import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import AppNewInvoice from './app-new-invoice';

import { fNumber } from 'src/utils/format-number';

import { _socials } from 'src/_mock';

import Iconify from 'src/components/iconify';

import ProfilePostItem from './profile-post-item';
import { _appInvoices } from 'src/_mock';
import { useTranslation } from 'react-i18next';
import { fDate } from 'src/utils/format-time';
import AppNewInvoice2 from './app-new-invoice2';
import ClaimNewEditForm from './claim-new-edit-form';
import { useGetClaim, useGetClauses } from 'src/api/claim';
import { Tab, Tabs } from '@mui/material';

import ContractClausesListView from './ContractClauses/ContractClausesListView';
import { useGetCar } from 'src/api/car';
import { useGetDrivers } from 'src/api/drivers';
import { secondary } from 'src/theme/palette';
import ContractClaimsListView from './ContractClaimsTable/ContractClaimsListView';

// ----------------------------------------------------------------------

export default function ProfileHome({ info, posts, contract, client, location }) {
  const fileRef = useRef(null);
  const { t } = useTranslation();
  const { claims } = useGetClaim(contract?.id);
  const { car } = useGetCar()
  const { drivers } = useGetDrivers()
  const { clauses } = useGetClauses(contract?.id);

  console.log("clauses : ", clauses);

  const formulateClaims = (list) => {
    return list.map(item => ({
      ...item,
      payment_date: fDate(new Date(item?.paiment_date)),
      date: fDate(new Date(item?.created_at)),
      gstatus: item?.status?.translations[0]?.name,
    }))
  }

  const [tableData, setTableData] = useState(formulateClaims(claims))
  useEffect(() => {
    setTableData(formulateClaims(claims))
  }, [claims])

  const formulateClauses = (list) => {
    // Step 1: Mark items with `replacer: true`
    // list?.forEach(item => {
    //   if (item?.replaced_by_clause_id) {
    //     const target = list?.find(targetItem => targetItem.id === item.replaced_by_clause_id);
    //     if (target) {
    //       target.replacer = true;
    //     }
    //   }
    // });

    // Step 2: Transform and return the updated list
    return list?.map(item => ({
      ...item,
      clausable: item?.replaced_by_clause_id ?
        {
          first: item?.clauseable_type === "car"
            ? car?.find(i => i.id === item?.clauseable_id)?.model?.translations?.name
            : drivers?.find(i => i.id === item?.clauseable_id)?.name,
          second: item?.clauseable_type === "car"
            ? car?.find(i => i.id === item?.clauseable_id)?.plat_number
            : drivers?.find(i => i.id === item?.clauseable_id)?.phone_number
        }
        :
        {
          first: item?.clauseable_type === "car"
            ? car?.find(i => i.id === item?.clauseable_id)?.model?.translations?.name
            : drivers?.find(i => i.id === item?.clauseable_id)?.name,
          second: item?.clauseable_type === "car"
            ? car?.find(i => i.id === item?.clauseable_id)?.plat_number
            : drivers?.find(i => i.id === item?.clauseable_id)?.phone_number
        },
      start_date: fDate(item?.start_date),
      end_date: fDate(item?.end_date),
      color: "success"
    }))
    // .filter(item => !item?.replaced_by_clause_id);
  };

  const [clausesTableData, setClausesTableData] = useState(formulateClauses(clauses))
  // const [clausesTableData, setClausesTableData] = useState(clauses)
  useEffect(() => {
    setClausesTableData(formulateClauses(clauses))
  }, [clauses])





  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };
  const [section, setSection] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSection(newValue);
  };

  const [periods, setPeriods] = useState(0);
  const [period, setPeriod] = useState(periods == 0 ? contract?.period : contract?.periods[periods]);

  useEffect(() => {
    setPeriod(periods == 0 ? contract?.period : contract?.periods[periods])
  }, [periods])

  const handlePeriodTabChange = (event, newValue) => {
    setPeriods(newValue);
  };

  const renderAbout = (
    <Grid xs={12} md={12}>
      <Card>
        <CardHeader title={t('contract_details')} />

        <Stack spacing={2} sx={{ p: 3 }}>
          {/* <Box sx={{ typography: 'body2' }}>{info.quote}</Box> */}

          <Stack direction="row" spacing={2}>
            <Iconify icon="mingcute:coin-fill" width={24} />

            <Box sx={{ typography: 'body2' }}>
              {t(`net`) + "  "}
              <Link variant="subtitle2" color="inherit">
                {contract?.total_cost}.00
              </Link>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Iconify icon="mingcute:coin-fill" width={24} />

            <Box sx={{ typography: 'body2' }}>
              {t(`paid`) + "  "}
              <Link variant="subtitle2" color="inherit">
                {contract?.paid_amount}.00
              </Link>
            </Box>
          </Stack>
          {/* <Stack direction="row" spacing={2}>
            <Iconify icon="mingcute:coin-fill" width={24} />

            <Box sx={{ typography: 'body2' }}>
              {t(`unclaimed`) + "  "}
              <Link variant="subtitle2" color="inherit">
                {contract?.remaining_unclaimed_amount}.00
              </Link>
            </Box>
          </Stack> */}

          {/* <Stack direction="row" sx={{ typography: 'body2' }}>
            <Iconify icon="heroicons-solid:calendar" width={24} sx={{ mr: 2 }} />
            <Box sx={{ typography: 'body2' }}>
              {t(`date`) + "  "}
              <Link variant="subtitle2" color="inherit">
                {fDate(contract?.created_at)}
              </Link>
            </Box>
          </Stack> */}
          <Stack direction="row" sx={{ typography: 'body2' }}>
            <Iconify icon="heroicons-solid:calendar" width={24} sx={{ mr: 2 }} />
            <Box sx={{ typography: 'body2' }}>
              {t(`start_date`) + "  "}
              <Link variant="subtitle2" color="inherit">
                {fDate(contract?.period?.start_date)}
              </Link>
            </Box>
          </Stack>
          <Stack direction="row" sx={{ typography: 'body2' }}>
            <Iconify icon="heroicons-solid:calendar" width={24} sx={{ mr: 2 }} />
            <Box sx={{ typography: 'body2' }}>
              {t(`end_date`) + "  "}
              <Link variant="subtitle2" color="inherit">
                {fDate(contract?.period?.end_date)}
              </Link>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Iconify icon="ic:round-business-center" width={24} />

            <Box sx={{ typography: 'body2' }}>
              {t(`clauses_number`) + "  "}
              <Link variant="subtitle2" color="inherit">
                {clauses?.length}
              </Link>
            </Box>
          </Stack>
        </Stack>
      </Card>
    </Grid>
  );

  const renderAbout2 = (
    <Grid xs={12} md={12}>
      <Card sx={{ width: '100%' }}>
        <CardHeader title={t('client')} />

        <Stack spacing={2} sx={{ p: 3 }}>
          {/* <Box sx={{ typography: 'body2' }}>{info.quote}</Box> */}

          <Stack direction="row" spacing={2}>
            <Iconify icon="solar:user-bold-duotone" width={24} />

            <Box sx={{ typography: 'body2' }}>
              <Link variant="subtitle2" color="inherit">
                {client?.name}
              </Link>
            </Box>
          </Stack>

          <Stack direction="row" sx={{ typography: 'body2' }}>
            <Iconify icon="solar:devices-bold-duotone" width={24} sx={{ mr: 2 }} />
            {client?.phone_number || t("no_phone_number_found")}
          </Stack>

          <Stack direction="row" spacing={2}>
            <Iconify icon="solar:map-point-wave-bold-duotone" width={24} />

            <Box sx={{ typography: 'body2' }}>
              <Link variant="subtitle2" color="inherit">
                {location?.translations[0]?.name}
              </Link>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            {/* <Iconify icon="solar:map-point-wave-bold-duotone" width={24} /> */}
            --

            <Box sx={{ typography: 'body2' }}>
              <Link variant="subtitle2" color="inherit">
                {/* {location?.translations[0]?.name} */}
                --
              </Link>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            {/* <Iconify icon="solar:map-point-wave-bold-duotone" width={24} /> */}
            --

            <Box sx={{ typography: 'body2' }}>
              <Link variant="subtitle2" color="inherit">
                {/* {location?.translations[0]?.name} */}
                --
              </Link>
            </Box>
          </Stack>

        </Stack>
      </Card>
    </Grid>
  );


  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={12}>
        {/* <Stack spacing={3} flexDirection="row"> */}
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          {renderAbout}

          {renderAbout2}
        </Box>
        {/* </Stack> */}

      </Grid>
      <Card sx={{ m: 2, px: 2, pt: 2, pb: 1 }}>
        <Tabs
          value={section}
          onChange={handleTabChange}
          aria-label="icon position tabs example"
          textColor="primary"
        >
          <Tab icon={<Iconify icon="duo-icons:settings" />} iconPosition="start" label={t("contract_clauses")} />
          {/* <Tab icon={<Iconify icon="duo-icons:bell" />} iconPosition="start" label={t("periods")} /> */}
          <Tab icon={<Iconify icon="lets-icons:file-dock-search-fill" />} iconPosition="start" label={t("claims")} />
          <Tab icon={<Iconify icon="lets-icons:alarm-fill" />} iconPosition="start" label={t("claims_logs")} />
        </Tabs>
      </Card>

      {
        section === 100 ?
          <>
            <Grid xs={12} md={8}>
              <Card sx={{ m: 2, px: 2, pt: 2, pb: 1 }}>
                <Tabs
                  value={periods}
                  onChange={handlePeriodTabChange}
                  aria-label="icon position tabs example"
                  textColor="primary"
                >
                  <Tab icon={<Iconify icon="duo-icons:bell" />} iconPosition="start" label={t("current_period")} />
                  {
                    contract?.periods?.map((item, index) => (
                      <Tab icon={<Iconify icon="duo-icons:bell" />} iconPosition="start" label={t("period") + ` ${index + 2}`} />
                    ))
                  }
                </Tabs>
              </Card>
            </Grid>
            <Grid xs={12} md={12}>
              <Card>
                <CardHeader title={t('period_details')} />

                <Stack spacing={2} sx={{ p: 3 }}>
                  {/* <Box sx={{ typography: 'body2' }}>{info.quote}</Box> */}

                  <Stack direction="row" spacing={2}>
                    <Iconify icon="mingcute:coin-fill" width={24} />
                    <Box sx={{ typography: 'body2' }}>
                      {t(`net`) + "  "}
                      <Link variant="subtitle2" color="inherit">
                        {contract?.total_cost}.00
                      </Link>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Iconify icon="mingcute:coin-fill" width={24} />

                    <Box sx={{ typography: 'body2' }}>
                      {t(`paid`) + "  "}
                      <Link variant="subtitle2" color="inherit">
                        {contract?.paid_amount}.00
                      </Link>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Iconify icon="mingcute:coin-fill" width={24} />

                    <Box sx={{ typography: 'body2' }}>
                      {t(`unclaimed`) + "  "}
                      <Link variant="subtitle2" color="inherit">
                        {contract?.remaining_unclaimed_amount}.00
                      </Link>
                    </Box>
                  </Stack>

                  <Stack direction="row" sx={{ typography: 'body2' }}>
                    <Iconify icon="heroicons-solid:calendar" width={24} sx={{ mr: 2 }} />
                    <Box sx={{ typography: 'body2' }}>
                      {t(`date`) + "  "}
                      <Link variant="subtitle2" color="inherit">
                        {fDate(contract?.created_at)}
                      </Link>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Iconify icon="ic:round-business-center" width={24} />

                    <Box sx={{ typography: 'body2' }}>
                      {t(`clauses_number`) + "  "}
                      <Link variant="subtitle2" color="inherit">
                        {clauses?.length}
                      </Link>
                    </Box>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </>
          :
          section === 0 ?
            <Grid xs={12} md={12}>
              <ContractClausesListView contract={contract} data={clausesTableData} />
            </Grid>
            : section === 1 ?
              <Grid display={"flex"} flexDirection={"column"} rowGap={4} xs={12} md={12}>
                <ClaimNewEditForm setTableData={setTableData} contract={contract} contract_id={contract?.id} />
                {/* <AppNewInvoice2
                  tableData={tableData}
                  setTableData={setTableData}
                  sx={{ mt: "10px" }}
                  title={t('claims')}
                  contract_id={contract?.id}
                  tableLabels={[
                    { id: 'Amount', label: t('amount') },
                    { id: 'Create_at', label: t('date') },
                    { id: 'Payment', label: t('payment_at') },
                    { id: 'status', label: t('status') },
                    { id: '' },
                  ]}
                /> */}
                <ContractClaimsListView data={tableData} with_contracts={false} contract_id={contract?.id} />
              </Grid>
              : null
      }

      {/* </Box> */}
    </Grid>
  );
}

ProfileHome.propTypes = {
  info: PropTypes.object,
  posts: PropTypes.array,
};
