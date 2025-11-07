import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetProduct } from 'src/api/product';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';
import { useTranslate } from 'src/locales';
import { useGetCar } from 'src/api/car';
import UserEditForm from '../user-edit-form';


// ----------------------------------------------------------------------

export default function ProductEditView({ id }) {
  const settings = useSettingsContext();

  const { car } = useGetCar();

  const currentCar = car?.find((i) => i.id == id);

  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('edit')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          {
            name: t('vehicle'),
            href: paths.dashboard.product.root,
          },
          { name: t('edit') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {
        currentCar?.id ?
          <UserEditForm currentCar={currentCar} />
          :
          <UserNewEditForm currentCar={currentCar} />
      }

    </Container>
  );
}

ProductEditView.propTypes = {
  id: PropTypes.string,
};
