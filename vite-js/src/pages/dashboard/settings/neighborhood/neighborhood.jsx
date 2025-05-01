import { Helmet } from 'react-helmet-async';
import NeighborhoodListView from 'src/sections/settings/SystemNeighborhoods/NeighborhoodListView';
// ----------------------------------------------------------------------

export default function NeighborhoodListPage() {
  return (
    <>
      <Helmet>
        <title> Settings: Neighborhood Page</title>
      </Helmet>
      <NeighborhoodListView />
    </>
  );
}
