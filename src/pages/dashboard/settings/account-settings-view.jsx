import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AccountSettingsForm from '../../../sections/settings/account-settings-form';

// ----------------------------------------------------------------------

export default function AccountSettingsView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('account_settings')}
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
            name: t('account_details'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AccountSettingsForm />
    </Container>
  );
}
