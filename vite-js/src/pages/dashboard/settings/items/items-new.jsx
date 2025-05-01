import { Helmet } from 'react-helmet-async';
import SystemItemCreateView from 'src/sections/settings/SystemItem/SystemItemCreateView';

// ----------------------------------------------------------------------

export default function SystemItemCreatePage({collection}) {
  return (
    <>
      <Helmet>
        <title> System: {collection?.metadata} Page</title>
      </Helmet>
      <SystemItemCreateView collection={collection} />
    </>
  );
}
