
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

export default function CarModelsListView() {
    const TABLE_HEAD = [
        { id: 'name', label: t('model'), type: "text", width: 140 },
        { id: 'company', label: t('company'), type: "text", width: 140 },
        // { id: 'attachable', label: t('attachable'), type: "text", width: 140 },
        // { id: 'date', label: t('date'), type: "date", width: 140 },
        { id: 'actions', label: t("actions"), type: "component", width: 88,align:"end" },
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
    const { data } = useValues()
    let system_items = data?.car_companies ? data.car_companies.flatMap(company => 
        company.models.map(model => ({
            ...model,
            name: model?.translations[0]?.name,
            company: company?.translations[0]?.name, // 👈 direct from parent
            actions: (actionMethode) => (
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
            )
        }))
      )
    : [];
  
    const [tableDate, setTableDate] = useState(system_items.reverse());
    useEffect(() => {
        let items =  data?.car_companies ? data.car_companies.flatMap(company => 
            company.models.map(model => ({
                ...model,
                name: model?.translations[0]?.name,
                company: company?.key, // 👈 direct from parent
                actions: (actionMethode) => (
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
                )
            }))
          )
        : [];
        setTableDate(items?.reverse())
        console.log(items);
    }, [data])

    return (
        <>
            <ZaityHeadContainer heading={"car_models"}
                action={<Button component={RouterLink} href={paths.dashboard.settings.car_modelsNew} variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>{t('add_new_car_model')}</Button>}
                links={[
                    {
                        name: t('dashboard'),
                        href: paths.dashboard.root,
                    },
                    {
                        name: t('car_models'),
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
