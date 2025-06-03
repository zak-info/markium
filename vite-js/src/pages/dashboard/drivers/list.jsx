import { Helmet } from 'react-helmet-async';
import DriverListView from 'src/sections/drivers/DriverListView/DriverListView';

import { OrderListView } from 'src/sections/drivers/view';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Documents Page</title>
      </Helmet>

      {/* <OrderListView /> */}
      <DriverListView />
    </>
  );
}
