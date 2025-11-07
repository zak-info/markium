import { Helmet } from 'react-helmet-async';
import DocumentCreateView from 'src/sections/settings/SystemDocuments/DocumentCreateView';
import StatesCreateView from 'src/sections/settings/SystemStates/StatesCreateView';

// ----------------------------------------------------------------------

export default function DocumentCreatePage() {
  return (
    <>
      <Helmet>
        <title> System: Document Page</title>
      </Helmet>
      <DocumentCreateView />
    </>
  );
}
