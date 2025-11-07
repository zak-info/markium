import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useTranslation } from 'react-i18next';
import Label from 'src/components/label';

import { fCurrency } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { Divider, Link, Typography, Grid, Paper, Button, FormHelperText } from '@mui/material';
import { fDate } from 'src/utils/format-time';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useCallback } from 'react';
import { useLocales } from 'src/locales';
import StatusLabel from './StatusLabel';
import EditExitDate from './EditExitDatePopUp';
import EditExitDatePopUp from './EditExitDatePopUp';
import MultiFilePreview from 'src/components/upload/preview-multi-invoices';
import { normalizeInvoices } from 'src/components/file-thumbnail';
import PermissionsContext from 'src/auth/context/permissions/permissions-context';
import { useBoolean } from 'src/hooks/use-boolean';
import ContentDialog from 'src/components/custom-dialog/content-dialog';
import { MarkAsCompletedForm } from './MaintenanceListView/MarkAsCompletedForm';
import ShowInvoices from './ShowInvoices';


// ----------------------------------------------------------------------

export default function OrderDetailsItems({
  items,
  taxes,
  shipping,
  discount,
  subTotal,
  totalAmount,
  maintenance_type,
  currentMentainance,
  setCurrentMentainance,
  currentCar,
  driver,
  maintenanceclauses
}) {

  const { t } = useTranslation();
  const router = useRouter();
  const { currentLang } = useLocales();
  const completed = useBoolean()

  const day = { ar: "يوم", en: 'day' };
  const days = { ar: "ايام", en: 'days' };

  const handleViewCar = useCallback(
    (id) => {
      router.push(paths.dashboard.vehicle.details(id));
    },
    [router]
  );
  const handleViewContract = useCallback(
    (id) => {
      router.push(paths.dashboard.clients.contractsDetails(id));
    },
    [router]
  );

  const handleViewDriver = useCallback(
    (id) => {
      router.push(paths.dashboard.drivers.details(id));
    },
    [router]
  );

  // Helper function to format remaining days
  const formatRemainingDays = () => {
    const remainingDays = currentMentainance?.remaining_days;
    if (!remainingDays) return "--";

    const dayText = remainingDays > 2 && remainingDays < 11
      ? days[currentLang?.value]
      : day[currentLang?.value];

    return `${remainingDays} ${dayText}`;
  };

  // Vehicle Information Section
  const renderVehicleInfo = (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        bgcolor: 'background.neutral',
        borderRadius: 2,
        mb: 3,
        height: "100%"
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
        {t('vehicleInformation')}
      </Typography>

      <Grid container display={"flex"} flexDirection={"column"} spacing={3}>
        <Grid item xs={12} md={12}>
          <Box
            onClick={() => handleViewCar(currentCar?.id)}
            sx={{
              cursor: 'pointer',
              p: 2,
              borderRadius: 1,
              bgcolor: 'background.paper',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'action.hover',
                transform: 'translateY(-2px)',
                boxShadow: 1,
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  width: 48,
                  height: 48,
                }}
              >
                <Iconify icon="mdi:car" width={24} />
              </Avatar>
              <Box >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {currentCar?.model?.translations?.name + " " + currentCar?.model?.company?.translations?.name}
                </Typography>

                <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
                  {currentCar?.plat_number}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Grid>
        {currentMentainance?.contract?.id ?
          <Grid item xs={12} md={12}>
            <Box
              onClick={() => { currentMentainance?.contract?.id ? handleViewContract(currentMentainance?.contract?.id) : null }}
              sx={{
                cursor: 'pointer',
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.paper',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: 'translateY(-2px)',
                  boxShadow: 1,
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    width: 48,
                    height: 48,
                  }}
                >
                  <Iconify icon="mdi:document" width={24} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {t("contract")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentMentainance?.contract?.ref || "--"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
          :
          null
        }
        {driver?.id ?
          <Grid item xs={12} md={12}>
            <Box
              onClick={() => handleViewDriver(driver?.id)}
              sx={{
                cursor: 'pointer',
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.paper',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: 'translateY(-2px)',
                  boxShadow: 1,
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    width: 48,
                    height: 48,
                  }}
                >
                  <Iconify icon="healthicons:truck-driver" width={24} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {t("driver")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {driver?.name || "--"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
          :
          null
        }

        {/* <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {t('driver')}
          </Typography>
          <Box>
            {driver?.name ? (
              <Link
                onClick={() => handleViewDriver(driver?.id)}
                href=""
                sx={{
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                <Typography variant="subtitle2" color="primary.main">
                  {driver?.name}
                </Typography>
              </Link>
            ) : (
              <Typography variant="subtitle2">--</Typography>
            )}
          </Box>
        </Stack> */}
      </Grid>
    </Paper>
  );

  // Maintenance Information Section
  const renderMaintenanceInfo = (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        bgcolor: 'background.neutral',
        borderRadius: 2,
        mb: 3,
        height: "100%"
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
        {t('maintenanceInformation')}
      </Typography>

      <Box
        // onClick={() => handleViewCar(currentCar?.id)}
        sx={{
          // cursor: 'pointer',
          p: 2,
          borderRadius: 1,
          bgcolor: 'background.paper',
          transition: 'all 0.2s',
          // '&:hover': {
          //   bgcolor: 'action.hover',
          //   transform: 'translateY(-2px)',
          //   boxShadow: 1,
          // },
        }}
      >
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Stack direction="column" justifyContent="space-between" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                {t('maintainType')}
              </Typography>
              <Typography variant="subtitle2">
                {maintenance_type || "--"}
              </Typography>
            </Stack>

            <Stack direction="column" justifyContent="space-between" spacing={1} >
              <Typography variant="body2" color="text.secondary">
                {t('cause')}
              </Typography>
              <Typography variant="subtitle2">
                {currentMentainance?.cause || "--"}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Box>
      {
        currentMentainance?.invoices && currentMentainance?.invoices?.length > 0 ?
          <Grid item xs={12} md={6}>
            <Box sx={{ my: 3 }}>

              <Stack direction="row" justifyContent="space-between" >
                <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                  {t('invoices')}
                </Typography>
                <ShowInvoices invoices={currentMentainance?.invoices} />
              </Stack>
              {/* <MultiFilePreview files={normalizeInvoices(currentMentainance?.invoices)} onClose={() => { }} /> */}
            </Box>
          </Grid>
          :
          <PermissionsContext action={'update.maintenance'}>
            <Box sx={{ my: 3 }}>
              <Button disabled={maintenanceclauses?.length == 0} onClick={() => { completed.onTrue() }} color="inherit" variant="contained" startIcon={<Iconify icon="duo-icons:folder-open" />} >
                {t("mark_as_completed")}
              </Button>
              {
                maintenanceclauses?.length == 0 ?
                  <FormHelperText>
                    {t("cant_close_maintenance_unless_one_clause_at_least")}
                  </FormHelperText>
                  :
                  null
              }
            </Box>
          </PermissionsContext>

      }
      <ContentDialog
        open={completed.value}
        onClose={completed.onFalse}
        title={t("complete_maintenance")}
        content={
          <MarkAsCompletedForm setTableData={() => { }} maintenanceId={currentMentainance?.id} close={() => { router.reload() }} />
        }
      />
    </Paper>
  );

  // Timeline Section
  const renderTimeline = (
    <Paper
      elevation={0}
      sx={{
        width: "450px",
        p: 1,
        bgcolor: 'background.neutral',
        borderRadius: 2
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
        {t('timeline')}
      </Typography>

      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: 'success.main',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {t('entryDate')}
            </Typography>
          </Stack>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {fDate(currentMentainance?.entry_date)}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: 'warning.main',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {t('exitExpectedDate')}
            </Typography>
          </Stack>
          <EditExitDatePopUp date={fDate(currentMentainance?.exit_date)} setCurrentMentainance={setCurrentMentainance} currentMentainance={currentMentainance} />

        </Stack>

        <Stack
          display={"flex"}
          direction="column"
          justifyContent="space-between"
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Stack direction="row" justifyContent={"space-between"} alignItems="center" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: 'info.main',
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {t('remaining_days')}
              </Typography>
            </Stack>
            {/* <Typography variant="subtitle2" sx={{ fontWeight: 600, }}>
              {formatRemainingDays()}
            </Typography> */}
            <StatusLabel  currentMentainance={currentMentainance} msg={formatRemainingDays()} />
          </Stack>
          {/* <Stack direction="row" justifyContent={"flex-end"} alignItems="center" mt={2} spacing={2}>
          </Stack> */}
        </Stack>
      </Stack>
    </Paper>
  );

  return (
    <Card sx={{ overflow: 'visible' }}>
      <CardHeader
        title={t('details')}

        sx={{
          pb: 0,
          '& .MuiCardHeader-title': {
            fontSize: '1.25rem',
            fontWeight: 600,
          }
        }}
      />

      <Box
        rowGap={3}
        columnGap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        sx={{ p: 3 }}
      >
        {renderVehicleInfo}
        {renderMaintenanceInfo}
        {renderTimeline}
      </Box>
    </Card>
  );
}

OrderDetailsItems.propTypes = {
  discount: PropTypes.number,
  items: PropTypes.array,
  shipping: PropTypes.number,
  subTotal: PropTypes.number,
  taxes: PropTypes.number,
  totalAmount: PropTypes.number,
  maintenance_type: PropTypes.string,
  currentMentainance: PropTypes.object,
  setCurrentMentainance: PropTypes.func,
  currentCar: PropTypes.object,
  driver: PropTypes.object,
};