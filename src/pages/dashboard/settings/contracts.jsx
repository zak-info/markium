import { Helmet } from 'react-helmet-async';

import { ContractsListView } from 'src/sections/clients/view';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Contracts Page</title>
      </Helmet>

      <ContractsListView />
    </>
  );
}
