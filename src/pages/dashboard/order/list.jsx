import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
import OrdersListView from 'src/sections/order/OrdersListView/OrdersListView';

// import { OrderListView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function OrderListPage() {



  return (
    <>
      <Helmet>
        <title> Dashboard: Order List</title>
      </Helmet>

      <OrdersListView  />
    </>
  );
}
