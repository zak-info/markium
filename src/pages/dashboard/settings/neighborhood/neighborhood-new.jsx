import { Helmet } from 'react-helmet-async';
import DocumentCreateView from 'src/sections/settings/SystemDocuments/DocumentCreateView';
import NeighborhoodCreateView from 'src/sections/settings/SystemNeighborhoods/NeighborhoodCreateView';
import StatesCreateView from 'src/sections/settings/SystemStates/StatesCreateView';

// ----------------------------------------------------------------------

export default function NeighborhoodCreatePage() {
  return (
    <>
      <Helmet>
        <title> System: Neighborhood Page</title>
      </Helmet>
      <NeighborhoodCreateView />
    </>
  );
}
