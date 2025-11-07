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
import { useLocales, useTranslate } from 'src/locales';
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
import { useGetProducts } from 'src/api/product';
import { updateOrder, useGetOrders, useGetOrdersByProduct } from 'src/api/orders';
import ExportOrdersButton from './ExportOrdersButton';




// ----------------------------------------------------------------------


export default function OrdersListView({ product_id }) {
    // Call hooks unconditionally at the top level
    const { orders: ordersByProduct, ordersLoading: loadingByProduct } = useGetOrdersByProduct(product_id);
    const { orders: allOrders, ordersLoading: loadingAll } = useGetOrders();

    // Use the appropriate data based on product_id
    const orders = product_id ? ordersByProduct : allOrders;
    const ordersLoading = product_id ? loadingByProduct : loadingAll;

    const { currentLang } = useLocales()

    const [tableData, setTableData] = useState([]);
    const [dataFiltered, setDataFiltered] = useState([]);

    let TABLE_HEAD = [
        { id: 'name', label: t('name'), type: "text", width: 180 },
        { id: 'phone', label: t('phone'), type: "text", width: 140 },
        { id: 'quantity', label: t('quantity'), type: "text", width: 60 },
        { id: 'product', label: t('product'), type: "text", width: 140 },
        // { id: 'birth_date', label: t('birth_date'), type: "text", width: 140 },
        // { id: 'real_price', label: t('real_price'), type: "text", width: 140 },
        // { id: 'sale_price', label: t('sale_price'), type: "text", width: 100 },
        { id: 'c_status', label: t('status'), type: "label", width: 100 },
        { id: 'full_address', label: t('address'), type: "long_text", length: 2, width: 200 },
        { id: 'actions', label: t('actions'), type: "threeDots", component: (item) => <ElementActions item={item} setTableData={setTableData} />, width: 60, align: "right" },
    ]


    const RformulateTable = (data) => {
        return data?.map((item) => {
            let color = "default";
            let translatedStatus = "";

            // Apply status conditions: pending, confirmed, shipped, delivered, cancelled
            if (item?.status === "delivered") {
                color = "success";
                translatedStatus = t("delivered");
            } else if (item?.status === "shipped") {
                color = "info";
                translatedStatus = t("shipped");
            } else if (item?.status === "confirmed") {
                color = "secondary";
                translatedStatus = t("confirmed");
            } else if (item?.status === "pending") {
                color = "warning";
                translatedStatus = t("pending");
            } else if (item?.status === "cancelled") {
                color = "error";
                translatedStatus = t("cancelled");
            }

            return {
                ...item,
                name: item?.customer?.full_name,
                phone: item?.customer?.phone,
                product: item?.product?.name,
                c_status: translatedStatus,
                full_address: currentLang?.value == "ar" ? item?.address?.wilaya?.name_ar + ", " + item?.address?.commune?.name_ar + " " + item?.address?.street_address : item?.address?.wilaya?.name + " " + item?.address?.commune?.name + " " + item?.address?.street_address,
                color,
            };
        }) || [];
    };


    const filters = [
        {
            key: 'search', label: t('search'), match: (item, value) =>
                item?.customer?.full_name?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.customer?.first_name?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.customer?.last_name?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.customer?.phone?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.product?.name?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.address?.street_address?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.address?.commune?.name?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.address?.commune?.name_ar?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.address?.wilaya?.name?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.address?.wilaya?.name_ar?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.address?.full_address?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.id?.toString().includes(value) ||
                item?.notes?.toLowerCase().includes(value?.toLowerCase()),
        },
    ];

    const defaultFilters = {
        search: '',
    };

    // Filter by status (pending, confirmed, shipped, delivered, cancelled)
    const items = [
        { key: 'all', label: t('all'), match: () => true },
        { key: 'pending', label: t('pending'), match: (item) => item?.status === 'pending', color: 'warning' },
        { key: 'confirmed', label: t('confirmed'), match: (item) => item?.status === 'confirmed', color: 'secondary' },
        { key: 'shipped', label: t('shipped'), match: (item) => item?.status === 'shipped', color: 'info' },
        { key: 'delivered', label: t('delivered'), match: (item) => item?.status === 'delivered', color: 'success' },
        { key: 'cancelled', label: t('cancelled'), match: (item) => item?.status === 'cancelled', color: 'error' },
    ];

    const filterFunction = (data, filters) => {
        const activeTab = filters.tabKey;
        const item = tableData.find(i => i?.key === activeTab);
        if (item?.match) return data.filter((d) => item.match(d, filters));
        return data;
    }




    useEffect(() => {
        setDataFiltered(RformulateTable(orders));
    }, [orders]);
    useEffect(() => {
        setTableData(RformulateTable(orders));
    }, [orders]);

    return (
        <>
            <ZaityHeadContainer
                heading={t("ordersList")}
                action={<ExportOrdersButton orders={orders} />}
                links={[
                    { name: t('dashboard'), href: paths.dashboard.root },
                    { name: t("ordersList"), href: paths.dashboard.order.root },
                    { name: t('list') },
                ]}
            >
                <Card>
                    <ZaityTableTabs key='condition' data={tableData} items={items} defaultFilters={defaultFilters} setTableDate={setDataFiltered} filterFunction={filterFunction}>
                        {/* <ZaityTableTabs key='attachable_type' data={tableData} items={items2} defaultFilters={defaultFilters} setTableDate={setDataFiltered} filterFunction={filterFunction}> */}
                        <ZaityTableFilters data={dataFiltered} tableData={tableData} setTableDate={setDataFiltered} items={filters} defaultFilters={defaultFilters} dataFiltered={tableData} searchText={t("search_by") + " " + t("name") + " " + t("or_any_value") + " ..."}  >
                            {
                                ordersLoading ?
                                    <LoadingScreen sx={{ my: 8 }} color='primary' />
                                    :
                                    <ZaityListView TABLE_HEAD={[...TABLE_HEAD]} dense="medium" zaityTableDate={dataFiltered || []} onSelectedRows={({ data, setTableData }) => { return <onSelectedRowsComponent configurable_type={"roles"} setTableData={setTableData} data={orders} /> }} />
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
    const loading = useBoolean();

    const [postloader, setPostloader] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState(null)

    // Define all possible statuses with their colors and icons
    const statuses = [
        { key: 'pending', label: t('pending'), color: 'warning', icon: 'solar:clock-circle-bold' },
        { key: 'confirmed', label: t('confirmed'), color: 'secondary', icon: 'solar:check-circle-bold' },
        { key: 'shipped', label: t('shipped'), color: 'info', icon: 'solar:box-bold' },
        { key: 'delivered', label: t('delivered'), color: 'success', icon: 'solar:verified-check-bold' },
        { key: 'cancelled', label: t('cancelled'), color: 'error', icon: 'solar:close-circle-bold' },
    ];

    const handleStatusClick = (status) => {
        setSelectedStatus(status);
        popover.onClose();
        confirm.onTrue();
    };

    const onChangeStatus = useCallback(
        async () => {
            if (!selectedStatus) return;

            setPostloader(true)
            try {
                loading.onTrue()
                // TODO: Implement API call to update order status
                console.log("item : ", item)
                await updateOrder(item.product_id, item.id, { status: selectedStatus.key })
                // const res = await updateOrderStatus(item?.id, selectedStatus.key);
                console.log("Changing order status:", { orderId: item?.id, newStatus: selectedStatus.key });

                // Update table data optimistically
                setTableData(prev => prev?.map(order =>
                    order.id == item?.id ? { ...order, status: selectedStatus.key, color: selectedStatus?.color, c_status: t(selectedStatus.key) } : order
                ))

                enqueueSnackbar(t("operation_success"));
                confirm.onFalse();
                loading.onFalse()
                setPostloader(false)
                setSelectedStatus(null)
            } catch (error) {
                console.log("ersetSelectedStatus setSelectedStatus setSelectedStatus ror : ", error);
                setPostloader(false)
                loading.onFalse()
                showError(error.error)
            }
        },
        [loading, confirm, setTableData, selectedStatus, item?.id]
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
                sx={{ width: 220 }}
            >
                {statuses
                    .filter(status => status.key !== item?.status) // Don't show current status
                    .map((status) => (
                        <MenuItem
                            key={status.key}
                            onClick={() => handleStatusClick(status)}
                            disabled={postloader}
                            sx={{
                                color: `${status.color}.main`,
                                '&:hover': {
                                    backgroundColor: `${status.color}.lighter`,
                                }
                            }}
                        >
                            <Iconify icon={status.icon} sx={{ mr: 1 }} />
                            {t('change_to')} {status.label}
                        </MenuItem>
                    ))}
            </CustomPopover>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title={t("change_status")}
                content={t('confirm_status_change', {
                    order: `#${item?.id}`,
                    status: selectedStatus?.label || ''
                })}
                action={
                    <LoadingButton
                        loading={postloader}
                        variant="contained"
                        color={selectedStatus?.color || 'primary'}
                        onClick={onChangeStatus}
                    >
                        {t("confirm")}
                    </LoadingButton>
                }
            />
        </Box>
    );
};




