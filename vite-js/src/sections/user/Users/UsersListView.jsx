import { Box, Button, Card, FormControlLabel, FormGroup, IconButton, MenuItem, Switch, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { set } from 'lodash'; // [keep for later use]
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { changeItemVisibilityInSettings, useGetMainSpecs } from 'src/api/settings'; // [keep for later use]
import { createUser, useRoles, useUsers } from 'src/api/users';
import { useValues } from 'src/api/utils';
import PermissionsContext from 'src/auth/context/permissions/permissions-context';
import { ConfirmDialog } from 'src/components/custom-dialog';
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


export default function UsersListView({ }) {
    const { users } = useUsers();
    // const users = [
    //     { id: 1, name: "zaki", username: "zak-info", email: "zaki@gmail.com", phone_number: "075912431", role: "super admin" }
    // ]
    const [tableData, setTableData] = useState([]);
    const [dataFiltered, setDataFiltered] = useState([]);

    let TABLE_HEAD = [
        { id: 'name', label: t('name'), type: "text", width: 140 },
        { id: 'username', label: t('username'), type: "text", width: 140 },
        { id: 'email', label: t('email'), type: "text", width: 140 },
        { id: 'phone_number', label: t('phone_number'), type: "text", width: 140 },
        { id: 'role', label: t('role'), type: "text", width: 140 },
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
        setDataFiltered(RformulateTable(users));
    }, [users]);
    useEffect(() => {
        setTableData(RformulateTable(users));
    }, [users]);

    return (
        <>
            <ZaityHeadContainer
                heading={t("users_list")}
                action={
                    <PermissionsContext action={"create.user"} >
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.user.new}
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            {t("add_user")}
                        </Button>
                    </PermissionsContext>
                }
                links={[
                    { name: t('dashboard'), href: paths.dashboard.root },
                    { name: t("users_list"), href: paths.dashboard.user.new },
                    { name: t('list') },
                ]}
            >
                <Card>
                    {/* <ZaityTableTabs data={tableData} items={items} defaultFilters={{ status: 'all' }} setTableDate={setDataFiltered} filterFunction={filterFunction}> */}
                    {/* <ZaityTableFilters defaultFilters={defaultFilters} dataFiltered={tableData}> */}
                    <ZaityListView TABLE_HEAD={[...TABLE_HEAD]} dense="medium" zaityTableDate={dataFiltered || []} onSelectedRows={({ data, setTableData }) => { return <onSelectedRowsComponent configurable_type={"roles"} setTableData={setTableData} data={users} /> }} />
                    {/* </ZaityTableFilters> */}
                    {/* </ZaityTableTabs> */}
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
    const router = useRouter();
    const onViewRow = useCallback(
        (id) => {
            router.push(paths.dashboard.user.edit(id));
        },
        [router]
    );
    const onDeleteRow = useCallback(
        async (id) => {
            await deleteUser(id);
        }
    );
    const onBanRow = useCallback(
        async (id) => {
            await deleteUser(id);
        }
    );
    return (
        <Box display={"flex"} rowGap={"10px"} sx={{ gap: '10px' }} >
            <PermissionsContext action={"update.user"} >
                <Button onClick={() => { onViewRow(item?.id) }} variant="outlined" startIcon={<Iconify icon="solar:pen-bold" />}>
                    {t("edit")}
                </Button>
            </PermissionsContext>
            <PermissionsContext action={"update.user"} >
                <Button onClick={() => { ban.onTrue()}} variant="outlined" color="warning" startIcon={<Iconify icon="material-symbols-light:shield-locked-rounded" />}>
                    {t("ban")}
                </Button>
            </PermissionsContext>
            <PermissionsContext action={"delete.user"} >
                <Button onClick={() => { confirm.onTrue() }} variant="outlined" color="error" startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}>
                    {t("delete")}
                </Button>
            </PermissionsContext>

            {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
            </IconButton> */}

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title={t("delete")}
                content={t("are_you_sure_want_to_delete")}
                action={
                    <Button variant="contained" color="error" onClick={onDeleteRow(item?.id)}>
                        {t("delete")}
                    </Button>
                }
            />
            <ConfirmDialog
                open={ban.value}
                onClose={ban.onFalse}
                title={t("ban")}
                content={t("are_you_sure_want_to_ban")}
                action={
                    <Button variant="contained" color="error" onClick={onBanRow(item?.id)}>
                        {t("ban")}
                    </Button>
                }
            />
        </Box>
    );
};


