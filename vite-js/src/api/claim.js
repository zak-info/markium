import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const options = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export function useGetClaim(id) {
    const { data, isLoading, error, isValidating, mutate } = useSWR(
        endpoints.contracts.claims(id),
        fetcher,
        options
    );

    const memoizedValue = useMemo(
        () => ({
            claims: data?.data || [],
            claimsLoading: isLoading,
            claimsError: error,
            claimsValidating: isValidating,
            claimsEmpty: !isLoading && !data?.data?.length,
            mutate,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}
export function useGetClauses(id) {
    const { data, isLoading, error, isValidating, mutate } = useSWR(
        endpoints.contracts.clauses(id),
        fetcher,
        options
    );

    const memoizedValue = useMemo(
        () => ({
            clauses: data?.data || [],
            clausesLoading: isLoading,
            clausesError: error,
            clausesValidating: isValidating,
            clausesEmpty: !isLoading && !data?.data?.length,
            mutate,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetAllClaim() {
    const { data, isLoading, error, isValidating, mutate } = useSWR(
        endpoints.contracts.allclaims,
        fetcher,
        options
    );

    const memoizedValue = useMemo(
        () => ({
            claims: data?.data || [],
            claimsLoading: isLoading,
            claimsError: error,
            claimsValidating: isValidating,
            claimsEmpty: !isLoading && !data?.data?.length,
            mutate,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createClaim(body) {
    const URL = endpoints.claims.new;
    return await axios.post(URL, body);
}

export async function editClaims(id, body) {
    const URL = endpoints.claims.edit(id);
    return await axios.put(URL, body);
}

export async function markClaimAsPaid(id,body) {
    const URL = endpoints.claims.paid(id);
    return await axios.post(URL, body);
  }