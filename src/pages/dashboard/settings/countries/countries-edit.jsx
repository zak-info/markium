import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import CountriesCreateView from 'src/sections/settings/SystemCountries/CountriesCreateView';
// ----------------------------------------------------------------------

export default function CountriesEditPage() {
   const params = useParams();
  
    const { id } = params;
  
  return (
    <>
      <Helmet>
        <title> System: Edit a Countries</title>
      </Helmet>

      <CountriesCreateView id={id} />
    </>
  );
}
