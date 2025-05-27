import { Box, Button, Card, FormControlLabel, FormGroup, IconButton, MenuItem, Stack, Switch, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { set } from 'lodash'; // [keep for later use]
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
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
import { CloseClaim } from './CloseClaim';
import { ViewClaim } from './ViewClaim';

// ----------------------------------------------------------------------


export default function ContractClaimsListView({ data }) {
    // const { users } = useUsers();
    // const users = [
    //     { id: 1, name: "zaki", username: "zak-info", email: "zaki@gmail.com", phone_number: "075912431", role: "super admin" }
    // ]
    const [tableData, setTableData] = useState([]);
    const [dataFiltered, setDataFiltered] = useState([]);

    let TABLE_HEAD = [
        // { id: 'clausable', label: t('clause'), type: "two-lines-link", first: (row) => row?.clausable?.first, second: (row) => row?.clausable?.second, link: (row) => { return row?.clausable_type == "car" ? paths.dashboard.vehicle.details(row?.id) : paths.dashboard.drivers.details(row?.id) }, width: 140 },
        { id: 'amount', label: t('amount'), type: "text", width: 140 },
        { id: 'date', label: t('date'), type: "text", width: 140 },
        { id: 'payment_date', label: t('paiment_date'), type: "text", width: 140 },
        { id: 'gstatus', label: t('status'), type: "label", color: "error", width: 140 },
        { id: 'actions', label: t('actions'), type: "threeDots", component: (item) => <ElementActions item={item} setDataFiltered={setDataFiltered} />, width: 400, align: "right" },
    ]


    const defaultFilters = { status: 'all', name: "" };
    const items = [
        { key: 'all', label: t('all'), match: () => true },
        { key: 'paid_claim', label: t('paid_claim'), match: (item) => item?.gstatus == "paid_claim", color: 'primary' },
        { key: 'due_claim', label: t('due_claim'), match: (item) => item?.gstatus == "due_claim", color: 'warning' },
        // { key: 'replaced', label: t('replaced'), match: (item) => item?.gstatus == "replaced", color: 'secondary' },
    ];
    const filterFunction = (data, filters) => {
        const activeTab = filters.tabKey;
        const item = tableData.find(i => i?.key === activeTab);
        if (item?.match) return data.filter((d) => item.match(d, filters));
        return data;
    }

    const RformulateTable = (data = []) => {
        return data.map(item => {
            // let gstatus = "under_rent";
            // let statusLabel = t("under_rent");
            let color = "secondary";

            if (item?.status?.key == "paid_claim") {
                color = "success";
            } else if (item?.status?.key == "due_claim") {
                color = "warning";
            }

            return {
                ...item,
                // gstatus,
                // status: statusLabel,
                color,
            };
        });
    };

    useEffect(() => {
        setDataFiltered(RformulateTable(data));
    }, [data]);
    useEffect(() => {
        setTableData(RformulateTable(data));
    }, [data]);

    return (
        <>
            {/* <AddClause contract_id={data?.length >0 ? data[0]?.contract_id : 0} setTableData={setDataFiltered} /> */}
            <Card  >
                <ZaityTableTabs data={tableData} items={items} defaultFilters={{ gstatus: 'all' }} setTableDate={setDataFiltered} filterFunction={filterFunction}>
                    <ZaityListView TABLE_HEAD={[...TABLE_HEAD]} dense="medium" zaityTableDate={dataFiltered || []} onSelectedRows={({ data, setTableData }) => { return <onSelectedRowsComponent configurable_type={"roles"} setTableData={setTableData} data={data} /> }} />
                </ZaityTableTabs>
            </Card>
        </>
    );
}

// ----------------------------------------------------------------------




const ElementActions = ({ item, setDataFiltered }) => {
    const popover = usePopover();
    const confirm = useBoolean();
    const edit = useBoolean();
    const view = useBoolean();
    const replace = useBoolean();
    const cancle = useBoolean();
    const router = useRouter();
    const onViewRow = useCallback(
        (id) => {
            // router.push(paths.dashboard.user.edit(id));
        },
        [router]
    );
    const onDeleteRow = useCallback(
        async (id) => {
            console.log("hit here");
            // await deleteContractClause(id);
        }
    );
    const onBanRow = useCallback(
        async (id) => {
            await deleteContractClause(id);
        }
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

                <PermissionsContext action={"read.claim"} >
                    <MenuItem onClick={() => { view.onTrue(); popover.onClose() }}>
                        <Iconify icon="lets-icons:eye-fill" />
                        {t('view')}
                    </MenuItem>
                </PermissionsContext>
                {/* <PermissionsContext action={"update.claim"} >
                    <MenuItem onClick={() => { edit.onTrue(); popover.onClose() }}>
                        <Iconify icon="solar:pen-bold" />
                        {t('edit')}
                    </MenuItem>
                </PermissionsContext> */}
                <PermissionsContext action={"update.claim"} >
                    <MenuItem disabled={item?.status?.key == "paid_claim"} onClick={() => { replace.onTrue(); popover.onClose() }} >
                        <Iconify icon="duo-icons:folder-open" />
                        {t('close_claim')}
                    </MenuItem>
                </PermissionsContext>
                <PermissionsContext action={"delete.claim"} >
                    <MenuItem onClick={() => { confirm.onTrue(); popover.onClose() }} sx={{ color: 'error.main' }} >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        {t('delete')}
                    </MenuItem>
                </PermissionsContext>
                {/* <PermissionsContext action={"update.clause"} >
                    <MenuItem disabled={item?.cancelled_at  } onClick={() => {cancle.onTrue();popover.onClose()}} sx={{ color: 'warning.main' }} >
                        <Iconify icon="material-symbols-light:shield-locked-rounded" />
                        {t('cancle')}
                    </MenuItem>
                </PermissionsContext> */}
            </CustomPopover>


            <ContentDialog
                open={cancle.value}
                onClose={cancle.onFalse}
                title={t("cancle_clause")}
                content={
                    <>
                        {/* <CancleClause setDataFiltered={setDataFiltered} id={item?.id} close={() => { cancle.onFalse() }} /> */}
                    </>
                }
            />

            <ContentDialog
                open={view.value}
                maxWidth={"sm"}
                onClose={view.onFalse}
                title={t("")}
                content={
                    <ViewClaim claim={item} />
                }
            />
            <ContentDialog
                open={replace.value}
                onClose={replace.onFalse}
                title={t("")}
                content={
                    <CloseClaim claim_id={item?.id} setTableData={setDataFiltered} close={() => { replace?.onFalse() }} />
                }
            />

            <ContentDialog
                open={edit.value}
                onClose={edit.onFalse}
                title={t("cancle_clause")}
                content={
                    <>
                        {/* <AddClauseForm setTableData={setDataFiltered} currentClause={item}  close={() => { edit.onFalse() }} /> */}
                    </>
                }
            />
            {/* <ContentDialog
                maxWidth={"md"}
                open={replace.value}
                onClose={replace.onFalse}
                title={t("replace_clause")}
                content={
                    <>
                        <ReplaceClause item={item} id={item?.id} close={() => { replace.onFalse() }} />
                    </>
                }
            /> */}

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title={t("delete")}
                content={t("are_you_sure_want_to_delete")}
                action={
                    <Button variant="contained" color="error" onClick={() => onDeleteRow(item?.id)}>
                        {t("delete")}
                    </Button>
                }
            />

        </Box>
    );
};


