import { Helmet } from 'react-helmet-async';


import MainSpecListView from 'src/sections/system_periodic_maintenance/view/main_spec-list-view';

// ----------------------------------------------------------------------

export default function MainSpecListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Maintenances Specs Page</title>
      </Helmet>

      <MainSpecListView />
    </>
  );
}
