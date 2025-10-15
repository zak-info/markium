import useSWR from 'swr';
import { useMemo } from 'react';
import axios , { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------




const options = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export function useGetOrdersByProduct(product_id) {
    const { data, isLoading, error, isValidating, mutate } = useSWR(
      endpoints.product.orders(product_id || 4),
        fetcher,
        options
    );
    console.log("data : ",data);
    console.log("error : ",error);

    const memoizedValue = useMemo(
        () => ({
            orders: data?.data || [],
            ordersLoading: isLoading,
            ordersError: error,
            ordersValidating: isValidating,
            ordersEmpty: !isLoading && !data?.data?.length,
            mutate,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}


export function useGetOrders() {
    const { data, isLoading, error, isValidating, mutate } = useSWR(
      endpoints.product.allOrders,
        fetcher,
        options
    );
    console.log("data : ",data);
    console.log("error : ",error);

    const memoizedValue = useMemo(
        () => ({
            orders: data?.data || [],
            ordersLoading: isLoading,
            ordersError: error,
            ordersValidating: isValidating,
            ordersEmpty: !isLoading && !data?.data?.length,
            mutate,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------



export async function createProduct(body) {
  const URL = endpoints.product.root;

  return await axios.post(URL, body);
}



export async function updateOrder(product_id,order_id, body) {
    const URL = endpoints.product.updateOrdersStatus(product_id,order_id);
    console.log(" URL : ",URL)
    return await axios.patch(URL, body);
}