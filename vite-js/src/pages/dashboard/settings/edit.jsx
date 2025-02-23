import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';

import { UserEditView } from 'src/sections/clients/view';
import MainSpecEditView from 'src/sections/system_periodic_maintenance/view/main_spec-edit-view';

// ----------------------------------------------------------------------

export default function MainSpecEditPage() {
   const params = useParams();
  
    const { id } = params;
  
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new client</title>
      </Helmet>

      <MainSpecEditView id={id} />
    </>
  );
}
