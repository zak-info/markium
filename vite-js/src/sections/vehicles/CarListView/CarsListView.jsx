import { Box, Button, Card, FormControlLabel, FormGroup, IconButton, MenuItem, Switch, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { set } from 'lodash'; // [keep for later use]
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { AddCarToMentainance, markCarAsAvailable, useGetCar } from 'src/api/car';
import { useGetClients } from 'src/api/client';
import { useGetContracts } from 'src/api/contract';
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
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import ZaityListView from 'src/sections/ZaityTables/zaity-list-view';
import ZaityHeadContainer from 'src/sections/ZaityTables/ZaityHeadContainer';
import ZaityTableFilters from 'src/sections/ZaityTables/ZaityTableFilters';
import ZaityTableTabs from 'src/sections/ZaityTables/ZaityTableTabs'; // [keep for later use]

// ----------------------------------------------------------------------


export default function CarsListView({ }) {
    const { car } = useGetCar();
    const { contracts } = useGetContracts()
    const { clients } = useGetClients()

    const [tableData, setTableData] = useState([]);
    const [dataFiltered, setDataFiltered] = useState([]);

    let TABLE_HEAD = [
        // { id: 'plat_number', label: t('plateNumber'), type: "text", width: 120 },
        { id: 'plat_number', label: t('plateNumber'), type: "two-lines-link", first: (row) => row?.plat_number, second: (row) => row?.model?.company?.translations?.name, link: (row) => { return paths.dashboard.vehicle.details(row?.id) }, width: 140 },
        { id: 'model', label: t('model'), type: "two-lines-link", first: (row) => row?.model?.translations?.name, second: (row) => row?.model?.company?.translations?.name, link: (row) => { return paths.dashboard.vehicle.details(row?.id) }, width: 140 },
        { id: 'production_year', label: t('manufacturingYear'), type: "text", width: 100 },
        { id: 'c_driver', label: t('driver'), type: "long_text", length: 3, width: 200 },
        // { id: 'driver', label: t('driver'), type: "text", width: 140 },
        { id: 'condition', label: t('status'), type: "label", width: 140 },
        { id: 'company', label: t('client'), type: "text", width: 140 },
        { id: 'ref', label: t('contract'), type: "text", width: 140 },
        { id: 'actions', label: t('actions'), type: "threeDots", component: (item) => <ElementActions item={item} />, width: 400, align: "right" },
    ]



    const defaultFilters = { condition: 'all', name: "" };
    const items = [
        { key: 'all', label: t('all'), match: () => true },
        { key: 'available', label: t('available'), match: (item) => item?.status?.key == "available", color: 'primary' },
        { key: 'under_maintenance', label: t('under_maintenance'), match: (item) => item?.status?.key == "under_maintenance", color: 'error' },
        { key: 'under_preparation', label: t('under_preparation'), match: (item) => item?.status?.key == "under_preparation", color: 'secondary' },
        { key: 'rented', label: t('rented'), match: (item) => item?.status?.key == "rented", color: 'warning' },
    ];
    const filterFunction = (data, filters) => {
        const activeTab = filters.tabKey;
        const item = tableData.find(i => i?.key === activeTab);
        if (item?.match) return data.filter((d) => item.match(d, filters));
        return data;
    }

    const RformulateTable = (data) => {
        return data?.map((item) => {
            const statusKey = item?.status?.key;
            const statusName = item?.status?.translations?.name || "--";
            const contract = contracts.find((contract) =>contract?.clauses?.some((clause) =>clause.clauseable_type === "car" &&clause.clauseable_id === item?.id));
            const company = clients?.find((c) => c.id === contract?.company_id);
            let condition;
            if (statusKey === "rented") {
                condition = statusName;
            } else if (item?.contract?.ref && statusKey !== "rented") {
                condition = `${statusName} / ${t("rented")}`;
            } else {
                condition = statusName;
            }
            const color = statusKey === "available" ? "success" : statusKey === "under_maintenance" ? "error" : statusKey === "under_preparation" ? "secondary" : "warning";
            return {
                ...item,
                color,
                condition,
                c_driver: item?.driver?.id ? item.driver.name : "--",
                contract,
                ref: contract?.ref || "--",
                company: company?.name || "--",
            };
        }) || [];
    };


    useEffect(() => {
        setDataFiltered(RformulateTable(car));
    }, [car]);
    useEffect(() => {
        setTableData(RformulateTable(car));
    }, [car]);

    return (
        <>
            <ZaityHeadContainer
                heading={t("vehiclesList")}
                action={
                    <PermissionsContext action={"create.car"} >
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.vehicle.new}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            {t("addVehicle")}
                        </Button>
                    </PermissionsContext>
                }
                links={[
                    { name: t('dashboard'), href: paths.dashboard.root },
                    { name: t("vehicles"), href: paths.dashboard.vehicle.new },
                    { name: t('list') },
                ]}
            >
                <Card>
                    <ZaityTableTabs key='condition' data={tableData} items={items} defaultFilters={defaultFilters} setTableDate={setDataFiltered} filterFunction={filterFunction}>
                        <ZaityTableFilters defaultFilters={defaultFilters} dataFiltered={tableData}>
                            <ZaityListView TABLE_HEAD={[...TABLE_HEAD]} dense="medium" zaityTableDate={dataFiltered || []} onSelectedRows={({ data, setTableData }) => { return <onSelectedRowsComponent configurable_type={"roles"} setTableData={setTableData} data={car} /> }} />
                        </ZaityTableFilters>
                    </ZaityTableTabs>
                </Card>
            </ZaityHeadContainer>
        </>
    );
}

