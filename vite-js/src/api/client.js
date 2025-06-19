import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const options = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export function useGetClients() {
    const { data, isLoading, error, isValidating, mutate } = useSWR(
        endpoints.clients.list,
        fetcher,
        options
    );

    const memoizedValue = useMemo(
        () => ({
            clients: data?.data || [],
            clientsLoading: isLoading,
            clientsError: error,
            clientsValidating: isValidating,
            clientsEmpty: !isLoading && !data?.data?.length,
            mutate,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}
export function useGetClient(id) {
    const { data, isLoading, error, isValidating, mutate } = useSWR(
        endpoints.clients.client(id),
        fetcher,
        options
    );

    const memoizedValue = useMemo(
        () => ({
            client: data?.data || {},
            clientLoading: isLoading,
            clientError: error,
            clientValidating: isValidating,
            clientEmpty: !isLoading && !data?.data?.length,
            mutate,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createClient(body) {
    const URL = endpoints.clients.list;
    return await axios.post(URL, body);
}

export async function editClient(id, body) {
    const URL = endpoints.clients.list + '/' + id;
    return await axios.put(URL, body);
}