import * as Yup from 'yup';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useTranslate } from 'src/locales';
import ZaityDynamicForm from 'src/sections/ZaityTables/zaity-new-edit-form';


const DocumentCreateView = () => {
    const settings = useSettingsContext();
    const { t } = useTranslate();

    const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        age: Yup.number().required().positive().integer(),
        startDate: Yup.string().required(),
        color: Yup.string().required(),
    });

    const fields = [
        { name: 'name', label: t("document_name"), type: 'text', required: true },
        // { name: 'email', label: 'Email', type: 'email', required: true },
        // { name: 'age', label: 'Age', type: 'number', required: true },
        // { name: 'startDate', label: 'Start Date', type: 'date', required: true },
        {
            name: 'attachable_id',
            label: t('attachable'),
            type: 'select',
            required: true,
            data: [
                { id: 'driver', label: t("driver") },
                { id: 'car', label: t("car") },
                { id: 'client', label: t("client") },
                { id: 'other', label: t("other") },
            ],
        },
    ];
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading={t('add_new_document')}
                links={[
                    {
                        name: t('dashboard'),
                        href: paths.dashboard.root,
                    },
                    {
                        name: t('add_new_document'),
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
                onSubmit={(data) => console.log(data)}
            />

        </Container>
    )
}

export default DocumentCreateView