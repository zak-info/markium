import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';

import { UserEditView } from 'src/sections/clients/view';
import ClientEditView from 'src/sections/clients/view/user-edit-view';


// ----------------------------------------------------------------------

export default function ClientEditPage() {
  const params = useParams();
  const { id } = params;
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new client</title>
      </Helmet>
      <ClientEditView id={id} />
    </>
  );
}
