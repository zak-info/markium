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

// ----------------------------------------------------------------------

export default function ProfileHome({ info, posts, contract, client, location }) {
  const fileRef = useRef(null);

  const { claims } = useGetClaim(contract?.id);
  const [tableData, setTableData] = useState(claims?.filter(item => item.contract_id == contract?.id))
  useEffect(() => {
    setTableData(claims?.filter(item => item.contract_id == contract?.id))
  }, [claims])

  const { t } = useTranslation();

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
          {fNumber(info.totalFollowers)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Follower
          </Box>
        </Stack>

        <Stack width={1}>
          {fNumber(info.totalFollowing)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Following
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderAbout = (
    <Grid xs={12} md={12}>
      <Card>
        <CardHeader title={t('contract details')} />

        <Stack spacing={2} sx={{ p: 3 }}>
          {/* <Box sx={{ typography: 'body2' }}>{info.quote}</Box> */}

          <Stack direction="row" spacing={2}>
            <Iconify icon="mingcute:coin-fill" width={24} />

            <Box sx={{ typography: 'body2' }}>
              {`net `}
              <Link variant="subtitle2" color="inherit">
                {contract?.net} RS
              </Link>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Iconify icon="mingcute:coin-fill" width={24} />

            <Box sx={{ typography: 'body2' }}>
              {`paid `}
              <Link variant="subtitle2" color="inherit">
                {contract?.paid_amount} RS
              </Link>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Iconify icon="mingcute:coin-fill" width={24} />

            <Box sx={{ typography: 'body2' }}>
              {`unclaimed `}
              <Link variant="subtitle2" color="inherit">
                {contract?.remaining_unclaimed_amount} RS
              </Link>
            </Box>
          </Stack>

          <Stack direction="row" sx={{ typography: 'body2' }}>
            <Iconify icon="heroicons-solid:calendar" width={24} sx={{ mr: 2 }} />
            {fDate(contract?.created_at)}
          </Stack>

          <Stack direction="row" spacing={2}>
            <Iconify icon="ic:round-business-center" width={24} />

            <Box sx={{ typography: 'body2' }}>
              {/* {` `} */}
              <Link variant="subtitle2" color="inherit">
                {contract?.clauses?.length} clause{contract?.clauses?.length > 1 ? "s" : null}
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
            {client?.phone_number || "no phone number found"}
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

  const renderPostInput = (
    <Card sx={{ p: 3 }}>
      <InputBase
        multiline
        fullWidth
        rows={4}
        placeholder="Share what you are thinking here..."
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 1,
          border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
        }}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
          <Fab size="small" color="inherit" variant="softExtended" onClick={handleAttach}>
            <Iconify icon="solar:gallery-wide-bold" width={24} sx={{ color: 'success.main' }} />
            Image/Video
          </Fab>

          <Fab size="small" color="inherit" variant="softExtended">
            <Iconify icon="solar:videocamera-record-bold" width={24} sx={{ color: 'error.main' }} />
            Streaming
          </Fab>
        </Stack>

        <Button variant="contained">Post</Button>
      </Stack>

      <input ref={fileRef} type="file" style={{ display: 'none' }} />
    </Card>
  );

  const renderSocials = (
    <Card>
      <CardHeader title="Social" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {_socials.map((link) => (
          <Stack
            key={link.name}
            spacing={2}
            direction="row"
            sx={{ wordBreak: 'break-all', typography: 'body2' }}
          >
            <Iconify
              icon={link.icon}
              width={24}
              sx={{
                flexShrink: 0,
                color: link.color,
              }}
            />
            <Link color="inherit">
              {link.value === 'facebook' && info.socialLinks.facebook}
              {link.value === 'instagram' && info.socialLinks.instagram}
              {link.value === 'linkedin' && info.socialLinks.linkedin}
              {link.value === 'twitter' && info.socialLinks.twitter}
            </Link>
          </Stack>
        ))}
      </Stack>
    </Card>
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
      {/* <Box
        rowGap={4}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      > */}

      <Grid xs={12} md={6}>
        <AppNewInvoice
          title={t('contractItems')}
          tableData={contract?.clauses}
          tableLabels={[
            { id: 'clausable', label: 'Clausable' },
            { id: 'cost', label: 'Cost' },
            { id: 'duration', label: 'Duration' },
            { id: 'total', label: 'Total' },
            { id: '' },
          ]}
        />
      </Grid>

      <Grid xs={12} md={6}>
        <ClaimNewEditForm setTableData={setTableData} contract_id={contract?.id} />
        <AppNewInvoice2

          tableData={tableData}
          sx={{ mt: "10px" }}
          title={t('claims')}
          contract_id={contract?.id}
          tableLabels={[
            { id: 'Amount', label: 'Amount' },
            { id: 'Create_at', label: 'Create At' },
            { id: 'Payment', label: 'Payment At' },
            { id: 'status', label: 'Status' },
            { id: '' },
          ]}
        />
      </Grid>
      {/* </Box> */}
    </Grid>
  );
}

ProfileHome.propTypes = {
  info: PropTypes.object,
  posts: PropTypes.array,
};
