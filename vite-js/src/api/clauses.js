import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetClauses(carId) {
  const URL = endpoints.clauses.list + '/' + carId + '/clauses';

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
