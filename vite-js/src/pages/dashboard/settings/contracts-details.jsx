import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';

import { ContractsDetailsView } from 'src/sections/clients/view';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  const params = useParams()
  const {id} = params;
  return (
    <>
      <Helmet>
        <title> Dashboard: Contracts Page</title>
      </Helmet>

      <ContractsDetailsView id={id} />
    </>
  );
}
