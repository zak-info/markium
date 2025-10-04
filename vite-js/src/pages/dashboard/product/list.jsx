import { Helmet } from 'react-helmet-async';
import ProductsListView from 'src/sections/product/ProductsListView/ProductsListView';

// import { ProductListView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Product List</title>
      </Helmet>

      <ProductsListView />
    </>
  );
}
