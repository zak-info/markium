
import { Button, Card, MenuItem } from '@mui/material';
import { t } from 'i18next';
import { set } from 'lodash';
import { useEffect, useState } from 'react';
import { useGetMainSpecs } from 'src/api/settings';
import { useValues } from 'src/api/utils';
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

export default function NeighborhoodListView() {
    const TABLE_HEAD = [
        { id: 'name', label: t('neighborhood_name'), type: "text", width: 140 },
        { id: 'state', label: t('state'), type: "text", width: 140 },
        // { id: 'attachable', label: t('attachable'), type: "text", width: 140 },
        // { id: 'date', label: t('date'), type: "date", width: 140 },
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
        const item = neighborhoods.find(i => i?.key === activeTab);
        if (item?.match) return data.filter((d) => item.match(d, filters));
        return data;
    }
    
    const { data } = useValues()
    let neighborhoods = data?.neighborhoods && data?.states ?  data?.neighborhoods?.map(item => ({
        ...item,
        name: item?.translations[0]?.name,
        state: data?.states?.find(i => i.id == item.state_id)?.translations[0]?.name,
        actions: (actionMethode) =>
            <>
                <MenuItem
                    onClick={() => {
                        actionMethode()
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    {t('delete')}
                </MenuItem>
            </>
    })) : [];
    const [tableDate, setTableDate] = useState(neighborhoods.reverse());
    useEffect(() => {
        setTableDate(neighborhoods)
    }, [data])

    return (
        <>
            <ZaityHeadContainer heading={"neighborhood_settings"}
                action={<Button component={RouterLink} href={paths.dashboard.settings.neighborhoodsNew} variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>{t('add_new_neighborhood')}</Button>}
                links={[
                    {
                        name: t('dashboard'),
                        href: paths.dashboard.root,
                    },
                    {
                        name: t('neighborhood_settings'),
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
