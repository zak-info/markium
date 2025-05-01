import * as Yup from 'yup';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useTranslate } from 'src/locales';
import ZaityDynamicForm from 'src/sections/ZaityTables/zaity-new-edit-form';
import { useValues } from 'src/api/utils';
import { createItemInSettings } from 'src/api/settings';
import { useRouter } from 'src/routes/hooks';


const CountriesCreateView = () => {
    const settings = useSettingsContext();
    const { t } = useTranslate();
    const {data} = useValues()
    const router = useRouter();
    const schema = Yup.object().shape({
        name_en: Yup.string().required(),
        name_ar: Yup.string().required(),
        is_private: Yup.string().required(),
    });

    const fields = [
        { name: 'name_en', label: t("country_name"), type: 'text', required: true },
        { name: 'name_ar', label: t("country_name_ar"), type: 'text', required: true },
        // { name: 'email', label: 'Email', type: 'email', required: true },
        // { name: 'age', label: 'Age', type: 'number', required: true },
        // { name: 'startDate', label: 'Start Date', type: 'date', required: true },
        {
            name: 'is_private',
            label: t('is_private'),
            type: 'select',
            required: true,
            data: [
                { id: '0', label: t("no") },
                { id: '1', label: t("yes") },
            ],
        },
        // {
        //     name: 'country_id',
        //     label: t('country'),
        //     type: 'autocomplete',
        //     required: true,
        //     data: data?.countries?.map(item => ({...item,name:item?.translations[0]?.name})) || [],
        // },
    ];

    const handleSubmitCreate = async (data,runBeforePush) => {
        let body = {name_en: data.name_en, name_ar: data.name_ar, is_private: data.is_private,type: 'country'}
        console.log("to send : ", body)
        const response = await createItemInSettings(body);
        if (response) {
            // runBeforePush()
            router.push(paths.dashboard.settings.countries);
        }
    }

   
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading={t('add_new_country')}
                links={[
                    {
                        name: t('dashboard'),
                        href: paths.dashboard.root,
                    },
                    {
                        name: t('add_new_country'),
                        href: paths.dashboard.settings.root,
                    },
                    { name: t('create') },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <ZaityDynamicForm
                currentItem={{ name: '', email: '', age: null, startDate: '', color: '' }}
                schema={schema}
                fields={fields}
                onSubmit={(data) => handleSubmitCreate(data)}
            />

        </Container>
    )
}

export default CountriesCreateView