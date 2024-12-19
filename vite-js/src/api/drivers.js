import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const options = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetDrivers() {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    endpoints.drivers.list,
    fetcher,
    options
  );

  const memoizedValue = useMemo(
    () => ({
      drivers: data?.data || [],
      driversLoading: isLoading,
      driversError: error,
      driversValidating: isValidating,
      driversEmpty: !isLoading && !data?.data.length,
      mutate,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
