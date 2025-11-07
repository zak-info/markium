import { Helmet } from 'react-helmet-async';
import CarsListView from 'src/sections/vehicles/CarListView/CarsListView';

import { ProductListView } from 'src/sections/vehicles/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Vehicles List</title>
      </Helmet>

      {/* <ProductListView /> */}
      <CarsListView />
    </>
  );
}
