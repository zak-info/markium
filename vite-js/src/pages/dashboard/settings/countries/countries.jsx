import { Helmet } from 'react-helmet-async';
import CountriesListView from 'src/sections/settings/SystemCountries/CountriesListView';
// ----------------------------------------------------------------------

export default function CountriesListPage() {
  return (
    <>
      <Helmet>
        <title> Settings: Countries Page</title>
      </Helmet>

      <CountriesListView />
    </>
  );
}
