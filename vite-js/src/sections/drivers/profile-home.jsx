import { useRef } from 'react';
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
import AppNewInvoiceBreakdown from './app-new-breakdown';

import { fNumber } from 'src/utils/format-number';

import { _socials } from 'src/_mock';

import Iconify from 'src/components/iconify';

import ProfilePostItem from './profile-post-item';
import { _appInvoices } from 'src/_mock';
import { useTranslation } from 'react-i18next';
import { useGetDocuments } from 'src/api/document';
import { useValues } from 'src/api/utils';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function ProfileHome({ driver, posts }) {
  const fileRef = useRef(null);

  const { t } = useTranslation();

  const { documents } = useGetDocuments()
  const { data } = useValues()
  const driverDocuments = documents.filter(item => item.attachable_id == driver?.id && item.attachable_type == "driver")


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
          {fNumber(driver.totalFollowers)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Follower
          </Box>
        </Stack>

        <Stack width={1}>
          {fNumber(driver.totalFollowing)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Following
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderAbout = (
    <Card>
      {/* <CardHeader title={t('driver')} /> */}
      <CardHeader title={driver.name} />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('residence permit number')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{driver?.residence_permit_number}</Box>
        </Stack>
        <Box sx={{ typography: 'body2' }}>{driver.quote}</Box>

        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`State `}
            <Link variant="subtitle2" color="inherit">
              Readh
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:car-fill" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`attached car `}
            {
              !!driver?.car?.id ?
                <Link href={paths?.dashboard?.vehicle.details(driver?.car?.id)} variant="subtitle2" color="inherit">
                  {data?.car_companies?.flatMap(item => item?.models)?.find(model => model.id == driver?.car?.car_model_id)?.translations[0]?.name + " " + driver?.car?.plat_number}
                </Link>
                :
                <Link variant="subtitle2" color="inherit">
                  not attached
                </Link>
            }
          </Box>
        </Stack>

        {/* <Stack direction="row" sx={{ typography: 'body2' }}>
          <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
          {driver.email}
        </Stack> */}

        {/* <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`get  `}
            <Link variant="subtitle2" color="inherit">
              1200
            </Link>
            of salary
          </Box>
        </Stack> */}

        {/* <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`Studied at `}
            <Link variant="subtitle2" color="inherit">
              {driver.school}
            </Link>
          </Box>
        </Stack> */}
      </Stack>
    </Card>
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
    <AppNewInvoiceBreakdown
      style={{ marginTop: "20px" }}
      title={t('Vehicul_Documents')}
      tableData={driverDocuments}
      tableLabels={[
        { id: 'document', label: t('document') },
        { id: 'file', label: t('file') },
        // { id: 'invoice', label: t('link') },
        // { id: 'status', label: t('cost') },
      ]}
    />
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          {/* {renderFollows} */}

          {renderAbout}

          {renderSocials}
        </Stack>
      </Grid>

      <Grid xs={12} md={8}>
        <Stack spacing={3}>
          {/* {renderFollows} */}

          {renderAbout}

          {/* <AppNewInvoice
            title={t('salaries')}
            tableData={_appInvoices}
            tableLabels={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          /> */}
        </Stack>
      </Grid>
    </Grid>
  );
}

ProfileHome.propTypes = {
  driver: PropTypes.object,
  posts: PropTypes.array,
};

// 63.250.43.2
