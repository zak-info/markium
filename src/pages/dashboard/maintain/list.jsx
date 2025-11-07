import { Helmet } from 'react-helmet-async';
import MaintenanceListView from 'src/sections/maintain/MaintenanceListView/MaintenanceListView';

import { ProductListView } from 'src/sections/maintain/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Maintenance List</title>
      </Helmet>

      {/* <ProductListView /> */}
      <MaintenanceListView />
    </>
  );
}
