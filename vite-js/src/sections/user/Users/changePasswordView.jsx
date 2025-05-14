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
import { changeUserPassword, changeUserPasswordByAdmin, createUser, updateUser, useRoles } from 'src/api/users';
import Label from 'src/components/label';
import showError from 'src/utils/show_error';
import { useSettingsContext } from 'src/components/settings';
import { Container } from '@mui/material';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function ChangePasswordView({ currentUser, onClose, selfAccount }) {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslate();
    console.log(" currentUser : ", currentUser);

    const validationSchema = Yup.object({
        current_password: Yup.string().when('$selfAccount', {
            is: (val) => !val, // when currentUser is falsy (e.g., null or undefined)
            then: (schema) => schema.required('Password is required'),
            otherwise: (schema) => schema.notRequired()
        }),
        new_password: Yup.string().required('new password is required'),
        confirm_password: Yup.string().required('confirm password is required'),
    });

    const defaultValues = useMemo(
        () => ({

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




    const onPasswordSubmit = handleSubmit(async (data) => {
        try {
            const body = data;
            console.log("currentUser?.id : ", currentUser?.id);
            if (selfAccount) {
                const res = await changeUserPassword({ old_password: data.current_password, new_password: data.new_password, new_password_confirmation: data?.confirm_password });
            } else {
                const res = await changeUserPasswordByAdmin({ user_id: currentUser?.id, password: body?.new_password, password_confirmation: body?.confirm_password })
            }
            reset();
            enqueueSnackbar(t("operation_success"));
            onClose()
            // v9W6FPLF hamed
        } catch (error) {
            console.error(error);
            showError(error);
        }
    });

    return (
        <>
            <FormProvider methods={methods} onSubmit={onPasswordSubmit}>
                <Grid container spacing={3}>
                    <Grid xs={12} md={16} my={2}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(1, 1fr)',
                            }}
                        >
                            {
                                selfAccount && (
                                    <RHFTextField name="current_password" label={t('current_password')} />
                                )
                            }
                            <RHFTextField name="new_password" label={t('new_password')} />
                            <RHFTextField name="confirm_password" label={t('confirm_password')} />
                        </Box>
                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                {!currentUser ? t('create') : t('saveChange')}
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </FormProvider>
        </>
    );
}

ChangePasswordView.propTypes = {
    currentUser: PropTypes.object,
};
