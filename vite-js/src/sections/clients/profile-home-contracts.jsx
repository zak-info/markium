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
import { useGetClaim } from 'src/api/claim';
import { Tab, Tabs } from '@mui/material';
import ContractClaimsListView from './ContractClaimsTable/NotificationsListView';

// ----------------------------------------------------------------------

export default function ProfileHome({ info, posts, contract, client, location }) {
  const fileRef = useRef(null);

  const { claims } = useGetClaim(contract?.id);
  const [tableData, setTableData] = useState(claims?.filter(item => item.contract_id == contract?.id))
  useEffect(() => {
    setTableData(claims?.filter(item => item.contract_id == contract?.id))
    console.log("claims  sss",claims?.filter(item => item.contract_id == contract?.id));
  }, [claims])

  const { t } = useTranslation();

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };
  const [section, setSection] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSection(newValue);
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
                {contract?.net}.00
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
              {t(`clauses_number`)+"  "}
              <Link variant="subtitle2" color="inherit">
                {contract?.clauses?.length}
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
          <Tab icon={<Iconify icon="lets-icons:file-dock-search-fill" />} iconPosition="start" label={t("claims")} />
          <Tab icon={<Iconify icon="lets-icons:alarm-fill" />} iconPosition="start" label={t("claims_logs")} />
          {/* <Tab icon={<Iconify icon="lets-icons:alarm-fill" />} iconPosition="start" label="logs" />
          <Tab icon={<Iconify icon="lets-icons:refresh" />} iconPosition="start" label="periodic maintenances" />
          <Tab icon={<Iconify icon="solar:dollar-line-duotone" />} iconPosition="start" label="cost & inputs" /> */}
        </Tabs>
      </Card>

      {
        section === 0 ?

          <Grid xs={12} md={12}>
            {/* <AppNewInvoice
          title={t('contractItems')}
          tableData={contract?.clauses}
          tableLabels={[
            { id: 'clausable', label: 'Clausable' },
            { id: 'cost', label: 'Cost' },
            { id: 'duration', label: 'Duration' },
            { id: 'total', label: 'Total' },
            { id: '' },
          ]}
        /> */}
            {contract?.clauses ? <ContractClaimsListView claims={contract?.clauses} /> : null}
          </Grid>
          : section === 1 ?
            <Grid xs={12} md={12}>
              <ClaimNewEditForm setTableData={setTableData} contract_id={contract?.id} />
              <AppNewInvoice2

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
              />
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
