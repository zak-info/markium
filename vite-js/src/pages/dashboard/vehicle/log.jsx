import { Helmet } from 'react-helmet-async';

import { OrderListView } from 'src/sections/logs/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Product List</title>
      </Helmet>

      <OrderListView />
    </>
  );
}
