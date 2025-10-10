import useSWR from 'swr';
import { useMemo } from 'react';
import axios , { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetOrdersByProduct(product_id) {
  const URL = endpoints.product.orders(4);
  const { data, isLoading, error, isValidating } = useSWR("/products/4/orders", fetcher);
  console.log("URL : ",URL)
  console.log("error :error error error ",error)
  console.log("data : ",data)

  const memoizedValue = useMemo(
    () => ({
      orders: data?.data || [],
      ordersLoading: isLoading,
      ordersError: error,
      ordersValidating: isValidating,
      ordersEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------



export async function createProduct(body) {
  const URL = endpoints.product.root;

  return await axios.post(URL, body);
}