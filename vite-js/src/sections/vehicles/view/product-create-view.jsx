import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';
import { useTranslate } from 'src/locales';
import { useValues } from 'src/api/utils';

// ----------------------------------------------------------------------

export default function UserCreateView() {
  const settings = useSettingsContext();

  const { t } = useTranslate();


  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('addNewVehicle')}
          links={[
            {
              name: t('dashboard'),
              href: paths.dashboard.root,
            },
            {
              name: t('vehicles'),
              href: paths.dashboard.vehicle.root,
            },
            { name: t('addNewVehicle') },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <UserNewEditForm />
      </Container>
    </>
  );
}
