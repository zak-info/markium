import { Container } from '@mui/material';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import UsersCreateView from 'src/sections/user/Users/UsersCreateView';

// ----------------------------------------------------------------------

export default function UsersCreatePage({ }) {
   const settings = useSettingsContext();
  return (
    <>
      {/* <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('add_user')}
          links={[
            {
              name: t('dashboard'),
              href: paths.dashboard.root,
            },
            {
              name: t('users'),
              href: paths.dashboard.user.roles,
            },
            { name: t('add_user') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        /> */}
        <Helmet>
          <title> System: Users Page</title>
        </Helmet>
        <UsersCreateView />
      {/* </Container> */}
    </>
  );
}
