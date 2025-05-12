import { Helmet } from 'react-helmet-async';
import { Container } from '@mui/system';
import { t } from 'i18next';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { useParams } from 'react-router';
import { useShowRole } from 'src/api/users';
import RolesCreateView from 'src/sections/user/Roles/RolesCreateView';
// ----------------------------------------------------------------------

export default function RolesEditPage() {
  const params = useParams();
  const settings = useSettingsContext();
  const { id } = params;
  const { role } = useShowRole(id)

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('roles_edit')}
          links={[
            {
              name: t('dashboard'),
              href: paths.dashboard.root,
            },
            {
              name: t('roles'),
              href: paths.dashboard.user.roles,
            },
            { name: t('roles_edit') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Helmet>
          <title> System: Edit a role</title>
        </Helmet>

        <RolesCreateView id={id} currentRole={role} />
      </Container>
    </>
  );
}
