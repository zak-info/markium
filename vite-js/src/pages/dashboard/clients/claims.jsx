import { Helmet } from 'react-helmet-async';

import { ClaimsListView } from 'src/sections/clients/view';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Claims Page</title>
      </Helmet>

      <ClaimsListView />
    </>
  );
}
