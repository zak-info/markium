import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import StoreLogoForm from 'src/sections/settings/store-logo-form';


// ----------------------------------------------------------------------

export default function StoreLogoView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('store_logo')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('settings'),
            href: paths.dashboard.settings.root,
          },
          {
            name: t('store_logo'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StoreLogoForm />
    </Container>
  );
}
