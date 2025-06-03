import { Helmet } from 'react-helmet-async';
import DocumentPreview from 'src/sections/documents/DocumentsListView/DocumentPreview';
import DocumentsListView from 'src/sections/documents/DocumentsListView/DocumentsListView';

import { OrderListView } from 'src/sections/documents/view';

// ----------------------------------------------------------------------

export default function InvoicePreview() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Documents Preview</title>
      </Helmet>

      {/* <OrderListView /> */}
      {/* <DocumentsListView /> */}
      <DocumentPreview />
    </>
  );
}
