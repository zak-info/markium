import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import YearlyPaymentForm from 'src/sections/settings/yearly-payment-form';


// ----------------------------------------------------------------------

export default function YearlyPaymentView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('yearly_payment')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('settings'),
            href: paths.dashboard.settings.root,
          },
          {
            name: t('yearly_payment'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <YearlyPaymentForm />
    </Container>
  );
}