import { Helmet } from 'react-helmet-async';

import { CompanyListView } from 'src/sections/compnay/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Company List</title>
      </Helmet>

      <CompanyListView />
    </>
  );
}
