import { Container } from '@mui/material';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { useShowRole, useShowUser } from 'src/api/users';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import UsersCreateView from 'src/sections/user/Users/UsersCreateView';
// ----------------------------------------------------------------------

export default function UsersEditPage() {
   const settings = useSettingsContext();
  const params = useParams();

  const { id } = params;
  const { user } = useShowUser(id)

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('edit_user')}
          links={[
            {
              name: t('dashboard'),
              href: paths.dashboard.root,
            },
            {
              name: t('users'),
              href: paths.dashboard.user.roles,
            },
            { name: t('edit_user') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Helmet>
          <title> System: Edit a user</title>
        </Helmet>
        <UsersCreateView id={id} currentUser={user} />
      </Container>
    </>
  );
}
