import * as Yup from 'yup';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useTranslate } from 'src/locales';
import ZaityDynamicForm from 'src/sections/ZaityTables/zaity-new-edit-form';
import { useValues } from 'src/api/utils';
import { createItemInSettings } from 'src/api/settings';
import { label } from 'yet-another-react-lightbox';

// ----------------------------------------------------------------------
const SystemItemCreateView = ({ collection }) => {
    const settings = useSettingsContext();
    const { t } = useTranslate();
    const { data } = useValues();
    const router = useRouter();

    const checkCountryExists = (value) => {
        return !data?.countries?.some(
            (item) => item.key === value || item?.translations?.[0]?.name === value
        );
    };

    const checkSpecExists = (value) => {
        return !data?.specs?.some(
            (item) => item.key === value || item?.translations?.[0]?.name === value
        );
    };



    const types = {
        payment_method: {
            add_new_item_label: "add_new_payment_methods",
            homeHref: paths.dashboard.settings.payment_methods,
            getAndSend: (data) => ({
                name: data.name,
                name_en: data.name,
                name_ar: data.name,
                is_private: "1",
            }),
            schema: Yup.object().shape({
                name: Yup.string().required(),
            }),
            fields: (t) => [
                { name: 'name', label: t('payment_methods_name'), type: 'text', required: true },

            ],
        },
        license_type: {
            add_new_item_label: "add_new_license_types",
            homeHref: paths.dashboard.settings.license_types,
            getAndSend: (data) => ({
                name_en: data.name,
                name_ar: data.name,
                is_private: "1",
            }),
            schema: Yup.object().shape({
                name: Yup.string().required(),
            }),
            fields: (t) => [
                { name: 'name', label: t('license_types_name'), type: 'text', required: true },

            ],
        },
        spec: {
            add_new_item_label: "add_new_spec",
            homeHref: paths.dashboard.settings.specs,
            getAndSend: (data) => ({
                name_en: data.name,
                name_ar: data.name,
                is_private: "1",
            }),
            schema: Yup.object().shape({
                name: Yup.string()
                    .required(t('validation_required')) // This field must be filled in and cannot be left blank
                    .min(3, t('validation_minValue')) // Minimum value must be present
                    .max(25, t('validation_maxValue')) // Maximum value must be present
                    .matches(/^[a-zA-Z0-9\u0600-\u06FF\s]+$/, t('validation_noSpecialChars')) // No special characters
                    .typeError(t('validation_mustBeText')) // Must be text (Text / String)
                    .test("is-non-number", t("validation_isNonNumber"), function (value) {
                        // Test if value is not a pure number
                        return value ? isNaN(Number(value)) || /[a-zA-Z\u0600-\u06FF]/.test(value) : true;
                    })
                    .test("is-valid-country", t("specExist"), function (value) {
                        return checkSpecExists(value);
                    })
            }).noUnknown(t('validation_noDuplicateProps')), // Duplicate property names are not allowed

            fields: (t) => [
                { name: 'name', label: t('specs_name'), type: 'text', required: true },

            ],
        },
        attachment_name: {
            add_new_item_label: "add_new_attachment_name",
            homeHref: paths.dashboard.settings.attachment_names,
            getAndSend: (data) => ({
                name_en: data.name,
                name_ar: data.name,
                object_type: data.object_type,
                attachable: data.attachable,
                is_private: "1",
            }),
            schema: Yup.object().shape({
                name: Yup.string().required(),
                object_type: Yup.string().required(),
                attachable: Yup.string().required(),
            }),
            fields: (t) => [
                { name: 'name', label: t('attachment_name'), type: 'text', required: true },
                // { name: 'object_type', label: t('type'), type: 'select',data:[{ value: "card", label:  "كرت", id: 1 }, { value: "form", label: "استمارة", id: 2 }], required: true },
                { name: 'object_type', label: t('type'), type: 'select', data: data?.attachment_types?.map(i => ({ value: i.key, label: i.translations[0]?.name })), required: true },
                { name: 'attachable', label: t('attachable'), type: 'select', data: [{ value: "car", label: "سيارة", id: 1 }, { value: "driver", label: "سائق", id: 2 }, { value: "client", label: "عميل", id: 3 }, { value: "other", label: "اخرى", id: 4 }], required: true },

            ],
        },
        country: {
            add_new_item_label: "add_new_country",
            homeHref: paths.dashboard.settings.countries,
            getAndSend: (data) => ({
                name_en: data.name,
                name_ar: data.name,
                is_private: "1",
            }),
            schema: Yup.object().shape({
                name: Yup.string()
                    .required(t("name_required"))
                    .test("is-valid-country", t("countryExist"), function (value) {
                        return checkCountryExists(value);
                    }),
            }),
            fields: (t) => [
                { name: 'name', label: t('country_name'), type: 'text', required: true },
            ],
        },
        state: {
            add_new_item_label: "add_new_state",
            homeHref: paths.dashboard.settings.states,
            getAndSend: (data) => ({
                name_en: data.name,
                name_ar: data.name,
                is_private: "1",
            }),
            schema: Yup.object().shape({
                name: Yup.string().required(),
            }),
            fields: (t) => [
                { name: 'name', label: t('state_name'), type: 'text', required: true },
            ],
        },
        neighborhood: {
            add_new_item_label: "add_new_neighborhood",
            homeHref: paths.dashboard.settings.neighborhoods,
            getAndSend: (data) => ({
                name_en: data.name,
                name_ar: data.name,
                state_id: data?.state_id,
                is_private: "1",
            }),
            schema: Yup.object().shape({
                name: Yup.string().required(),
            }),
            fields: (t, data) => [
                { name: 'name', label: t('neighborhood_name'), type: 'text', required: true },
                {
                    name: 'state_id',
                    label: t('state'),
                    type: 'autocomplete',
                    required: true,
                    data: data?.states?.map(item => ({ ...item, name: item?.translations[0]?.name })) || [],
                },
            ],
        },
        color: {
            add_new_item_label: "add_new_color",
            homeHref: paths.dashboard.settings.colors,
            getAndSend: (data) => ({
                name_en: data.name,
                name_ar: data.name,
                is_private: "1",
            }),
            schema: Yup.object().shape({
                name: Yup.string().required(),
            }),
            fields: (t) => [
                { name: 'name', label: t('color_name'), type: 'text', required: true },
            ],
        },
        car_company: {
            add_new_item_label: "add_new_car_company",
            homeHref: paths.dashboard.settings.car_companies,
            getAndSend: (data) => ({
                name_en: data.name,
                name_ar: data.name,
                country_id: data.country_id,
                is_private: "1",
            }),
            schema: Yup.object().shape({
                name: Yup.string().required(),
            }),
            fields: (t, data) => [
                { name: 'name', label: t('car_company_name'), type: 'text', required: true },
                {
                    name: 'country_id',
                    label: t('country'),
                    type: 'autocomplete',
                    required: true,
                    data: data?.countries?.map(item => ({ ...item, name: item?.translations[0]?.name })) || [],
                },
            ],
        },
        car_model: {
            add_new_item_label: "add_new_car_model",
            homeHref: paths.dashboard.settings.car_models,
            getAndSend: (data) => ({
                name_en: data.name,
                name_ar: data.name,
                car_company_id: data.car_company_id,
                is_private: "1",
            }),
            schema: Yup.object().shape({
                name: Yup.string().required(),
            }),
            fields: (t, data) => [
                { name: 'name', label: t('car_model_name'), type: 'text', required: true },
                {
                    name: 'car_company_id',
                    label: t('company'),
                    type: 'autocomplete',
                    required: true,
                    data: data?.car_companies?.map(item => ({ ...item, name: item?.translations[0]?.name })) || [],
                },
            ],
        },
        maintenance_specification: {
            add_new_item_label: "addMaintenanceItem",
            homeHref: paths.dashboard.settings.pm,
            getAndSend: (data) => ({
                name: data.name,
                name_en: data.name,
                name_ar: data.name,
                is_periodic: data.is_periodic == "1" ? true : false,
                period_value: data.period_value,
                period_unit: data.period_unit,
                unit: data.unit,
                note: data.note,
                is_private: "1",
                icon: "1",
            }),
            schema: Yup.object().shape({
                name: Yup.string().required(),
            }),
            fields: (t, data) => [
                { name: 'name', label: t('name'), type: 'text', required: true },
                {
                    name: 'is_periodic',
                    label: t('is_periodic'),
                    type: 'select',
                    required: true,
                    data: [
                        { id: "0", label: t("no") },
                        { id: "1", label: t("yes") },
                    ],
                },
                {
                    name: 'period_unit',
                    label: t('period_unit'),
                    type: 'condition',
                    required: true,
                    data: data?.unit_enum?.map(item => ({ ...item, id: item.key, value: item.key, lable: item?.translations[0].name, name: item?.translations[0].name })),
                    conditionKey: "is_periodic", condition: (element) => { return element == "1" }, conditionType: "select",
                },
                { name: 'period_value', label: t('period_value'), type: 'condition', required: true, conditionKey: "is_periodic", condition: (element) => { return element == "1" }, conditionType: "number" },

                {
                    name: 'unit',
                    label: t('unit'),
                    type: 'select',
                    required: true,
                    data: data?.volume_enum?.map(item => ({ ...item, id: item.key, value: item.key, lable: item?.translations[0].name, name: item?.translations[0].name })),
                },
                { name: 'note', label: t('note'), type: 'textarea', required: true },

            ],
        },
    };

    // ----------------------------------------------------------------------



    const currentType = collection?.type; // fallback
    const currentSystemItem = types[currentType];

    const handleSubmitCreate = async (formData, runBeforePush) => {
        const body = { ...currentSystemItem.getAndSend(formData), type: collection?.type };
        console.log("to send:", body);
        const response = await createItemInSettings(body);
        if (response) {
            if (runBeforePush) runBeforePush(); // In case you later use runBeforePush
            router.push(currentSystemItem.homeHref);
        }
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading={t(currentSystemItem?.add_new_item_label)}
                links={[
                    { name: t('dashboard'), href: paths.dashboard.root },
                    { name: t(currentSystemItem?.add_new_item_label), href: paths.dashboard.settings.root },
                    { name: t('create') },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <ZaityDynamicForm
                currentItem={{ name_en: '', name_ar: '', is_private: '0' }}
                schema={currentSystemItem?.schema}
                fields={currentSystemItem?.fields(t, data)}
                onSubmit={(data) => handleSubmitCreate(data)}
            />
        </Container>
    );
};

export default SystemItemCreateView;
