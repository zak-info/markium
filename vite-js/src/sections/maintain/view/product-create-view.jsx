import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form.jsx';
import { useTranslate } from 'src/locales';
import { useGetMaintenance } from 'src/api/maintainance.js';

// ----------------------------------------------------------------------

export default function UserCreateView({ id }) {
  const settings = useSettingsContext();

  const { t } = useTranslate();

  const { maintenance,mutate } = useGetMaintenance();

  const currentMentainance = maintenance?.find((i) => i.id == id);


  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('addNewMaintain')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('maintenance'),
            href: paths.dashboard.maintenance.root,
          },
          { name: t('addNewMaintain') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentMentainance={currentMentainance} />
    </Container>
  );
}
