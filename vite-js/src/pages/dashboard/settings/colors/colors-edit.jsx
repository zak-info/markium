import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import ColorsCreateView from 'src/sections/settings/SystemColors/ColorsCreateView';


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
