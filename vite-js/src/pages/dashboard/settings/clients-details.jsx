import { Helmet } from 'react-helmet-async';

import { OrderDetailsView } from 'src/sections/clients/view';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Profile Page</title>
      </Helmet>

      <OrderDetailsView />
    </>
  );
}
