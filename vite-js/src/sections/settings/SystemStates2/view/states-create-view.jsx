import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useTranslate } from 'src/locales';
import StatesNewEditForm from './states-new-edit-form';

// ----------------------------------------------------------------------

export default function StatesCreateView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('addNewMaintenaceSpecs')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('MaintenaceSpecList'),
            href: paths.dashboard.settings.root,
          },
          { name: t('addNewMaintenaceSpecs') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <StatesNewEditForm />
    </Container>
  );
}
