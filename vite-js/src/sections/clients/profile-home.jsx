import { useRef, useState } from 'react';
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
import { useValues } from 'src/api/utils';
import { Tab, Tabs } from '@mui/material';
import ClientContractsListView from './ClientContracts/NotificationsListView';
import ClientRepresentorsListView from './ClientRepresentors/NotificationsListView';
import { useGetContracts } from 'src/api/contract';
import ClientClaimsListView from './ClientClaims/NotificationsListView';
import { useGetAllClaim, useGetClaim } from 'src/api/claim';

// ----------------------------------------------------------------------

export default function ProfileHome({ info, posts }) {
  const fileRef = useRef(null);

  const { t } = useTranslation();




  const [section, setSection] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSection(newValue);
  };

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const renderFollows = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack width={1}>
          {fNumber(info?.totalFollowers)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Follower
          </Box>
        </Stack>

        <Stack width={1}>
          {fNumber(info?.totalFollowing)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Following
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
  const { data } = useValues()
  const { contracts } = useGetContracts()
  const { claims,claimsLoading } = useGetAllClaim()
  const selected_contracts = contracts?.filter(item => item?.client_id == info?.id)
  const selected_claims = claims.filter(item => selected_contracts.some(entry => entry.id == item?.contract_id));



  const renderAbout = (
    <Card>
      <CardHeader title={t('client')} />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body2' }}>{data?.neighborhoods?.find(item => item?.id == info?.neighborhood?.id)?.translations[0]?.name}</Box>

        <Stack direction="row" spacing={2}>
          <Iconify icon="duo-icons:user" width={24} />
          <Box sx={{ typography: 'body2' }}>
            {/* {t(`live_at`)} */}
            <Link variant="subtitle2" color="inherit">
              {info?.name}
            </Link>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />
          <Box sx={{ typography: 'body2' }}>
            {/* {t(`live_at`)} */}
            <Link variant="subtitle2" color="inherit">
              {data?.neighborhoods?.find(item => item?.id == info?.neighborhood_id)?.translations[0]?.name}
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {t(`tax_number`) + "  "}
            <br />
            <Link variant="subtitle2" color="inherit">
              {info?.tax_number}
            </Link>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {t(`c_r_n`) + "  "}
            <br />
            <Link variant="subtitle2" color="inherit">
              {info?.commercial_registration_number}
            </Link>
          </Box>
        </Stack>


      </Stack>
    </Card>
  );
  const renderAbout2 = (
    <Card>
      <CardHeader title={t('info')} />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body2' }}>{info?.quote}</Box>


        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />
          <Box sx={{ typography: 'body2' }}>
            {t("representors") + "  "}
            <Link variant="subtitle2" color="inherit">
              {info?.representors?.length}
            </Link>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {t("contracts") + "  "}
            <Link variant="subtitle2" color="inherit">
              {info?.contracts?.length ? info?.contracts?.length : 0}
            </Link>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:coin-fill" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {t("total_claims") + "  "}
            <Link variant="subtitle2" color="inherit">
              {info?.contracts?.length || 0}
            </Link>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:coin-fill" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {t("unpaied_claims") + "  "}
            <Link variant="subtitle2" color="inherit">
              {info?.contracts?.length || 0}
            </Link>
          </Box>
        </Stack>


      </Stack>
    </Card>
  );



  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          {renderAbout}
        </Stack>
      </Grid>

      <Grid xs={12} md={8}>
        <Stack spacing={3}>
          {renderAbout2}
        </Stack>
      </Grid>
      <Grid xs={12} md={16}>
        <Card sx={{ p: 1 }}>
          <Tabs
            value={section}
            onChange={handleTabChange}
            aria-label="icon position tabs example"
            textColor="primary"
          >
            <Tab icon={<Iconify icon="duo-icons:settings" />} iconPosition="start" label={t("representors")} />
            <Tab icon={<Iconify icon="lets-icons:file-dock-search-fill" />} iconPosition="start" label={t("contracts")} />
            <Tab icon={<Iconify icon="solar:dollar-line-duotone" />} iconPosition="start" label={t("claims")} />
            {/* <Tab icon={<Iconify icon="lets-icons:alarm-fill" />} iconPosition="start" label={t("alerts")} /> */}
            {/* <Tab icon={<Iconify icon="lets-icons:refresh" />} iconPosition="start" label={t("periodic_maintenances")} /> */}
          </Tabs>
        </Card>
        <Box
          rowGap={3}
          columnGap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
          }}
        >
          {
            section == 0 ?
              <Grid xs={12} md={12}>
                <ClientRepresentorsListView id={info?.id} representors={info?.representors} />
              </Grid>
              : section == 1 ?
                <ClientContractsListView id={info?.id} contracts={selected_contracts} />

                : section == 2 ?
                  <ClientClaimsListView claimsLoading={claimsLoading} id={info?.id} claims={selected_claims} />

                  :
                  null
          }

        </Box>
      </Grid>
    </Grid>
  );
}

ProfileHome.propTypes = {
  info: PropTypes.object,
  posts: PropTypes.array,
};
