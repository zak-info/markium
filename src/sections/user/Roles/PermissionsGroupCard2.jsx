import { Box, Card, CardContent, CardHeader, Collapse, FormControlLabel, Grid, IconButton, Switch, Typography } from '@mui/material';
import { display, Stack } from '@mui/system';
import React, { useContext } from 'react'
import Iconify from 'src/components/iconify';
import { SettingsContext } from 'src/components/settings/context/settings-context';
import { useBoolean } from 'src/hooks/use-boolean';
import { useTranslate } from 'src/locales';

const PermissionsGroupCard2 = ({ model, perms, selectedPermissions, togglePermission, toggleGroupPermissions }) => {
    const {
        themeMode
    } = useContext(SettingsContext);
    console.log("themeMode :" ,themeMode);
    const collapse = useBoolean();
    const collapse2 = useBoolean();
    const { t } = useTranslate();

    function removeIdOrPathSuffix(str) {
        if (str.endsWith('_id')) {
            return str.slice(0, -3);
        }
        if (str.endsWith('_path')) {
            return str.slice(0, -5);
        }
        return str;
    }


    return (
        <>
            <Card variant="outlined" height="auto" sx={{ height: "auto" }} >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
                    <CardHeader
                        title={t(model.toLocaleLowerCase())}
                        titleTypographyProps={{ variant: 'h6' }}
                    />
                    <Box sx={{ display: "flex", gap: "2px", alignItems: "center" }}>
                        <JustSwitchPermission model={model} groupPermissions={[...perms.actions.map(perm => perm.id), ...perms.columns.map(perm => perm.id)]} selectedPermissions={selectedPermissions} toggleGroupPermissions={toggleGroupPermissions} />
                        <IconButton
                            color={collapse.value ? 'inherit' : 'default'}
                            onClick={collapse.onToggle}
                            sx={{
                                ...(collapse.value && {
                                    bgcolor: 'action.hover',
                                }),
                            }}
                        >
                            <Iconify icon="eva:arrow-ios-downward-fill" />
                        </IconButton>
                    </Box>
                </Box>
                <CardContent>
                    <Collapse
                        in={collapse.value}
                        timeout="auto"
                        unmountOnExit
                        sx={{}}
                    >
                        <Box
                            rowGap={2}
                            columnGap={1}
                            sx={{ mt: 0 }}
                            display="flex"
                            flexWrap="wrap"
                            alignItems="start"
                        >
                            {perms?.actions?.map((perm) => {
                                let key = perm?.key.split(".");
                                const label =
                                    perm?.action.toUpperCase() === 'PUT'
                                        ? t("edit") + ` : ${t(removeIdOrPathSuffix(perm?.field))}`
                                        : t(key[0]) + " " + t(key[1]);
                                return (
                                    <BordersSwitchPermission themeMode={themeMode} perm={perm} label={label} selectedPermissions={selectedPermissions} togglePermission={togglePermission} />
                                );
                            })}
                            {/* : t(perm?.action?.toLowerCase()); */}
                        </Box>
                        <Box sx={{ display: "flex", mt: 4, justifyContent: "space-between", alignItems: "center", }}>
                            <Typography variant="body2" sx={{}} >{t("spicify")}</Typography>
                            <IconButton
                                color={collapse2.value ? 'inherit' : 'default'}
                                onClick={collapse2.onToggle}
                                sx={{
                                    ...(collapse2.value && {
                                        bgcolor: 'action.hover',
                                    }),
                                }}
                            >
                                <Iconify icon="eva:arrow-ios-downward-fill" />
                            </IconButton>
                        </Box>
                        <Collapse
                            in={collapse2.value}
                            timeout="auto"
                            unmountOnExit
                            sx={{ display: 'flex' }}
                        >
                            <Box
                                rowGap={1}
                                columnGap={2}
                                sx={{ mt: 8 }}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                }}
                            >
                                {perms?.columns?.map((perm) => {
                                    const label =
                                        perm.action === 'PUT'
                                            ? t("edit") + ` : ${t(removeIdOrPathSuffix(perm.field))}`
                                            : t(perm?.action?.toLowerCase());
                                    return (
                                        <BordersSwitchPermission themeMode={themeMode} perm={perm} label={label} selectedPermissions={selectedPermissions} togglePermission={togglePermission} />
                                    );
                                })}
                            </Box>
                        </Collapse>
                    </Collapse>
                </CardContent>
            </Card>
        </>
    )
}

export default PermissionsGroupCard2

const BordersSwitchPermission = ({ themeMode,perm, label, selectedPermissions, togglePermission }) => {
    return (
        <Card sx={{ background: themeMode == "dark" ? "#2C3844" : "#fdf5e6",display: 'flex', flexDirection: "row", alignItems: "center", borderRadius: "40px", justifyContent: 'start', px: 1 }}>
            {/* <Typography variant="body2">{label}</Typography> */}
            <FormControlLabel
                key={perm?.id}
                control={
                    <Switch
                        checked={selectedPermissions?.includes(perm?.id)}
                        onChange={() => togglePermission(perm)}
                        color="primary"
                    />
                }
                label={<Typography variant="body2">{label}</Typography>}

                sx={{}}
            />
        </Card>
    )
}

const SwitchPermission = ({ perm, label, selectedPermissions, togglePermission }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
            <FormControlLabel
                key={perm?.id}
                control={
                    <Switch
                        checked={selectedPermissions?.includes(perm?.id)}
                        onChange={() => togglePermission(perm)}
                        color="primary"
                    />
                }
                label={<Typography variant="body2">{label}</Typography>}

                sx={{}}
            />
        </Box>
    )
}

const JustSwitchPermission = ({ model, groupPermissions, selectedPermissions, toggleGroupPermissions }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
            <FormControlLabel
                // key={key}
                control={
                    <Switch
                        checked={groupPermissions.every(id => selectedPermissions?.includes(id))}
                        onChange={() => toggleGroupPermissions(model)}
                        color="primary"
                    />
                }
                // label={<Typography variant="body2">{label}</Typography>}

                sx={{}}
            />
        </Box>
    )
}