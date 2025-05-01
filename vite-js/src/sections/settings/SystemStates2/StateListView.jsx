
import { Button, Card, MenuItem } from '@mui/material';
import { t } from 'i18next';
import { set } from 'lodash';
import { useEffect, useState } from 'react';
import { useGetMainSpecs } from 'src/api/settings';
import { fileData } from 'src/components/file-thumbnail';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import ZaityListView from 'src/sections/ZaityTables/zaity-list-view';
import ZaityHeadContainer from 'src/sections/ZaityTables/ZaityHeadContainer';
import ZaityTableFilters from 'src/sections/ZaityTables/ZaityTableFilters';
import ZaityTableTabs from 'src/sections/ZaityTables/ZaityTableTabs';
import { date } from 'yup';

// ----------------------------------------------------------------------

export default function StateListView() {
    const TABLE_HEAD = [
        { id: 'name', label: t('state'), type: "text", width: 140 },
        { id: 'date', label: t('date'), type: "date", width: 140 },
        { id: 'actions', label: t("actions"), type: "component", width: 88 },
    ];
    const defaultFilters = {
        name: '',
    };
    const items = [
        { key: 'all', label: 'All', match: () => true },
        { key: 'new', label: 'New', match: (item) => item.status === 'new', color: 'primary' },
        { key: 'archived', label: 'Archived', match: (item) => item.archived, color: 'warning' },
    ];
    const filterFunction = (data, filters) => {
        const activeTab = filters.tabKey;
        const item = mainspecs.find(i => i?.key === activeTab);
        if (item?.match) return data.filter((d) => item.match(d, filters));
        return data;
    }
    const [tableDate, setTableDate] = useState([{
        id: 1, name: "test", date: "2023-10-01", actions:(actionMethode)=> <>
            <MenuItem
                onClick={() => {
                    // popover.onClose();
                    actionMethode()
                }}
                sx={{ color: 'error.main' }}
            >
                <Iconify icon="solar:trash-bin-trash-bold" />
                {t('delete')}
            </MenuItem>
        </>
    }]);

    return (
        <>
            <ZaityHeadContainer heading={"states_settings"}
                action={<Button component={RouterLink} href={paths.dashboard.settings.statesNew} variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>{t('addNewMaintenaceSpecs')}</Button>}
                links={[
                    {
                        name: t('dashboard'),
                        href: paths.dashboard.root,
                    },
                    {
                        name: t('states_settings'),
                        href: paths.dashboard.settings.root,
                    },
                    { name: t('list') },
                ]}>

                <Card>
                    {/* <ZaityTableTabs data={tableDate} items={items} defaultFilters={{ tabKey: 'all' }} setTableDate={setTableDate} filterFunction={filterFunction}> */}
                    <ZaityTableFilters defaultFilters={defaultFilters} dataFiltered={tableDate} >
                        <ZaityListView TABLE_HEAD={TABLE_HEAD} dense={"small"} zaityTableDate={tableDate} />
                    </ZaityTableFilters>
                    {/* </ZaityTableTabs> */}
                </Card>
            </ZaityHeadContainer>
        </>
    );
}
