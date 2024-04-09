import { Helmet } from 'react-helmet-async';

import { OrderListView } from 'src/sections/drivers/view';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Documents Page</title>
      </Helmet>

      <OrderListView />
    </>
  );
}
