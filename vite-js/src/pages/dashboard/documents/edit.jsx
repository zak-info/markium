import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';

import { UserEditView } from 'src/sections/documents/view';


// ----------------------------------------------------------------------

export default function DocumentEditPage() {
     const params = useParams();
    
      const { id } = params;
  return (
    <>
      <Helmet>
        <title> Dashboard: Edit document</title>
      </Helmet>

      <UserEditView id={id} />
    </>
  );
}
