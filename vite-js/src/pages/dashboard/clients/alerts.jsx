import { Helmet } from 'react-helmet-async';

import { AlertsListView } from 'src/sections/clients/view';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Alerts Page</title>
      </Helmet>

      <AlertsListView />
    </>
  );
}
