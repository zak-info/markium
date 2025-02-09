import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';
import { useTranslate } from 'src/locales';
import { useGetClient } from 'src/api/client';

// ----------------------------------------------------------------------

export default function ClientEditView({id}) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  console.log(id);
    
    const { client } = useGetClient(id);
  
  

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('addNewClient')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('ClientsList'),
            href: paths.dashboard.clients.root,
          },
          { name: t('addNewClient') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentClient={client} />
    </Container>
  );
}
