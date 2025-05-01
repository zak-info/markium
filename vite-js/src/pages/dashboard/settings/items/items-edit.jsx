import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import SystemItemCreateView from 'src/sections/settings/SystemItem/SystemItemCreateView';
// ----------------------------------------------------------------------

export default function CountriesEditPage({collection}) {
   const params = useParams();
  
    const { id } = params;
  
  return (
    <>
      <Helmet>
        <title> System: Edit a {collection?.metadata}</title>
      </Helmet>

      <SystemItemCreateView id={id} collection={collection} />
    </>
  );
}
