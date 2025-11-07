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

  const items = [
    { lable: t(`residence_permit_number`), value: driver?.residence_permit_number, icon: 'solar:paperclip-rounded-2-bold' },
    { lable: t(`salary`), value: driver?.salary, icon: 'solar:dollar-bold' },
    { lable: t(`phone_number`), value: driver?.phone_number, icon: 'solar:phone-rounded-bold-duotone' },
    { lable: t(`birth_date`), value: driver?.birth_date, icon: 'solar:calendar-date-bold-duotone' },
    { lable: t(`start_date`), value: driver?.start_date, icon: 'solar:calendar-date-bold-duotone' },
    { lable: t(`state`), value: data?.states?.find(i => i.id == driver?.state_id)?.translations[0]?.name || driver?.state?.key, icon: "mingcute:location-fill" },
    {
      lable: t(`car`), value: !!driver?.car?.id ?
        <Link href={paths?.dashboard?.vehicle.details(driver?.car?.id)} variant="subtitle2" color="inherit">
          {data?.car_companies?.flatMap(item => item?.models)?.find(model => model.id == driver?.car?.car_model_id)?.translations[0]?.name + " " + driver?.car?.plat_number}
        </Link>:"--"
      , icon: "mingcute:car-fill"
    },
  ]



  const renderAbout = (
    <Card>
      <CardHeader title={t("info")} />
      <Stack spacing={2} sx={{ p: 3 }}>
        {
          items?.map((item, index) => (
            <Stack direction="row" spacing={2}>
              <Iconify icon={item.icon} width={24} />
              <Box sx={{ typography: 'body2' }}>
                {item.lable + " : "}
                <Link variant="subtitle2" color="inherit">
                  {item?.value}
                </Link>
              </Box>
            </Stack>
          ))
        }

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
      title={t('documents')}
      tableData={driverDocuments}
      driver={driver}
      tableLabels={[
        { id: 'document', label: t('document') },
        { id: 'file', label: t('file') },
        { id: 'invoice', label: t('invoice') },
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

          {/* {renderAbout} */}

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
