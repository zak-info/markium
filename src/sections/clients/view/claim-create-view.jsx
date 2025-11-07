import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useTranslate } from 'src/locales';
import ContractNewEditForm from '../contract-new-edit-form';
import ClaimNewEditForm from '../claim-new-edit-form';

// ----------------------------------------------------------------------

export default function ClaimCreateView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('addNewClaim')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('claimList'),
            href: paths.dashboard.clients.contracts,
          },
          { name: t('addNewClaim') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ClaimNewEditForm />
    </Container>
  );
}
