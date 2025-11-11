import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import MarketingPixelsForm from 'src/sections/settings/marketing-pixels-form';


// ----------------------------------------------------------------------

export default function MarketingPixelsView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('social_media_pixels')}
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
            name: t('social_media_pixels'),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <MarketingPixelsForm />
    </Container>
  );
}
