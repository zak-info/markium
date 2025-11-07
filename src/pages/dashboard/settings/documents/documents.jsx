import { Helmet } from 'react-helmet-async';
import DocumentListView from 'src/sections/settings/SystemDocuments/DocumentListView';
// ----------------------------------------------------------------------

export default function DocumentListPage() {
  return (
    <>
      <Helmet>
        <title> Settings: Document Page</title>
      </Helmet>

      <DocumentListView />
    </>
  );
}
