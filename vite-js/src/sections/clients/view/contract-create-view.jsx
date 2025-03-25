import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useTranslate } from 'src/locales';
import ContractNewEditForm from '../contract-new-edit-form';
import { useGetContract } from 'src/api/contract';

// ----------------------------------------------------------------------

export default function ContractCreateView({id}) {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  const { contract } = useGetContract(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('addNewContract')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('contractList'),
            href: paths.dashboard.clients.contracts,
          },
          { name: t('addNewContract') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ContractNewEditForm contract={contract} />
    </Container>
  );
}
