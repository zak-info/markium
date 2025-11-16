import { Helmet } from 'react-helmet-async';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useTranslate } from 'src/locales';
import StoreLocationForm from 'src/sections/settings/store-location-form';

// ----------------------------------------------------------------------

export default function StoreLocationView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title>{t('store_location')} | {t('settings')}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('store_location')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('settings'), href: paths.dashboard.settings.root },
            { name: t('store_location') },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <StoreLocationForm />
      </Container>
    </>
  );
}
