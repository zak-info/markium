import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
import OrdersListView from 'src/sections/order/OrdersListView/OrdersListView';

// import { OrderListView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function ProductOrdersListPage() {

  const params = useParams();

  const { id } = params;


  return (
    <>
      <Helmet>
        <title> Dashboard: Order List</title>
      </Helmet>

      <OrdersListView product_id={id} />
    </>
  );
}
