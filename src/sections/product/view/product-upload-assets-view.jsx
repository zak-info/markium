import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProductUploadAssetsForm from '../product-upload-assets-form';

// ----------------------------------------------------------------------

export default function ProductUploadAssetsView({ currentProduct }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('upload_assets')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('products'),
            href: paths.dashboard.product.root,
          },
          {
            name: currentProduct?.name || t('product'),
            href: paths.dashboard.product.details(currentProduct?.id),
          },
          { name: t('upload_assets') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductUploadAssetsForm currentProduct={currentProduct} />
    </Container>
  );
}
