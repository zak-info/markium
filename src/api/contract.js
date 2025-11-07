import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const options = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export function useGetContracts() {
    const { data, isLoading, error, isValidating, mutate } = useSWR(
        endpoints.contracts.list,
        fetcher,
        options
    );

    const memoizedValue = useMemo(
        () => ({
            contracts: data?.data || [],
            contractsLoading: isLoading,
            contractssError: error,
            contractsValidating: isValidating,
            contractsEmpty: !isLoading && !data?.data?.length,
            mutate,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export function useGetContract(id) {
    const { data, isLoading, error, isValidating, mutate } = useSWR(
        endpoints.contracts.list+"/"+id,
        fetcher,
        options
    );

    const memoizedValue = useMemo(
        () => ({
            contract: data?.data || [],
            contractLoading: isLoading,
            contractError: error,
            contractValidating: isValidating,
            contractEmpty: !isLoading && !data?.data?.length,
            mutate,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

export async function createContracts(body) {
    const URL = endpoints.contracts.list;
    return await axios.post(URL, body);
}

export async function editContracts(id, body) {
    const URL = endpoints.contracts.list + '/' + id;
    return await axios.put(URL, body);
}


export async function cancleContractClause(id,body) {
  const URL = endpoints.contracts.cancleClause(id)
  return await axios.post(URL, body);
}
export async function replaceContractClause(id,body) {
  const URL = endpoints.contracts.clause.replace(id)
  return await axios.post(URL, body);
}
export async function createContractClause(body) {
  const URL = endpoints.contracts.clause.root
  return await axios.post(URL, body);
}
export async function editContractClause(id,body) {
  const URL = endpoints.contracts.clause.root+"/"+id
  return await axios.put(URL, body);
}

export async function deleteContractClause(id) {
  const URL = endpoints.contracts.clause.root+"/"+id
  return await axios.post(URL);
}


export async function deleteContractClaim(id) {
  const URL = endpoints.contracts.allClaims.root+"/"+id
  return await axios.delete(URL);
}


export async function deleteContract(id) {
  const URL = endpoints.contracts.list+"/"+id
  return await axios.delete(URL);
}