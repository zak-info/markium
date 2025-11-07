import { Helmet } from 'react-helmet-async';
import CostInputs from 'src/sections/vehicles/Cost&Inputs/Cost&Inputs';

import { InputsListView } from 'src/sections/vehicles/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Costs List</title>
      </Helmet>

      {/* <InputsListView /> */}
      <CostInputs />
    </>
  );
}
