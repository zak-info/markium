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
import { createUser, updateUser } from 'src/api/users';
import Label from 'src/components/label';
import showError from 'src/utils/show_error';

// ----------------------------------------------------------------------

export default function SelfUsersCreateView({ currentUser }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    username: Yup.string().required('Name is required'),
    email: Yup.string().required('Name is required'),
    phone_number: Yup.string().required('Name is required'),



  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      username: currentUser?.username || null,
      email: currentUser?.email || '',
      phone_number: currentUser?.phone_number || null,



    }),
    [currentUser]
  );


  const methods = useForm({
    resolver: yupResolver(validationSchema),
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

  const values = watch();

  // const [selectedRoles, setSelectedRoles] = useState([])

  useEffect(() => {
    if (currentUser?.id) {
      setValue('name', currentUser?.name);
      setValue('username', currentUser?.username);
      setValue('email', currentUser?.email);
      setValue('phone_number', currentUser?.phone_number);
    }
    console.log("currentUser : ", currentUser);

  }, [currentUser, setValue]);

  const selectedRoleIds = watch("role_id");




  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = data;
      const res = await updateUser(currentUser?.id, body)
      reset();
      enqueueSnackbar(t("operation_success"));
      // router.push(paths.dashboard.user.list);
      // v9W6FPLF hamed
    } catch (error) {
      console.error(error);
      showError(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={16}>
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
  );
}

SelfUsersCreateView.propTypes = {
  currentUser: PropTypes.object,
};
