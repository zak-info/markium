import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';

import { useTranslate } from 'src/locales';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFSwitch,
  RHFSelect,
} from 'src/components/hook-form';
import showError from 'src/utils/show_error';

// ----------------------------------------------------------------------

export default function YearlyPaymentForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const [loading, setLoading] = useState(false);

  // TODO: Fetch current subscription data from API
  const currentSubscription = {
    plan: 'professional',
    price: 299,
    billing_cycle: 'yearly',
    auto_renew: true,
    next_billing_date: '2025-12-31',
    status: 'active',
  };

  const UpdateYearlyPaymentSchema = Yup.object().shape({
    subscription_plan: Yup.string().required(t('subscription_plan_is_required')),
    billing_cycle: Yup.string().required(t('billing_cycle_is_required')),
    auto_renew: Yup.boolean(),
    payment_method: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      subscription_plan: currentSubscription?.plan || 'professional',
      billing_cycle: currentSubscription?.billing_cycle || 'yearly',
      auto_renew: currentSubscription?.auto_renew ?? true,
      payment_method: 'credit_card',
    }),
    [currentSubscription]
  );

  const methods = useForm({
    resolver: yupResolver(UpdateYearlyPaymentSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);

      // TODO: Implement API call to update subscription settings
      console.log('Subscription data to update:', data);

      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      enqueueSnackbar(t('subscription_updated_successfully'), { variant: 'success' });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showError(error);
    }
  });

  const subscriptionPlans = [
    { value: 'basic', label: t('basic_plan'), price: 99 },
    { value: 'professional', label: t('professional_plan'), price: 299 },
    { value: 'enterprise', label: t('enterprise_plan'), price: 599 },
  ];

  const billingCycles = [
    { value: 'monthly', label: t('monthly'), discount: 0 },
    { value: 'yearly', label: t('yearly'), discount: 20 },
  ];

  const selectedPlan = subscriptionPlans.find((plan) => plan.value === values.subscription_plan);
  const selectedCycle = billingCycles.find((cycle) => cycle.value === values.billing_cycle);

  const calculatePrice = () => {
    if (!selectedPlan) return 0;
    const basePrice = selectedCycle?.value === 'yearly' ? selectedPlan.price * 12 : selectedPlan.price;
    const discount = selectedCycle?.discount || 0;
    return basePrice * (1 - discount / 100);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      active: { label: t('active'), color: 'success' },
      expired: { label: t('expired'), color: 'error' },
      pending: { label: t('pending'), color: 'warning' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Current Subscription Status */}
        <Grid xs={12}>
          <Alert severity="info" icon={false}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={2}>
              <Box>
                <AlertTitle>{t('current_subscription')}</AlertTitle>
                <Typography variant="body2">
                  {t('next_billing_date')}: <strong>{currentSubscription.next_billing_date}</strong>
                </Typography>
              </Box>
              <Box>{getStatusChip(currentSubscription.status)}</Box>
            </Stack>
          </Alert>
        </Grid>

        {/* Subscription Plan Selection */}
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {t('subscription_plan')}
            </Typography>

            <Stack spacing={3}>
              <RHFSelect name="subscription_plan" label={t('select_plan')}>
                {subscriptionPlans.map((plan) => (
                  <MenuItem key={plan.value} value={plan.value}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{plan.label}</span>
                      <Typography variant="body2" color="text.secondary">
                        ${plan.price}/{t('month')}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="billing_cycle" label={t('billing_cycle')}>
                {billingCycles.map((cycle) => (
                  <MenuItem key={cycle.value} value={cycle.value}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span>{cycle.label}</span>
                      {cycle.discount > 0 && (
                        <Chip
                          label={`${t('save')} ${cycle.discount}%`}
                          color="success"
                          size="small"
                          variant="soft"
                        />
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* Price Summary */}
              <Card sx={{ p: 2, bgcolor: 'background.neutral' }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{t('plan')}:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {selectedPlan?.label}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{t('billing_cycle')}:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {selectedCycle?.label}
                    </Typography>
                  </Box>
                  {selectedCycle?.discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="success.main">
                        {t('discount')}:
                      </Typography>
                      <Typography variant="body2" color="success.main" fontWeight="medium">
                        -{selectedCycle.discount}%
                      </Typography>
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      pt: 1,
                      borderTop: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="subtitle1">{t('total')}:</Typography>
                    <Typography variant="h6" color="primary.main">
                      ${calculatePrice().toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    {values.billing_cycle === 'yearly' ? t('billed_annually') : t('billed_monthly')}
                  </Typography>
                </Stack>
              </Card>
            </Stack>
          </Card>
        </Grid>

        {/* Payment Settings */}
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {t('payment_settings')}
            </Typography>

            <Stack spacing={3}>
              <RHFSelect name="payment_method" label={t('payment_method')}>
                <MenuItem value="credit_card">{t('credit_card')}</MenuItem>
                <MenuItem value="paypal">{t('paypal')}</MenuItem>
                <MenuItem value="bank_transfer">{t('bank_transfer')}</MenuItem>
              </RHFSelect>

              <RHFSwitch
                name="auto_renew"
                label={t('auto_renew_subscription')}
                helperText={t('auto_renew_description')}
              />
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
              {t('update_subscription')}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
