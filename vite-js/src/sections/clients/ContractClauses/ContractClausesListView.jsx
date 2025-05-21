import { Box, Button, Card, FormControlLabel, FormGroup, IconButton, MenuItem, Switch, Tooltip, Typography } from '@mui/material';
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

// ----------------------------------------------------------------------


export default function ContractClausesListView({ data }) {
    // const { users } = useUsers();
    // const users = [
    //     { id: 1, name: "zaki", username: "zak-info", email: "zaki@gmail.com", phone_number: "075912431", role: "super admin" }
    // ]
    const [tableData, setTableData] = useState([]);
    const [dataFiltered, setDataFiltered] = useState([]);

    let TABLE_HEAD = [
        { id: 'clausable', label: t('clause'), type: "two-lines-link", first: (row) => row?.clausable?.first, second: (row) => row?.clausable?.second, link: (row) => { return paths.dashboard.vehicle.details(row?.id) }, width: 140 },
        { id: 'cost', label: t('cost'), type: "text", width: 140 },
        { id: 'total_cost', label: t('total'), type: "text", width: 140 },
        { id: 'status', label: t('status'), type: "label", color: "error", width: 140 },
        { id: 'start_date', label: t('start_date'), type: "text", width: 140 },
        { id: 'end_date', label: t('end_date'), type: "text", width: 140 },
        { id: 'actions', label: t('actions'), type: "threeDots", component: (item) => <ElementActions item={item} />, width: 400, align: "right" },
    ]


    const defaultFilters = { status: 'all', name: "" };
    const items = [
        { key: 'all', label: t('all'), match: () => true },
        { key: 'selected', label: t('selected'), match: (item) => item?.status == "selected", color: 'primary' },
        { key: 'not_selected', label: t('not_selected'), match: (item) => item?.status == "not_selected", color: 'warning' },
    ];
    const filterFunction = (data, filters) => {
        const activeTab = filters.tabKey;
        const item = tableData.find(i => i?.key === activeTab);
        if (item?.match) return data.filter((d) => item.match(d, filters));
        return data;
    }

    const RformulateTable = (data) => {
        return data?.map(item => ({ ...item })) || [];
    }

    useEffect(() => {
        setDataFiltered(RformulateTable(data));
    }, [data]);
    useEffect(() => {
        setTableData(RformulateTable(data));
    }, [data]);

    return (
        <>
            {/* <ZaityHeadContainer
                heading={t("contract_clauses")}
                action={
                    <PermissionsContext action={"create.contract"} >
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.user.new}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            {t("add_clause")}
                        </Button>
                    </PermissionsContext>
                }
                links={[
                    { name: t('dashboard'), href: paths.dashboard.root },
                    { name: t("contract_clauses"), href: paths.dashboard.user.new },
                    { name: t('list') },
                ]}
            > */}
            <Card>
                {/* <ZaityTableTabs data={tableData} items={items} defaultFilters={{ status: 'all' }} setTableDate={setDataFiltered} filterFunction={filterFunction}> */}
                {/* <ZaityTableFilters defaultFilters={defaultFilters} dataFiltered={tableData}> */}
                <ZaityListView TABLE_HEAD={[...TABLE_HEAD]} dense="medium" zaityTableDate={dataFiltered || []} onSelectedRows={({ data, setTableData }) => { return <onSelectedRowsComponent configurable_type={"roles"} setTableData={setTableData} data={data} /> }} />
                {/* </ZaityTableFilters> */}
                {/* </ZaityTableTabs> */}
            </Card>
            {/* </ZaityHeadContainer> */}
        </>
    );
}

// ----------------------------------------------------------------------



import { CancleClause } from './CancleClause';
import { deleteContractClause } from 'src/api/contract';
import ReplaceClause from './ReplaceClause';



const ElementActions = ({ item }) => {
    const popover = usePopover();
    const confirm = useBoolean();
    const ban = useBoolean();
    const replace = useBoolean();
    const cancle = useBoolean();
    const router = useRouter();
    const onViewRow = useCallback(
        (id) => {
            router.push(paths.dashboard.user.edit(id));
        },
        [router]
    );
    const onDeleteRow = useCallback(
        async (id) => {
            console.log("hit here");
            await deleteContractClause(id);
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

                <PermissionsContext action={"update.user"} >
                    <MenuItem
                        onClick={() => {
                            onViewRow(item?.id);
                            popover.onClose();
                        }}
                    >
                        <Iconify icon="solar:pen-bold" />
                        {t('edit')}
                    </MenuItem>
                </PermissionsContext>
                <PermissionsContext action={"update.user"} >
                    <MenuItem
                        onClick={() => {
                            // onViewRow(item?.id);
                            replace.onTrue()
                            popover.onClose();
                        }}
                    >
                        <Iconify icon="material-symbols:change-circle-rounded" />
                        {t('replace')}
                    </MenuItem>
                </PermissionsContext>
                <PermissionsContext action={"delete.user"} >
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
                <PermissionsContext action={"update.user"} >
                    <MenuItem
                        onClick={() => {
                            cancle.onTrue();
                            popover.onClose();
                        }}
                        sx={{ color: 'warning.main' }}
                    >
                        <Iconify icon="material-symbols-light:shield-locked-rounded" />
                        {t('cancle')}
                    </MenuItem>
                </PermissionsContext>
            </CustomPopover>


            <ContentDialog

                open={cancle.value}
                onClose={cancle.onFalse}
                title={t("cancle_clause")}
                content={
                    <>
                        <CancleClause id={item?.id} close={() => { cancle.onFalse() }} />
                    </>
                }
            />
            <ContentDialog
                maxWidth={"md"}
                open={replace.value}
                onClose={replace.onFalse}
                title={t("replace_clause")}
                content={
                    <>
                        <ReplaceClause item={item} id={item?.id} close={() => { replace.onFalse() }} />
                    </>
                }
            />

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


