import { Helmet } from 'react-helmet-async';

import { ProductListView } from 'src/sections/vehicles/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Vehicles List</title>
      </Helmet>

      <ProductListView />
    </>
  );
}
