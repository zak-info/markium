import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import DocumentCreateView from 'src/sections/settings/SystemDocuments/DocumentCreateView';

// ----------------------------------------------------------------------

export default function DocumentEditPage() {
   const params = useParams();
  
    const { id } = params;
  
  return (
    <>
      <Helmet>
        <title> System: Edit a Document</title>
      </Helmet>

      <DocumentCreateView id={id} />
    </>
  );
}
