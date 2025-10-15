import { Box, Button, Card, FormControlLabel, FormGroup, Grid, IconButton, MenuItem, Stack, Switch, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { set } from 'lodash'; // [keep for later use]
import { enqueueSnackbar, useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { AddCarToMentainance, deleteCar, markCarAsAvailable, useGetCar } from 'src/api/car';
import { useGetClauses } from 'src/api/claim';
import { useGetClients } from 'src/api/client';
import { deleteContractClause, useGetContracts } from 'src/api/contract';
import { markMaintenanceAsCompeleted, useGetMaintenance } from 'src/api/maintainance';
import { changeItemVisibilityInSettings, useGetMainSpecs, useGetSystemVisibleItem } from 'src/api/settings'; // [keep for later use]
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
import { deleteDocument, useGetDocuments } from 'src/api/document';
import { deleteDriver, useGetDrivers } from 'src/api/drivers';
import { secondary } from 'src/theme/palette';
import { color } from 'framer-motion';
import { LoadingScreen } from 'src/components/loading-screen';
import { useGetProducts, deployProduct } from 'src/api/product';
import Label from 'src/components/label';




// ----------------------------------------------------------------------


export default function ProductsListView({ }) {

    const { products, productsLoading } = useGetProducts()


    const [tableData, setTableData] = useState([]);
    const [dataFiltered, setDataFiltered] = useState([]);

    let TABLE_HEAD = [
        { id: 'name', label: t('name'), type: "two-lines-link", first: (row) => { return row?.name }, second: (row) => { return row?.phone_number }, link: (row) => { return paths.dashboard.drivers.details(row.id) }, width: 180 },
        // { id: 'phone_number', label: t('phone_number'), type: "text", width: 140 },
        { id: 'quantity', label: t('quantity'), type: "text", width: 140 },
        // { id: 'birth_date', label: t('birth_date'), type: "text", width: 140 },
        { id: 'real_price', label: t('real_price'), type: "text", width: 140 },
        { id: 'sale_price', label: t('sale_price'), type: "text", width: 100 },
        { id: 'orders', label: t('orders'), type: "render", render: (item) => <OrdersDropdown item={item} />, width: 220 },
        { id: 'c_status', label: t('status'), type: "label", width: 140 },
        { id: 'actions', label: t('actions'), type: "threeDots", component: (item) => <ElementActions item={item} setTableData={setTableData} />, width: 200, align: "right" },
    ]


    const RformulateTable = (data) => {
        return data?.map((item) => {
            let color = "default";
            
            // Apply status conditions: deployed, processing, draft, failed
            if (item?.status === "deployed") {
                color = "success";
            } else if (item?.status === "processing") {
                color = "warning";
            } else if (item?.status === "draft") {
                color = "default";
            } else if (item?.status === "failed") {
                color = "error";
            }

            return {
                ...item,
                c_status: t(item?.status),
                color,
                // car_model: vData?.car_companies?.flatMap(i => i.models)?.find(i => i.id == item?.car?.car_model_id)?.translations[0]?.name,

            };
        }) || [];
    };


    const filters = [
        {
            key: 'name', label: t('name'), match: (item, value) =>
                item?.name?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.phonenumber?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.gender?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.residence_permit_number?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.d_nationality?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.car?.plat_number?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.car_model?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.contract?.ref?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.d_state?.toLowerCase().includes(value?.toLowerCase()),
        },
    ];

    const defaultFilters = {
        name: '',
    };

    // Filter by status (draft, processing, deployed, failed)

    const items = [
        { key: 'all', label: t('all'), match: () => true },
        { key: 'deployed', label: t('deployed'), match: (item) => !item?.status == "deployed", color: 'success' },
        { key: 'processing', label: t('processing'), match: (item) => item?.status == "processing", color: 'warning' },
        { key: 'draft', label: t('draft'), match: (item) => item?.status == "draft", color: 'default' },
        { key: 'failed', label: t('not_enabled'), match: (item) => item?.status == "failed", color: 'error' },
    ];

    const filterFunction = (data, filters) => {
        const activeTab = filters.tabKey;
        const item = tableData.find(i => i?.key === activeTab);
        if (item?.match) return data.filter((d) => item.match(d, filters));
        return data;
    }




    useEffect(() => {
        setDataFiltered(RformulateTable(products));
    }, [products]);
    useEffect(() => {
        setTableData(RformulateTable(products));
    }, [products]);

    return (
        <>
            <ZaityHeadContainer
                heading={t("productsList")}
                action={
                    <Button
                        component={RouterLink}
                        href={paths.dashboard.product.new}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        {t("addNewProduct")}
                    </Button>
                }
                links={[
                    { name: t('dashboard'), href: paths.dashboard.root },
                    { name: t("productsList"), href: paths.dashboard.product.root },
                    { name: t('list') },
                ]}
            >
                <Card>
                    <ZaityTableTabs key='condition' data={tableData} items={items} defaultFilters={defaultFilters} setTableDate={setDataFiltered} filterFunction={filterFunction}>
                        {/* <ZaityTableTabs key='attachable_type' data={tableData} items={items2} defaultFilters={defaultFilters} setTableDate={setDataFiltered} filterFunction={filterFunction}> */}
                        <ZaityTableFilters data={dataFiltered} tableData={tableData} setTableDate={setDataFiltered} items={filters} defaultFilters={defaultFilters} dataFiltered={tableData} searchText={t("search_by") + " " + t("name") + " " + t("or_any_value") + " ..."}  >
                            {
                                productsLoading ?
                                    <LoadingScreen sx={{ my: 8 }} color='primary' />
                                    :
                                    <ZaityListView TABLE_HEAD={[...TABLE_HEAD]} dense="medium" zaityTableDate={dataFiltered || []} onSelectedRows={({ data, setTableData }) => { return <onSelectedRowsComponent configurable_type={"roles"} setTableData={setTableData} data={products} /> }} />
                            }
                        </ZaityTableFilters>
                        {/* </ZaityTableTabs> */}
                    </ZaityTableTabs>
                </Card>
            </ZaityHeadContainer>
        </>
    );
}

// ----------------------------------------------------------------------



const ElementActions = ({ item, setTableData }) => {
    const popover = usePopover();
    const confirm = useBoolean();
    const ban = useBoolean();
    const completed = useBoolean();
    const loading = useBoolean();
    const deployConfirm = useBoolean();
    const router = useRouter();

    const [postloader, setPostloader] = useState(false)
    const [deployLoader, setDeployLoader] = useState(false)




    const onEditRow = useCallback(
        (id) => {
            router.push(paths.dashboard.drivers.edit(id));
        },
        [router]
    );

    const onDeleteRow = useCallback(
        async (id) => {
            setPostloader(true)
            console.log("id : ", id);
            try {
                loading.onTrue()
                const res = await deleteDriver(id);
                console.log("res : ", res);
                setTableData(prev => prev?.filter(i => i.id != id))
                enqueueSnackbar(t("operation_success"));
                confirm.onFalse();
                loading.onFalse()
                setPostloader(false)
            } catch (error) {
                console.log("error : ", error);
                setPostloader(false)
                loading.onFalse()
                showError(error)
            }
        }
    );



    const copyToClipboard = () => {
        navigator.clipboard.writeText(item?.product_url)
            .then(() => {
                enqueueSnackbar(t("operation_success"));
            })
            .catch(err => {
                showError(err)
            });
    }

    const onDeployProduct = useCallback(
        async (id) => {
            setDeployLoader(true)
            try {
                const res = await deployProduct(id);
                console.log("deploy res : ", res);
                // Update the item status in the table
                setTableData(prev => prev?.map(i => i.id === id ? {...i, status: 'deployed', color: 'success', c_status: t('deployed')} : i))
                enqueueSnackbar(t("operation_success"));
                deployConfirm.onFalse();
                setDeployLoader(false)
            } catch (error) {
                console.log("error : ", error);
                setDeployLoader(false)
                showError(error)
            }
        },
        [setTableData, deployConfirm]
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


                <MenuItem
                    onClick={() => {
                        router.push(paths.dashboard.product.details(item?.id));
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:eye-bold" />
                    {t('overview')}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        router.push(paths.dashboard.product.orders(item?.id));
                        popover.onClose();
                    }}
                >
                    <Iconify icon="hugeicons:product-loading" />
                    {t('see_orders')}
                </MenuItem>
                <MenuItem
                    onClick={(e) => {
                        router.push(paths.dashboard.product.edit(item?.id));
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    {t('edit')}
                </MenuItem>
                <MenuItem
                    onClick={(e) => {
                        copyToClipboard();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:copy-bold-duotone" />
                    {t('copy_link')}
                </MenuItem>
                {item?.status === 'processing' && (
                    <MenuItem
                        onClick={(e) => {
                            deployConfirm.onTrue();
                            popover.onClose();
                        }}
                        sx={{ color: 'warning.main' }}
                    >
                        <Iconify icon="solar:upload-bold" />
                        {t('deploy')}
                    </MenuItem>
                )}
            </CustomPopover>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title={t("delete")}
                content={t('are_u_sure_to_delete', { item: t("driver"), item2: item?.name })}
                action={
                    <LoadingButton
                        isSubmitting={postloader}
                        loading={postloader}
                        variant="contained"
                        color="error"
                        onClick={() => {
                            onDeleteRow(item?.id);
                        }}
                    >
                        {t("delete")}
                    </LoadingButton>
                }
            />

            <ConfirmDialog
                open={deployConfirm.value}
                onClose={deployConfirm.onFalse}
                title={t("deploy")}
                content={t('are_you_sure_you_want_to_deploy_this_product')}
                action={
                    <LoadingButton
                        isSubmitting={deployLoader}
                        loading={deployLoader}
                        variant="contained"
                        color="warning"
                        onClick={() => {
                            onDeployProduct(item?.id);
                        }}
                    >
                        {t("deploy")}
                    </LoadingButton>
                }
            />
        </Box>
    );
};


// ----------------------------------------------------------------------

const OrdersDropdown = ({ item }) => {
    const popover = usePopover();
    const { t } = useTranslate();

    // Get orders data from the product item
    const orders = item?.orders_count || {};

    // Calculate total orders
    const totalOrders = orders?.all_orders || 0;

    // Define order status types with their translations and colors
    const orderStatuses = [
        { key: 'all_orders', label: 'all', color: 'default' },
        { key: 'pending', label: 'pending', color: 'warning' },
        { key: 'completed', label: 'completed', color: 'success' },
        { key: 'shipped', label: 'shipped', color: 'secondary' },
        { key: 'delivered', label: 'delivered', color: 'info' },
        { key: 'cancelled', label: 'cancelled', color: 'error' },
    ];

    return (
        <>
            <Button
                size="small"
                variant="soft"
                color="success"
                endIcon={<Iconify icon={popover.open ? 'eva:arrow-up-fill' : 'eva:arrow-down-fill'} />}
                onClick={popover.onOpen}
                sx={{
                    fontWeight: 600,
                    justifyContent: 'flex-start',
                    '&:hover': { backgroundColor: 'action.hover' }
                }}
            >
                {totalOrders} {t('orders')}
            </Button>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="left-top"
                sx={{ width: 220, p: 0 }}
            >
                <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ px: 1, py: 0.75, color: 'text.secondary' }}>
                        {t('order_status')}
                    </Typography>
                    <Stack spacing={0.5}>
                        {orderStatuses.map((status) => {
                            const count = orders[status.key] || 0;
                            return (
                                <Box
                                    key={status.key}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        px: 1.5,
                                        py: 0.75,
                                        borderRadius: 0.75,
                                        '&:hover': { backgroundColor: 'action.hover' }
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {t(status.label)}
                                    </Typography>
                                    <Label
                                        sx={{
                                            minWidth: 28,
                                            height: 22,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 0.75,
                                            // backgroundColor: `${status.color}.lighter`,
                                            // color: `${status.color}.darker`,
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            px: 0.75
                                        }}
                                        color={status.color}
                                        variant={"soft"}
                                    >
                                        {count}
                                    </Label>
                                </Box>
                            );
                        })}
                    </Stack>
                </Box>
            </CustomPopover>
        </>
    );
};


