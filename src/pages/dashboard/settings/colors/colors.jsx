import { Helmet } from 'react-helmet-async';
import ColorsListView from 'src/sections/settings/SystemColors/ColorsListView';
// ----------------------------------------------------------------------

export default function ColorsListPage() {
  return (
    <>
      <Helmet>
        <title> Settings: Colors Page</title>
      </Helmet>

      <ColorsListView />
    </>
  );
}
