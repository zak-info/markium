import useSWR from 'swr';
import { useMemo } from 'react';

import axios , { fetcher, endpoints } from 'src/utils/axios';
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

export function useGetProducts() {
  const URL = endpoints.product.root;
  const { data, isLoading, error, isValidating } = useSWR( URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: data?.data?.products || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.data?.products?.length,
    }),
    [data?.data?.products, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId) {
  const URL = endpoints.product.root ;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  console.log(" : data : ",data)

  const memoizedValue = useMemo(
    () => ({
      product: data?.data?.products?.find( p => p.id == productId) || null,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating, productId]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );
  return memoizedValue;
}



export async function createProduct(body) {
  const URL = endpoints.product.root;
  return await axios.post(URL, body);
}

export async function updateProduct(id,body) {
  const URL = endpoints.product.update(id);
  return await axios.post(URL, body);
}

export async function deployProduct(id) {
  const URL = endpoints.product.deploy(id)
  return await axios.post(URL);
}

export async function uploadProductImages(id, body) {
  const URL = endpoints.product.assets(id);
  return await axios.post(URL, body);
}