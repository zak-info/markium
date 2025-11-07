import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

export default function UserCreateView() {
  const settings = useSettingsContext();
  const { t } = useTranslation();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('addNewUser')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('userList'),
            href: paths.dashboard.user.list,
          },
          { name: t('addNewUser') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm />
    </Container>
  );
}
