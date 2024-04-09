import { Helmet } from 'react-helmet-async';

import { NotificationListView } from 'src/sections/documents/view';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Notification Page</title>
      </Helmet>

      <NotificationListView />
    </>
  );
}
