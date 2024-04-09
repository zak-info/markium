import { Helmet } from 'react-helmet-async';

import { InputsListView } from 'src/sections/vehicles/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Costs List</title>
      </Helmet>

      <InputsListView />
    </>
  );
}
