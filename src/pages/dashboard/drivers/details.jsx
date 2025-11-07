import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { OrderDetailsView } from 'src/sections/drivers/view';

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
