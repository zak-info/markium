import { Box, Card, CardContent, CardHeader, Collapse, FormControlLabel, IconButton, Switch, Typography } from '@mui/material';
import { display, Stack } from '@mui/system';
import React from 'react'
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { useTranslate } from 'src/locales';

const PermissionsGroupCard = ({ model, perms, selectedPermissions, togglePermission }) => {

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
        <Card variant="outlined" sx={{ height: "auto" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
                <CardHeader
                    title={t(model.toLocaleLowerCase())}
                    titleTypographyProps={{ variant: 'h6' }}
                />
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
            <CardContent>
                <Collapse
                    in={collapse.value}
                    timeout="auto"
                    unmountOnExit
                    sx={{}}
                >
                    {perms?.actions?.map((perm) => {
                        const label =
                            perm.action === 'PUT'
                                ? t("edit") + ` : ${t(removeIdOrPathSuffix(perm.field))}`
                                : t(perm?.action?.toLowerCase());
                        return (
                            <FormControlLabel
                                key={perm.id}
                                control={
                                    <Switch
                                        checked={selectedPermissions.includes(perm.id)}
                                        onChange={() => togglePermission(perm)}
                                        color="primary"
                                    />
                                }
                                label={<Typography variant="body2">{label}</Typography>}
                                sx={{ display: 'flex', }}
                            />
                        );
                    })}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center",  }}>
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
                        sx={{}}
                    >
                        {perms?.columns?.map((perm) => {
                            const label =
                                perm.action === 'PUT'
                                    ? t("edit") + ` : ${t(removeIdOrPathSuffix(perm.field))}`
                                    : t(perm?.action?.toLowerCase());
                            return (
                                <FormControlLabel
                                    key={perm.id}
                                    control={
                                        <Switch
                                            checked={selectedPermissions.includes(perm.id)}
                                            onChange={() => togglePermission(perm)}
                                            color="primary"
                                        />
                                    }
                                    label={<Typography variant="body2">{label}</Typography>}
                                    sx={{ display: 'flex', }}
                                />
                            );
                        })}
                    </Collapse>
                </Collapse>
            </CardContent>
        </Card>
    )
}

export default PermissionsGroupCard