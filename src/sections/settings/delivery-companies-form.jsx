import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useContext, useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import { useTranslate } from 'src/locales';
import Iconify from 'src/components/iconify';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFSwitch,
} from 'src/components/hook-form';
import showError from 'src/utils/show_error';
import { updateStoreConfig, useGetMyStore } from 'src/api/store';
import { AuthContext } from 'src/auth/context/jwt';
import ContentDialog from 'src/components/custom-dialog/content-dialog';
import { testDeliveryCredentials } from 'src/api/delivery';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function DeliveryCompaniesForm() {
  const { user } = useContext(AuthContext)
    const { store } = useGetMyStore(user?.store?.slug);
    console.log("store",store);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const [loading, setLoading] = useState(false);
  const [testModal, setTestModal] = useState({
    open: false,
    companyId: null,
    companyName: '',
  });
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Define delivery companies with their required fields
  const deliveryCompanies = [
    {
      id: 'yalidine',
      name: 'Yalidine',
      image: '/assets/images/delivery/yalidine.png',
      color: '#FF6B6B',
      fields: [
        { name: 'yalidine_api_id', label: t('api_id'), type: 'text', required: true, defaultValue: 'yalidine_api_id' },
        { name: 'yalidine_api_token', label: t('api_token'), type: 'text', required: true, defaultValue: 'yalidine_api_token' },
        // { name: 'yalidine_center_id', label: t('center_id'), type: 'text', required: false, defaultValue: '' },
      ],
      description: t('yalidine_description'),
    },
    {
      id: 'zrexpress',
      name: 'ZR Express',
      image: '/assets/images/delivery/zrexpress.png',
      color: '#4ECDC4',
      fields: [
        { name: 'zrexpress_api_id', label: t('api_id'), type: 'text', required: true, defaultValue: 'zrexpress_api_id' },
        { name: 'zrexpress_api_token', label: t('api_token'), type: 'text', required: true, defaultValue: 'zrexpress_api_token' },
        // { name: 'zrexpress_warehouse_id', label: t('warehouse_id'), type: 'text', required: false, defaultValue: '' },
      ],
      description: t('zrexpress_description'),
    },
    {
      id: 'maystro',
      name: 'Maystro Delivery',
      image: '/assets/images/delivery/maystro.png',
      color: '#95E1D3',
      fields: [
        { name: 'maystro_api_id', label: t('api_id'), type: 'text', required: true, defaultValue: 'maystro_api_id' },
        { name: 'maystro_api_token', label: t('api_token'), type: 'text', required: true, defaultValue: 'maystro_api_token' },
        // { name: 'maystro_merchant_id', label: t('merchant_id'), type: 'text', required: false, defaultValue: '' },
      ],
      description: t('maystro_description'),
    },
    {
      id: 'ecotrack',
      name: 'Ecotrack',
      image: '/assets/images/delivery/ecotrack.png',
      color: '#F38181',
      fields: [
        { name: 'ecotrack_api_id', label: t('api_id'), type: 'text', required: true, defaultValue: 'ecotrack_api_id' },
        { name: 'ecotrack_api_token', label: t('api_token'), type: 'text', required: true, defaultValue: 'ecotrack_api_token' },
        // { name: 'ecotrack_api_key', label: t('api_key'), type: 'text', required: false, defaultValue: '' },
      ],
      description: t('ecotrack_description'),
    },
  ];

  // Build dynamic Yup schema
  const buildValidationSchema = () => {
    const schemaFields = {};

    deliveryCompanies.forEach((company) => {
      // Add enabled field
      schemaFields[`${company.id}_enabled`] = Yup.boolean();
      // Add dynamic fields with conditional validation
      company.fields.forEach((field) => {
        if (field.required) {
          schemaFields[field.name] = Yup.string().when(`${company.id}_enabled`, {
            is: true,
            then: (schema) => schema.required(t(`${field.name}_required`)),
            otherwise: (schema) => schema,
          });
        } else {
          schemaFields[field.name] = Yup.string();
        }
      });
    });

    return Yup.object().shape(schemaFields);
  };

  const DeliveryCompaniesSchema = buildValidationSchema();

  // Build default values
  const buildDefaultValues = () => {
    const defaults = {};

    deliveryCompanies.forEach((company) => {
      // Load from store data if available
      const companyData = store?.config?.delivery?.[company.id];

      // Handle both string "true"/"false" and boolean values
      const enabledValue = companyData?.enabled;
      defaults[`${company.id}_enabled`] = enabledValue === true || enabledValue === "true";

      company.fields.forEach((field) => {
        const fieldKey = field.name.replace(`${company.id}_`, '');
        defaults[field.name] = companyData?.[fieldKey] || '';
      });
    });

    return defaults;
  };

  const defaultValues = useMemo(() => buildDefaultValues(), [store]);

  const methods = useForm({
    resolver: yupResolver(DeliveryCompaniesSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // Reset form when store data is loaded
  useEffect(() => {
    if (store) {
      reset(defaultValues);
    }
  }, [store, reset, defaultValues]);

  const handleOpenTestModal = (company) => {
    setTestModal({
      open: true,
      companyId: company.id,
      companyName: company.name,
    });
    setTestResult(null);
  };

  const handleCloseTestModal = () => {
    setTestModal({
      open: false,
      companyId: null,
      companyName: '',
    });
    setTestLoading(false);
    setTestResult(null);
  };

  const handleTestCredentials = async () => {
    try {
      setTestLoading(true);
      setTestResult(null);

      const companyId = testModal.companyId;
      const apiId = values[`${companyId}_api_id`];
      const apiToken = values[`${companyId}_api_token`];

      // Call the test API
      const result = await testDeliveryCredentials(companyId, apiId, apiToken);

      setTestResult(result);
      setTestLoading(false);

      // Show snackbar notification
      if (result.success) {
        enqueueSnackbar(t('credentials_test_passed'), { variant: 'success' });
      } else {
        enqueueSnackbar(t('credentials_test_failed'), { variant: 'error' });
      }
    } catch (error) {
      setTestLoading(false);
      setTestResult({
        success: false,
        message: 'Test failed',
        error: error.message || 'Unknown error occurred',
      });
      showError(error);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);

      // Transform flat form data into structured delivery company objects
      const structuredData = {};

      deliveryCompanies.forEach((company) => {
        const companyData = {
          enabled: data[`${company.id}_enabled`],
        };

        // Extract company-specific fields
        company.fields.forEach((field) => {
          const fieldKey = field.name.replace(`${company.id}_`, ''); // Remove prefix
          companyData[fieldKey] = data[field.name];
        });

        structuredData[company.id] = companyData;
      });

      // Console log the structured data
      console.log('Delivery companies data:', structuredData);
      await updateStoreConfig({ config: { delivery: structuredData } })

      // TODO: Implement API call to save delivery companies settings
      // await updateDeliveryCompanies(structuredData);

      // Simulated API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      enqueueSnackbar(t('delivery_companies_saved_successfully'), { variant: 'success' });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showError(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Information Alert */}
        <Grid xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              {t('delivery_companies_info_message')}
            </Typography>
          </Alert>
        </Grid>

        {/* Delivery Companies Sections */}
        <Grid xs={12} display="flex" flexDirection="column" gap={4}>
          {deliveryCompanies.map((company) => (
            <Card xs={12} key={company.id} width="100%">
              <Accordion>
                <AccordionSummary
                  expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                  sx={{
                    backgroundColor: 'background.neutral',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                    <Avatar
                      src={company.image}
                      alt={company.name}
                      variant="rounded"
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: 'background.neutral',
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{company.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {company.description}
                      </Typography>
                    </Box>
                    <RHFSwitch name={`${company.id}_enabled`} label={t('enabled')} sx={{ mr: 2 }} />
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={3}>
                    {/* Dynamic Fields */}
                    {company.fields.map((field) => (
                      <RHFTextField
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        disabled={!values[`${company.id}_enabled`]}
                        helperText={
                          !values[`${company.id}_enabled`]
                            ? t('enable_to_configure')
                            : field.required
                            ? t('required_field')
                            : t('optional_field')
                        }
                        InputProps={{
                          startAdornment: (
                            <Iconify
                              icon="solar:key-bold"
                              width={20}
                              sx={{ mr: 1, color: 'text.disabled' }}
                            />
                          ),
                        }}
                      />
                    ))}

                    {/* Test Credentials Button */}
                    {values[`${company.id}_enabled`] &&
                     values[`${company.id}_api_id`] &&
                     values[`${company.id}_api_token`] && (
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => handleOpenTestModal(company)}
                        startIcon={<Iconify icon="solar:test-tube-bold" />}
                        sx={{
                          borderStyle: 'dashed',
                          borderWidth: 2,
                          '&:hover': {
                            borderStyle: 'dashed',
                            borderWidth: 2,
                          },
                        }}
                      >
                        {t('test_credentials')}
                      </Button>
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Card>
          ))}
        </Grid>

        {/* Instructions Card */}
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('integration_instructions')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              {deliveryCompanies.map((company, index) => (
                <Typography key={company.id} variant="body2">
                  <strong>{index + 1}. {company.name}:</strong> {t(`${company.id}_integration_instructions`)}
                </Typography>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Actions */}
        <Grid xs={12}>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting || loading}
            >
              {t('save_changes')}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>

      {/* Test Credentials Dialog */}
      <ContentDialog
        open={testModal.open}
        onClose={testLoading ? undefined : handleCloseTestModal}
        title={t('test_credentials')}
        description={testModal.companyName}
        maxWidth="sm"
        content={
          <Stack spacing={3}>
            {/* Status Box */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: (theme) => {
                  if (!testResult && !testLoading) return alpha(theme.palette.primary.main, 0.08);
                  if (testLoading) return alpha(theme.palette.warning.main, 0.08);
                  if (testResult?.success) return alpha(theme.palette.success.main, 0.08);
                  return alpha(theme.palette.error.main, 0.08);
                },
                border: (theme) => {
                  if (!testResult && !testLoading) return `1px solid ${alpha(theme.palette.primary.main, 0.24)}`;
                  if (testLoading) return `1px solid ${alpha(theme.palette.warning.main, 0.24)}`;
                  if (testResult?.success) return `1px solid ${alpha(theme.palette.success.main, 0.24)}`;
                  return `1px solid ${alpha(theme.palette.error.main, 0.24)}`;
                },
                textAlign: 'center',
              }}
            >
              <Stack spacing={2} alignItems="center">
                {/* Icon */}
                {testLoading ? (
                  <CircularProgress size={48} sx={{ color: 'warning.main' }} />
                ) : (
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: (theme) => {
                        if (!testResult) return alpha(theme.palette.primary.main, 0.12);
                        if (testResult.success) return alpha(theme.palette.success.main, 0.12);
                        return alpha(theme.palette.error.main, 0.12);
                      },
                    }}
                  >
                    <Iconify
                      icon={
                        !testResult
                          ? 'solar:test-tube-bold'
                          : testResult.success
                          ? 'solar:check-circle-bold'
                          : 'solar:close-circle-bold'
                      }
                      width={32}
                      sx={{
                        color: !testResult
                          ? 'primary.main'
                          : testResult.success
                          ? 'success.main'
                          : 'error.main',
                      }}
                    />
                  </Box>
                )}

                {/* Status Text */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: testLoading
                        ? 'warning.main'
                        : !testResult
                        ? 'primary.main'
                        : testResult.success
                        ? 'success.main'
                        : 'error.main',
                      fontWeight: 600,
                    }}
                  >
                    {testLoading
                      ? t('testing_credentials')
                      : !testResult
                      ? t('ready_to_test')
                      : testResult.success
                      ? t('credentials_valid')
                      : t('credentials_invalid')}
                  </Typography>
                  {testResult?.message && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {testResult.message}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>

            {/* Error Details */}
            {testResult?.error && (
              <Alert severity="error" sx={{ textAlign: 'left' }}>
                <Typography variant="body2">{testResult.error}</Typography>
              </Alert>
            )}

            {/* Actions */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              {!testLoading && (
                <Button
                  variant="outlined"
                  onClick={handleCloseTestModal}
                  size="large"
                >
                  {testResult?.success ? t('close') : t('cancel')}
                </Button>
              )}
              {!testResult?.success && (
                <LoadingButton
                  variant="contained"
                  onClick={handleTestCredentials}
                  loading={testLoading}
                  size="large"
                  startIcon={<Iconify icon="solar:test-tube-bold" />}
                >
                  {t('test_now')}
                </LoadingButton>
              )}
            </Stack>
          </Stack>
        }
      />
    </FormProvider>
  );
}
