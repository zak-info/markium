import { Container } from '@mui/system';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import RolesCreateView from 'src/sections/user/Roles/RolesCreateView';

// ----------------------------------------------------------------------

export default function RolesCreatePage({ }) {
      const settings = useSettingsContext();
  
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('roles_add')}
          links={[
            {
              name: t('dashboard'),
              href: paths.dashboard.root,
            },
            {
              name: t('roles'),
              href: paths.dashboard.user.roles,
            },
            { name: t('roles_add') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Helmet>
          <title> System: Roles Page</title>
        </Helmet>
        <RolesCreateView />
      </Container>
    </>
  );
}
