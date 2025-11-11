import { Helmet } from 'react-helmet-async';

import { useSettingsContext } from 'src/components/settings';
import Container from '@mui/material/Container';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTranslate } from 'src/locales';
import { paths } from 'src/routes/paths';

import ContactsSocialForm from 'src/sections/settings/contacts-social-form';

// ----------------------------------------------------------------------

export default function ContactsSocialView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title>{t('contacts_social_media')} | {t('settings')}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t('contacts_social_media')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('settings'), href: paths.dashboard.settings.root },
            { name: t('contacts_social_media') },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <ContactsSocialForm />
      </Container>
    </>
  );
}
