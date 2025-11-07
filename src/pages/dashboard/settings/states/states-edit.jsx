import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';

import StatesEditView from 'src/sections/settings/SystemStates/view/states-view';

// ----------------------------------------------------------------------

export default function StatesEditPage() {
   const params = useParams();
  
    const { id } = params;
  
  return (
    <>
      <Helmet>
        <title> System: Edit a state</title>
      </Helmet>

      <StatesEditView id={id} />
    </>
  );
}
