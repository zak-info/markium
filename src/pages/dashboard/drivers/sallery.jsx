import { Helmet } from 'react-helmet-async';

import { SalaryListView } from 'src/sections/drivers/view';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Salary Page</title>
      </Helmet>

      <SalaryListView />
    </>
  );
}
