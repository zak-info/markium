import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

export default function JwtRegisterView() {
  const { register } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const { t } = useTranslation();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();
  const confirmPassword = useBoolean();
  const validatePhone = (phone) => {
    if (!phone) return false;
    
    // Remove any non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check for 9 digits starting with 5, 6, or 7
    if (cleanPhone.length === 9) {
      return /^[567]/.test(cleanPhone);
    }
    
    // Check for 10 digits starting with 05, 06, or 07
    if (cleanPhone.length === 10) {
      return /^0[567]/.test(cleanPhone);
    }
    
    return false;
  };

  const formatPhoneWithPrefix = (phone) => {
    if (!phone) return phone;
    
    const cleanPhone = phone.replace(/\D/g, '');
    
    // If 9 digits starting with 5, 6, or 7, add +213
    if (cleanPhone.length === 9 && /^[567]/.test(cleanPhone)) {
      return `+213${cleanPhone}`;
    }
    
    // If 10 digits starting with 05, 06, or 07, replace 0 with +213
    if (cleanPhone.length === 10 && /^0[567]/.test(cleanPhone)) {
      return `+213${cleanPhone.substring(1)}`;
    }
    
    return phone;
  };

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required(t('name_required')),
    phone: Yup.string()
      .required(t('phone_is_required'))
      .test('phone-validation', t('phone_is_invalid'), (value) => {
        return validatePhone(value);
      }),
    password: Yup.string()
      .required(t('password_is_required'))
      .min(8, t('password_must_be_at_least_8_characters')),
    password_confirmation: Yup.string()
      .required(t('confirm_password_required'))
      .oneOf([Yup.ref('password')], t('passwords_must_match')),
    store_name: Yup.string().required(t('store_name_required')),
  });

  const defaultValues = {
    name: '',
    phone: '',
    password: '',
    password_confirmation: '',
    store_name: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("data : ", data);
      console.log("formatPhoneWithPrefix(data.phone) : ", formatPhoneWithPrefix(data.phone));
      await register?.(data.name, formatPhoneWithPrefix(data.phone), data.password, data.store_name);
      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      // reset();
      const message = error.error?.message || '';
      const details = error.error?.details ? Object.values(error.error.details).flat().join(' ') : '';
      setErrorMsg(`${message} ${details}`.trim());
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">{t('create_account')}</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">{t('already_have_account')}</Typography>

        <Link href={paths.auth.jwt.login} component={RouterLink} variant="subtitle2">
          {t('login')}
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 2.5,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {t('by_signing_up_i_agree_to')}
      <Link underline="always" color="text.primary">
        {t('terms_of_service')}
      </Link>
      {t('and')}
      <Link underline="always" color="text.primary">
        {t('privacy_policy')}
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="name" label={t('name')} />
      
      <RHFTextField name="phone" label={t('phone')} />
      
      <RHFTextField name="store_name" label={t('store_name')} />

      <RHFTextField
        name="password"
        label={t('password')}
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <RHFTextField
        name="password_confirmation"
        label={t('confirm_password')}
        type={confirmPassword.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={confirmPassword.onToggle} edge="end">
                <Iconify icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('create_account')}
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ m: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>

      {renderTerms}
    </>
  );
}
