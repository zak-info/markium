import { Helmet } from 'react-helmet-async';
import { useGetProduct } from 'src/api/product';

import { useParams } from 'src/routes/hooks';

import { ProductUploadAssetsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function ProductUploadAssetsPage() {
  const params = useParams();

  const { id } = params;
  const { product } = useGetProduct(id);

  return (
    <>
      <Helmet>
        <title> Dashboard: Product Upload Assets</title>
      </Helmet>

      <ProductUploadAssetsView currentProduct={product} />
    </>
  );
}
