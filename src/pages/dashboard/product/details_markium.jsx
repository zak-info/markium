import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import ProductDetailsMarkiumView from 'src/sections/product/view/product-details-view-markium';

// ----------------------------------------------------------------------

export default function ProductDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Product Details</title>
      </Helmet>

      <ProductDetailsMarkiumView id={`${id}`} />
    </>
  );
}
