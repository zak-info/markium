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
import showError from 'src/utils/show_error';

// ----------------------------------------------------------------------
const SystemItemCreateView = ({ collection }) => {
    const settings = useSettingsContext();
    const { t } = useTranslate();
    const { data } = useValues();
    console.log("data : data : ", data);
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
    const checkColorExists = (value) => {
        return !data?.colors?.some(
            (item) => item.key == value || item?.translations?.[0]?.name == value
        );
    };
    const checkPaymentExists = (value) => {
        return !data?.payment_methods?.some(
            (item) => item.key == value || item?.translations?.[0]?.name == value
        );
    };



    const checkCarModelExists = (value) => {
        // if (!value || !data?.car_companies) return false;
      
        return !data.car_companies.some((company) =>
          company?.models?.some((model) =>
            model?.key == value ||
            model?.translations?.[0]?.name == value 
          )
        );
      };
      


    
    const checkItemExists = (item,value) => {
        return !data?.[item]?.some(
            (item) => item?.key == value || item?.name == value || item?.translations?.[0]?.name == value
        );
    };





    const types = {
       
        categories: {
            add_new_item_label: "add_new_category",
            homeHref: paths.dashboard.settings.categories,
            getAndSend: (data) => ({
                name: data.name,
                description: data.description,
                is_active:true,
            }),
            schema: Yup.object().shape({
                name: Yup.string().required(t("validation_required")),
                description: Yup.string()
                    
            }),
            fields: (t) => [
                { name: 'name', label: t('name'), type: 'text', required: true },
                { name: 'description', label: t('description'), type: 'textarea', required: true },
            ],
        },
       
    };

    // ----------------------------------------------------------------------

    const currentType = collection?.type; // fallback
    const currentSystemItem = types[currentType];

    const handleSubmitCreate = async (formData, runBeforePush) => {
        try {
            const body = { ...currentSystemItem.getAndSend(formData), type: collection?.type };
            console.log("to send:", body);
            const response = await createItemInSettings(collection?.type,body);
            if (response){
                if (runBeforePush) runBeforePush(); // In case you later use runBeforePush
                router.push(currentSystemItem.homeHref);
            }
        } catch (error) {
            console.log("error : ", error);
            throw error
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
