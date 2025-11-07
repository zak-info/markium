import { Box, Button, Card, FormControlLabel, FormGroup, Grid, IconButton, MenuItem, Stack, Switch, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { set } from 'lodash'; // [keep for later use]
import { enqueueSnackbar, useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { AddCarToMentainance, deleteCar, markCarAsAvailable, useGetCar } from 'src/api/car';
import { useGetClauses } from 'src/api/claim';
import { useGetClients } from 'src/api/client';
import { useGetContracts } from 'src/api/contract';
import { deleteMaintenance, markMaintenanceAsCompeleted, useGetMaintenance } from 'src/api/maintainance';
import { changeItemVisibilityInSettings, useGetMainSpecs } from 'src/api/settings'; // [keep for later use]
import { createUser, deleteUser, useRoles, useUsers } from 'src/api/users';
import { useValues } from 'src/api/utils';
import PermissionsContext from 'src/auth/context/permissions/permissions-context';
import { ConfirmDialog } from 'src/components/custom-dialog';
import ContentDialog from 'src/components/custom-dialog/content-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { fileData } from 'src/components/file-thumbnail'; // [keep for later use]
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { useTranslate } from 'src/locales';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import ZaityListView from 'src/sections/ZaityTables/zaity-list-view';
import ZaityHeadContainer from 'src/sections/ZaityTables/ZaityHeadContainer';
import ZaityTableFilters from 'src/sections/ZaityTables/ZaityTableFilters';
import ZaityTableTabs from 'src/sections/ZaityTables/ZaityTableTabs'; // [keep for later use]
import { fDate } from 'src/utils/format-time';
import showError from 'src/utils/show_error';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFUpload } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { LoadingScreen } from 'src/components/loading-screen';




// ----------------------------------------------------------------------



export function MarkAsCompletedForm({ setTableData, maintenanceId, close }) {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslate();

    const NewUserSchema = Yup.object().shape({
        invoice: Yup.mixed().nullable()
    });

    const defaultValues = useMemo(
        () => ({
            invoice: ''
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(NewUserSchema),
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

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = new FormData();
            if (Array.isArray(data.invoice)) {
                data.invoice.forEach((file) => {
                    formData.append("invoice[]", file);
                });
            } else {
                formData.append("invoice[]", data.invoice);
            }

            const response = await markMaintenanceAsCompeleted(maintenanceId, formData);
            enqueueSnackbar(t("operation_success"), { variant: 'success' });
            setTableData(prev =>
                prev.map(c =>
                    c.id == maintenanceId
                        ? {
                            ...c,
                            status: {
                                key: "completed",
                                translations: [{ name: t("completed") }],
                            },
                            condition:t("completed"),
                            color:"success",
                        }
                        :
                        c
                )
            );
            close();
        } catch (error) {
            showError(error)
        }
    });





    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid xs={12} md={12}>
                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        p={4}
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(1, 1fr)',
                        }}
                    >
                        <RHFUpload multiple name="invoice" lable={"Upload Invoice File"} accept={".jpg,.jpeg,.png,.pdf,.doc,.docx"} />

                    </Box>
                    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            {t("submit")}
                        </LoadingButton>
                    </Stack>
                </Grid>
            </Grid>
        </FormProvider>
    )
}