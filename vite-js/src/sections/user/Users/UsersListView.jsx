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


export default function UsersListView({ }) {
    const { users } = useUsers();
    // const users = [
    //     { id: 1, name: "zaki", username: "zak-info", email: "zaki@gmail.com", phone_number: "075912431", role: "super admin" }
    // ]
    const [tableData, setTableData] = useState([]);
    const [dataFiltered, setDataFiltered] = useState([]);

    let TABLE_HEAD = [
        { id: 'name', label: t('name'), type: "text", width: 140 },
        { id: 'username', label: t('username'), type: "text", width: 180 },
        { id: 'email', label: t('email'), type: "text", width: 140 },
        { id: 'phone_number', label: t('phone_number'), type: "text", width: 140 },
        { id: 'status', label: t('status'), type: "text", width: 140 },
        { id: 'roles', label: t('roles'), type: "text", width: 140 },
        { id: 'actions', label: t('actions'), type: "threeDots", component: (item) => <ElementActions item={item} />, width: 400, align: "right" },
    ]



    const filters = [
        {
            key: 'name', label: t('name'), match: (item, value) =>
                item?.name?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.username?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.phone_number?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.roles?.toLowerCase().includes(value?.toLowerCase()) ||
                item?.email?.toLowerCase().includes(value?.toLowerCase()) ,
        },
    ];

    const defaultFilters = {
        name: '',
    };

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

    function arrayToSentence(arr) {
        if (arr.length === 0) return "";
        if (arr.length === 1) return arr[0];
        if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
        return `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`;
    }

    // arrayToSentence(["apples", "bananas", "oranges"]);
    // Output: "apples, bananas, and oranges"


    const RformulateTable = (data) => {
        return data?.map(item => ({
            ...item,
            roles: arrayToSentence(item.roles.map(i => i.key)),

        })) || [];
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
                    <ZaityTableFilters data={dataFiltered} tableData={tableData} setTableDate={setDataFiltered} items={filters} defaultFilters={defaultFilters} dataFiltered={tableData} searchText={t("search_by") + " " + t("name") + ", " + t("username") + ", " + t("email")+ ", " + t("phone") + " ..."} >
                        <ZaityListView TABLE_HEAD={[...TABLE_HEAD]} dense="medium" zaityTableDate={dataFiltered || []} onSelectedRows={({ data, setTableData }) => { return <onSelectedRowsComponent configurable_type={"roles"} setTableData={setTableData} data={users} /> }} />
                    </ZaityTableFilters>
                    {/* </ZaityTableTabs> */}
                </Card>
            </ZaityHeadContainer>
        </>
    );
}

// ----------------------------------------------------------------------


import ChangePasswordView from 'src/sections/user/Users/changePasswordView';


const ElementActions = ({ item }) => {
    const popover = usePopover();
    const confirm = useBoolean();
    const ban = useBoolean();
    const completed = useBoolean();
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
            {/* <PermissionsContext action={"update.user"} >
                <Button onClick={() => { onViewRow(item?.id) }} variant="outlined" startIcon={<Iconify icon="solar:pen-bold" />}>
                    {t("edit")}
                </Button>
            </PermissionsContext> */}
            {/* <PermissionsContext action={"update.user"} >
                <Button onClick={() => { ban.onTrue() }} variant="outlined" color="warning" startIcon={<Iconify icon="material-symbols-light:shield-locked-rounded" />}>
                    {t("ban")}
                </Button>
            </PermissionsContext> */}
            {/* <PermissionsContext action={"delete.user"} >
                <Button onClick={() => { confirm.onTrue() }} variant="outlined" color="error" startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}>
                    {t("delete")}
                </Button>
            </PermissionsContext> */}

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
            </IconButton>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 200 }}
            >
                <PermissionsContext action={"put.user.password"} >
                    <MenuItem
                        onClick={() => {
                            // onViewRow(item?.id);
                            completed.onTrue();
                            popover.onClose();
                        }}
                    >
                        <Iconify icon="material-symbols-light:shield-locked-rounded" />
                        {t('edit_password')}
                    </MenuItem>
                </PermissionsContext>
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
                            ban.onTrue();
                            popover.onClose();
                        }}
                        sx={{ color: 'warning.main' }}
                    >
                        <Iconify icon="material-symbols-light:shield-locked-rounded" />
                        {t('ban')}
                    </MenuItem>
                </PermissionsContext>
            </CustomPopover>

            <ContentDialog

                open={completed.value}
                onClose={completed.onFalse}
                title={t("edit_password")}
                content={
                    <ChangePasswordView currentUser={item} onClose={() => { completed.onFalse() }} />
                }
            />
            {/* 9ugpv2h2 */}

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


