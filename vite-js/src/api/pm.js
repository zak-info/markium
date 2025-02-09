import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useCarPeriodicMintenances(id) {
  const URL = endpoints.cars.pm(id) ;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      pms: data?.data || [],
      pmsLoading: isLoading,
      pmsError: error,
      pmsValidating: isValidating,
      pmsEmpty: !isLoading && !data?.data.length,
      mutate,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function addNewPm(id,body) {
  const URL = endpoints.cars.pm(id) ;
  return await axios.post(URL, body);
}
