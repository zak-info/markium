import { Helmet } from 'react-helmet-async';
import DocumentsListView from 'src/sections/documents/DocumentsListView/DocumentsListView';

import { OrderListView } from 'src/sections/documents/view';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Documents Page</title>
      </Helmet>

      {/* <OrderListView /> */}
      <DocumentsListView />
    </>
  );
}
