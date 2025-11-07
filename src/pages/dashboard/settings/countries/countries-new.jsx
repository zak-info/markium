import { Helmet } from 'react-helmet-async';
import CountriesCreateView from 'src/sections/settings/SystemCountries/CountriesCreateView';

// ----------------------------------------------------------------------

export default function CountriesCreatePage() {
  return (
    <>
      <Helmet>
        <title> System: Countries Page</title>
      </Helmet>
      <CountriesCreateView />
    </>
  );
}
