import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetClauses(id) {
  const URL = endpoints.clauses.list(id) ;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      clauses: data?.data || [],
      clausesLoading: isLoading,
      clausesError: error,
      clausesValidating: isValidating,
      clausesEmpty: !isLoading && !data?.data.length,
      mutate,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function addNewClause(body) {
  const URL = endpoints.clauses.add;
  return await axios.post(URL, body);
}
export async function addNewMaintenanceClause(body) {
  const URL = endpoints.clauses.add
  return await axios.post(URL, body);
}


export async function EditClause(body) {
  const URL = endpoints.clauses.edit;
  return await axios.put(URL, body);
}

export async function deleteMaintenanceClause(id) {
  const URL = endpoints.clauses.root+"/"+id;
  return await axios.delete(URL);
}
export async function EditMaintenanceClause(id,body) {
  const URL = endpoints.clauses.edit(id);
  return await axios.put(URL, body);
}