// ----------------------------------------------------------------------



const ElementActions = ({ item }) => {
    const popover = usePopover();
    const confirm = useBoolean();
    const ban = useBoolean();
    const completed = useBoolean();
    const router = useRouter();
    const onViewRow = useCallback(
        (id) => {
            router.push(paths.dashboard.vehicle.details(id));
        },
        [router]
    );
    const handleViewDriverRow = useCallback(
        (id) => {
            router.push(paths.dashboard.drivers.details(id));
        },
        [router]
    );
    const handleViewContractRow = useCallback(
        (id) => {
            router.push(paths.dashboard.clients.contractsDetails(id));
        },
        [router]
    );

    const handleViewCompanyRow = useCallback(
        (id) => {
            router.push(paths.dashboard.clients.details(id));
        },
        [router]
    );

    const onEditRow = useCallback(
        (id) => {
            router.push(paths.dashboard.vehicle.edit(id));
        },
        [router]
    );


    const onAddCarToMentainance = useCallback(
        async (id) => {
            const result = await AddCarToMentainance(id)
                .then(() => {
                    enqueueSnackbar(t('operation_success'));
                    "Operation success"
                    // mutate();
                })
                .catch((err) => {
                    enqueueSnackbar(err?.message, { variant: 'error' });
                });
            console.log("result : ", result);
        },
        [enqueueSnackbar]
    );

    const onMarkCarAsAvailable = useCallback(
        async (id) => {
            const result = await markCarAsAvailable(id)
                .then(() => {
                    enqueueSnackbar(t('operation_success'));
                    //   mutate();
                })
                .catch((err) => {
                    enqueueSnackbar(err?.message, { variant: 'error' });
                });
            console.log("result : ", result);
        },
        [enqueueSnackbar]
    );
    return (
        <Box display={"flex"} rowGap={"10px"} sx={{ gap: '10px' }} >

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
            </IconButton>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 200 }}
            >
                <PermissionsContext action={'delete.car'}>
                    <MenuItem
                        onClick={() => {
                            confirm.onTrue();
                            popover.onClose();
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        {t('delete')}
                    </MenuItem>
                </PermissionsContext>
                <PermissionsContext action={'update.car'}>
                    <MenuItem
                        onClick={() => {
                            onEditRow(item?.id);
                            popover.onClose();
                        }}
                    >
                        <Iconify icon="solar:pen-bold" />
                        {t('edit')}
                    </MenuItem>
                </PermissionsContext>

                <MenuItem
                    onClick={() => {
                        onViewRow(item?.id);
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:eye-bold" />
                    {t('view')}
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        onAddCarToMentainance(item?.id);
                        popover.onClose();
                    }}
                >
                    <Iconify icon="map:car-repair" />
                    {t('addToMaintenance')}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onMarkCarAsAvailable(item?.id);
                        popover.onClose();
                    }}
                    disabled={status?.key !== 'under_preparation'}
                >
                    <Iconify icon="solar:clipboard-check-bold-duotone" />
                    {t('markAsAvailable')}
                </MenuItem>
            </CustomPopover>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title={t('delete')}
                content={t('deleteConfirm')}
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            onDeleteRow();
                            confirm.onFalse();
                        }}
                    >
                        {t('delete')}
                    </Button>
                }
            />
        </Box>
    );
};


