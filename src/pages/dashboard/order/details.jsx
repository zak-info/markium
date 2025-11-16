import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { OrderDetailsView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function OrderDetailsPage() {
  const params = useParams();

  const { product_id, order_id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Order Details</title>
      </Helmet>

      <OrderDetailsView product_id={product_id} order_id={order_id} />
    </>
  );
}
