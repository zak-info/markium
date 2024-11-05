import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetCar() {
  const URL = endpoints.cars.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      car: data?.data || [],
      carLoading: isLoading,
      carError: error,
      carValidating: isValidating,
      carEmpty: !isLoading && !data?.data.length,
      mutate,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetBreakDown(id) {
  const URL = endpoints.cars.list + '/' + id + '/breakdown';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      breakdown: data?.data || [],
      breakdownLoading: isLoading,
      breakdownError: error,
      breakdownValidating: isValidating,
      breakdownEmpty: !isLoading && !data?.data.length,
      mutate,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCarMaintenance(id) {
  const URL = endpoints.cars.list + '/' + id + '/maintenance';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

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

export function useGetCompanyByID(id) {
  const URL = endpoints.cars.list + '/' + id;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      carDetails: data?.data,
      carDetailsLoading: isLoading,
      carDetailsError: error,
      carDetailsValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const URL = query ? [endpoints.cars.list, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createCar(body) {
  const URL = endpoints.cars.list;

  return await axios.post(URL, body);
}

// ----------------------------------------------------------------------

export async function editCar(id, body) {
  const URL = endpoints.cars.list + '/' + id;

  return await axios.put(URL, body);
}

// ----------------------------------------------------------------------

export async function deleteCar(id) {
  const URL = endpoints.cars.list + '/' + id;

  return await axios.delete(URL);
}
