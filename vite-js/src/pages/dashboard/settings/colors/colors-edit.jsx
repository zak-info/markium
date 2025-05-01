import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import ColorsCreateView from 'src/sections/settings/SystemColors/ColorsCreateView';

import StatesEditView from 'src/sections/settings/SystemStates/view/states-view';

// ----------------------------------------------------------------------

export default function ColorsEditPage() {
   const params = useParams();
  
    const { id } = params;
  
  return (
    <>
      <Helmet>
        <title> System: Edit a colors</title>
      </Helmet>

      <ColorsCreateView id={id} />
    </>
  );
}
