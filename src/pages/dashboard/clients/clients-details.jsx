import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';

import { OrderDetailsView } from 'src/sections/clients/view';

// ----------------------------------------------------------------------

export default function InvoiceListPage() {
  const params = useParams();
  const { id } = params;
  return (
    <>
      <Helmet>
        <title> Dashboard: Profile Page</title>
      </Helmet>

      <OrderDetailsView id={id} />
    </>
  );
}
