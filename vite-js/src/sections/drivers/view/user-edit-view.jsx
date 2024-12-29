import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';
import { useTranslate } from 'src/locales';
import { from } from 'stylis';

import { useGetDrivers } from 'src/api/drivers';

// ----------------------------------------------------------------------

export default function UserCreateView({ id }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  const { drivers } = useGetDrivers();

  const currentDriver = drivers?.find((i) => i.id == id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('editDriver')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('driversList'),
            href: paths.dashboard.documents.root,
          },
          { name: t('editDriver') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentDriver={currentDriver} />
    </Container>
  );
}
