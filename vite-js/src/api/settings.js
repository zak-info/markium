import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const options = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export function useGetMainSpecs() {
    const { data, isLoading, error, isValidating, mutate } = useSWR(
        endpoints.settings?.mainspecs,
        fetcher,
        options
    );

    const memoizedValue = useMemo(
        () => ({
            mainspecs: data?.data || [],
            mainspecsLoading: isLoading,
            mainspecsError: error,
            mainspecsValidating: isValidating,
            mainspecsEmpty: !isLoading && !data?.data?.length,
            mutate,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}
export function useGetMainSpec(id) {
    const { data, isLoading, error, isValidating, mutate } = useSWR(
        endpoints.settings?.mainspecs+"/"+id,
        fetcher,
        options
    );

    const memoizedValue = useMemo(
        () => ({
            mainspec: data?.data || [],
            mainspecLoading: isLoading,
            mainspecError: error,
            mainspecValidating: isValidating,
            mainspecEmpty: !isLoading && !data?.data?.length,
            mutate,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createMainSpec(body) {
    const URL = endpoints.settings?.mainspecs;
    return await axios.post(URL, body);
}

export async function editMainSpec(id, body) {
    const URL = endpoints.settings?.mainspecs+'/' + id;
    return await axios.put(URL, body);
}


export function useGetSystemVisibleItem(type) {
    const { data, isLoading, error, isValidating, mutate } = useSWR(
        endpoints.settings?.items+"/"+type,
        fetcher,
        options
    );

    const memoizedValue = useMemo(
        () => ({
            items: data?.data || [],
            itemsLoading: isLoading,
            itemsError: error,
            itemsValidating: isValidating,
            itemsEmpty: !isLoading && !data?.data?.length,
            mutate,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createItemInSettings(body) {
    const URL = endpoints.settings.items;
    return await axios.post(URL, body);
}
export async function changeItemVisibilityInSettings(body) {
    const URL = endpoints.settings.visibility;
    return await axios.post(URL, body);
}