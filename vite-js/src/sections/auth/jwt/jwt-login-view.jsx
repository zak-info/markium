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

import { useTranslation } from 'react-i18next';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { HOST_API, PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axios from 'axios';
import { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const { t } = useTranslation();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const validateEmail = (email) => {
    return Yup.string().email().isValidSync(email);
  };

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

  const LoginSchema = Yup.object().shape({
    phone: Yup.string()
      .required(t('phone_is_required')),
      // .test('phone-validation', t('phone_is_invalid'), (value) => {
      //   return validatePhone(value);
      // }),
    password: Yup.string().required(t('password_is_required')),
  });

  const defaultValues = {
    phone: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
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
      const response = await axios.post(HOST_API + endpoints.auth.login, {...data,phone:formatPhoneWithPrefix(data.phone)});
      console.log("response : ", response);

      if (response?.data?.success) {
        const res = await login(formatPhoneWithPrefix(data.phone), data.password);
        router.push(returnTo || PATH_AFTER_LOGIN);
      } else {
        setErrorMsg(t("please_check_your_phone_and_password"));
      }

    } catch (error) {
      console.log("error : ", error);

      if (error?.response?.status === 403) {
        setErrorMsg(t("user_is_banned"));
      } else {
        setErrorMsg(t("please_check_your_phone_and_password"));
      }
    }
  });


  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4"> {t('login')} </Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">{t('dont_have_account')}</Typography>

        <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
          {t('create_account')}
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="phone" label={t('phone')} />
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

      {/* <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        {t('forgotPassword')}
      </Link> */}

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('login')}
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}


      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}
