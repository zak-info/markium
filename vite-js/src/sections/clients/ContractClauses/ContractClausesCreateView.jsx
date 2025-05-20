import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { format, getTime, formatDistanceToNow } from 'date-fns';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect, RHFMultiSelect } from 'src/components/hook-form';

import { useLocales, useTranslate } from 'src/locales';

import { addNewDriver, editDriver } from 'src/api/drivers';

import { useValues } from 'src/api/utils';
import { useGetCar } from 'src/api/car';
import { changeUserPasswordByAdmin, createUser, updateUser, useRoles } from 'src/api/users';
import Label from 'src/components/label';
import showError from 'src/utils/show_error';
import { useSettingsContext } from 'src/components/settings';
import { Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function ContractClausesCreateView({ currentUser }) {
  const router = useRouter();
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { roles } = useRoles()
  const { currentLang } = useLocales()



  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    username: Yup.string().required('Name is required'),
    email: Yup.string().required('Name is required'),
    phone_number: Yup.string().required('Name is required'),
    password: Yup.string().when('$currentUser', {
      is: (val) => !val, // when currentUser is falsy (e.g., null or undefined)
      then: (schema) => schema.required('Password is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    password_confirmation: Yup.string().when('$currentUser', {
      is: (val) => !val,
      then: (schema) => schema.required('Password confirmation is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    role_id: Yup.array().min(1, 'At least one role is required'),
  });
  const passwordValidationSchema = Yup.object({
    new_password: Yup.string().required('new password is required'),
    confirm_password: Yup.string().required('confirm password is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      username: currentUser?.username || null,
      email: currentUser?.email || '',
      phone_number: currentUser?.phone_number || null,
      // password: currentUser?.password || '',
      // role_id: currentUser?.role_id || "",
      role_id: currentUser?.role_id || [],
    }),
    [currentUser]
  );


  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });
  const methods2 = useForm({
    resolver: yupResolver(passwordValidationSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;
  const {
    handleSubmit: handlePasswordSubmit,
    formState: { isSubmitting: isPasswordSubmitting },
  } = methods2;

  useEffect(() => {
    if (currentUser?.id) {
      setValue('name', currentUser?.name);
      setValue('username', currentUser?.username);
      setValue('email', currentUser?.email);
      setValue('phone_number', currentUser?.phone_number);
      // setValue('password', currentUser?.password);
      setValue('role_id', currentUser?.roles.map((role) => role.id));
    }
    console.log("currentUser : ", currentUser);

  }, [currentUser, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = data;

      if (currentUser?.id) {
        console.log("currentUser?.id : ", currentUser?.id);
        const res = await updateUser(currentUser?.id, body)
      } else {
        console.log("body :", body);
        const res = await createUser(body)
        console.log("res : ", res);
      }
      reset();
      enqueueSnackbar(t("operation_success"));
      router.push(paths.dashboard.user.list);
      // v9W6FPLF hamed
    } catch (error) {
      console.error(error);
      showError(error);
    }
  });

  const onPasswordSubmit = handlePasswordSubmit(async (data) => {
    try {
      const body = data;
      console.log("currentUser?.id : ", currentUser?.id);
      const res = await changeUserPasswordByAdmin({ user_id: currentUser?.id, password: body?.new_password, password_confirmation: body?.confirm_password })
      reset();
      enqueueSnackbar(t("operation_success"));
      router.push(paths.dashboard.user.list);
      // v9W6FPLF hamed
    } catch (error) {
      console.error(error);
      showError(error);
    }
  });

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('edit_user')}
          links={[
            {
              name: t('dashboard'),
              href: paths.dashboard.root,
            },
            {
              name: t('users'),
              href: paths.dashboard.user.root,
            },
            { name: t('edit_user') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  {/* Name */}
                  <RHFTextField name="name" label={t('name')} />
                  <RHFTextField name="username" label={t('username')} />
                  <RHFTextField name="email" label={t('email')} type="email" />
                  <RHFTextField name="phone_number" label={t('phone_number')} />
                  {currentUser ? null : <RHFTextField name="password" label={t('password')} />}
                  {currentUser ? null : <RHFTextField name="password_confirmation" label={t('confirm_password')} />}
                </Box>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  mt={4}
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >

                  <RHFMultiSelect
                    name="role_id"
                    label={t('role')}
                    placeholder={t('select_roles')}
                    chip
                    checkbox
                    options={roles?.map((option) => ({
                      value: option.id,
                      label: option?.translations[1]?.name,
                    }))}
                  />

                </Box>



                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!currentUser ? t('create') : t('saveChange')}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
      {/* <Container sx={{mt:4}} maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('edit_password')}
          links={[
            {
              name: t('dashboard'),
              href: paths.dashboard.root,
            },
            {
              name: t('users'),
              href: paths.dashboard.user.root,
            },
            { name: t('edit_password') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {
          currentUser ?
            <FormProvider methods={methods2} onSubmit={onPasswordSubmit}>
              <Grid container spacing={3}>
                <Grid xs={12} md={8}>
                  <Card sx={{ p: 3 }}>
                    <Box
                      rowGap={3}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                      }}
                    >
                      <RHFTextField name="new_password" label={t('new_password')} />
                      <RHFTextField name="confirm_password" label={t('confirm_password')} />
                    </Box>




                    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                      <LoadingButton type="submit" variant="contained" loading={isPasswordSubmitting}>
                        {!currentUser ? t('create') : t('saveChange')}
                      </LoadingButton>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </FormProvider>
            :
            null
        }
      </Container> */}
    </>
  );
}

ContractClausesCreateView.propTypes = {
  currentUser: PropTypes.object,
};
