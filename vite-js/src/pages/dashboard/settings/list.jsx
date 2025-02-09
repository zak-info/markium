import { Helmet } from 'react-helmet-async';

import { ClientsListView } from 'src/sections/clients/view';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Clients Page</title>
      </Helmet>

      <ClientsListView />
    </>
  );
}
