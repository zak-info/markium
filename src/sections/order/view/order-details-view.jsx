import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { useTranslate } from 'src/locales';
import showError from 'src/utils/show_error';

import OrderDetailsInfo from '../order-details-info';
import OrderDetailsItems from '../order-details-item';
import OrderDetailsToolbar from '../order-details-toolbar';
import { useGetOrder, updateOrder } from 'src/api/orders';

// ----------------------------------------------------------------------

export default function OrderDetailsView({ product_id, order_id }) {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const loading = useBoolean();

  const { order, mutate } = useGetOrder(product_id, order_id);
  const [currentOrder, setOrder] = useState(order);
  const [status, setStatus] = useState(currentOrder?.status);

  useEffect(() => {
    setOrder(order);
    setStatus(order?.status);
  }, [order]);

  const handleChangeStatus = useCallback(
    async (newStatus) => {
      try {
        loading.onTrue();

        await updateOrder(product_id, order_id, { status: newStatus });

        // Update local state
        setStatus(newStatus);
        setOrder(prev => ({ ...prev, status: newStatus }));

        // Revalidate data
        mutate();

        enqueueSnackbar(t('order_status_updated_successfully'), { variant: 'success' });
        loading.onFalse();
      } catch (error) {
        loading.onFalse();
        showError(error);
      }
    },
    [product_id, order_id, loading, mutate, enqueueSnackbar, t]
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <OrderDetailsToolbar
        backLink={paths.dashboard.order.root}
        orderNumber={currentOrder?.id}
        createdAt={currentOrder?.created_at}
        status={status}
        onChangeStatus={handleChangeStatus}
        loading={loading.value}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              order={currentOrder}
            />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            order={currentOrder}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

OrderDetailsView.propTypes = {
  id: PropTypes.string,
};
