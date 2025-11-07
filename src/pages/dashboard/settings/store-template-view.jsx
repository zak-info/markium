import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import StoreTemplateForm from 'src/sections/settings/store-template-form';


// ----------------------------------------------------------------------

export default function StoreTemplateView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('store_template')}
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
            name: t('store_template'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StoreTemplateForm />
    </Container>
  );
}
