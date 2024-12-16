import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const options = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetMaintenance() {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    endpoints.maintenance.list,
    fetcher,
    options
  );

  const memoizedValue = useMemo(
    () => ({
      maintenance: data?.data || [],
      maintenanceLoading: isLoading,
      maintenanceError: error,
      maintenanceValidating: isValidating,
      maintenanceEmpty: !isLoading && !data?.data.length,
      mutate,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createMaintenance(body) {
  const URL = endpoints.maintenance.list;

  return await axios.post(URL, body);
}

// ----------------------------------------------------------------------

export async function editMaintenance(id, body) {
  const URL = endpoints.maintenance.list + '/' + id;

  return await axios.put(URL, body);
}

// ----------------------------------------------------------------------

export async function deleteMaintenance(id) {
  const URL = endpoints.maintenance.list + '/' + id;

  return await axios.delete(URL);
}
