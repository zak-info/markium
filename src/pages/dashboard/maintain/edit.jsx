import { Helmet } from 'react-helmet-async';

import { ProductCreateView } from 'src/sections/maintain/view';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function ProductCreatePage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new product</title>
      </Helmet>

      <ProductCreateView id={`${id}`} />
    </>
  );
}
