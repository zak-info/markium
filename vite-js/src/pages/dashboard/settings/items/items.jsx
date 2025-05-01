import { Helmet } from 'react-helmet-async';
import SystemItemListView from 'src/sections/settings/SystemItem/SystemItemListView';
// ----------------------------------------------------------------------

export default function CountriesListPage({collection}) {
  return (
    <>
      <Helmet>
        <title> Settings: {collection?.metadata} Page</title>
      </Helmet>

      <SystemItemListView collection={collection} />
    </>
  );
}
