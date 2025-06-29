
import { LoadingButton } from '@mui/lab';
import { IconButton, MenuItem } from '@mui/material';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import React, { useCallback, useState } from 'react'
import { AddCarToMentainance, markCarAsAvailable } from 'src/api/car';
import { useGetMaintenance } from 'src/api/maintainance';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover'
import Iconify from 'src/components/iconify';
import Label from 'src/components/label'
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

const ChangeCarStatus = ({ car, setCarDetails }) => {
    const { maintenance } = useGetMaintenance()
    console.log("car : ", car)
    const maintenance_id = maintenance?.find(i => i?.car_id == car?.id)?.id
    console.log("maintenance : ", maintenance)
    const popover = usePopover();
    const confirm = useBoolean();
    const confirm2 = useBoolean();

    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const onAddCarToMentainance = useCallback(
        async (id) => {
            setLoading(true)
            const result = await AddCarToMentainance(id)
                .then(() => {

                    // status: {
                    //     key: 'under_maintenance',
                    //     translations: { name: t("under_maintenance") }
                    setCarDetails(prev => (
                        {
                            ...prev, status: {
                                key: 'under_maintenance',
                                translations: { name: t("under_maintenance") }
                            }
                        }
                    ))

                    enqueueSnackbar(t('operation_success'));
                    setLoading(false)
                })
                .catch((err) => {
                    showError(err)
                    setLoading(false)
                });
            setLoading(false)
        },
        [enqueueSnackbar]
    );

    const onMarkCarAsAvailable = useCallback(
        async (id) => {
            try {
                const result = await markCarAsAvailable(id)
                    .then(() => {

                        setCarDetails(prev => (
                            {
                                ...prev, status: {
                                    key: 'available',
                                    translations: { name: t("available") }
                                }
                            }
                        ))

                        enqueueSnackbar(t('operation_success'));
                    })
            } catch (err) {
                showError(err)
            }
        },
        [enqueueSnackbar] // Add t to the dependency array
    );

    return (
        <>
            <Label
               
                variant="soft"
                color={
                    (car?.status?.key === 'available' && 'success') ||
                    (car?.status?.key === 'pending' && 'warning') ||
                    (car?.status?.key === 'under_maintenance' && 'error') ||
                    (car?.status?.key === 'under_preparation' && 'secondary') ||
                    'default'
                }
            >
                {car?.status?.translations?.name}
            </Label>
                <IconButton  onClick={popover.onOpen} >
                    <Iconify icon="eva:more-vertical-fill" />
                </IconButton>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 200 }}
            >
                {car?.status.key == "under_maintenance" && maintenance_id ?
                    <MenuItem
                        onClick={() => {
                            router.push(paths.dashboard.maintenance.details(maintenance_id))
                        }}
                    >
                        <Iconify icon="map:car-repair" />
                        {t('view_maintenance')}
                    </MenuItem>
                    :
                    null
                }
                {car?.status.key != "under_maintenance" ?
                    <MenuItem
                        onClick={() => {
                            // onAddCarToMentainance(item?.id);
                            confirm.onTrue()
                            popover.onClose();
                        }}
                    >
                        <Iconify icon="map:car-repair" />
                        {t('addToMaintenance')}
                    </MenuItem>
                    :
                    null
                }
                {car?.status.key == "under_preparation" ?
                    <MenuItem
                        onClick={() => {
                            confirm2.onTrue()
                            popover.onClose();
                        }}
                    // disabled={status?.key !== 'under_preparation'}
                    >
                        <Iconify icon="solar:clipboard-check-bold-duotone" />
                        {t('markAsAvailable')}
                    </MenuItem>
                    :
                    null
                }
            </CustomPopover>
            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title={t('addToMaintenance')}
                content={t('are_you_sure')}
                action={
                    <LoadingButton
                        loading={loading}
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            onAddCarToMentainance(car?.id);
                            confirm.onFalse();
                        }}
                    >
                        {t('submit')}
                    </LoadingButton>
                }
            />
            <ConfirmDialog
                open={confirm2.value}
                onClose={confirm2.onFalse}
                title={t('markAsAvailable')}
                content={t('are_you_sure')}
                action={
                    <LoadingButton
                        loading={loading}
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            onMarkCarAsAvailable(car?.id);
                            confirm.onFalse();
                        }}
                    >
                        {t('submit')}
                    </LoadingButton>
                }
            />
        </>
    )
}

export default ChangeCarStatus