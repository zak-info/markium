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


export function useGetCarLogs() {
  const URL = endpoints.cars.logs;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      carLogs: data?.data || [],
      carLoading: isLoading,
      carError: error,
      carValidating: isValidating,
      carEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating]
  );
  console.log(memoizedValue);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCarUnderMaintenance() {
  const URL = endpoints.cars.under_maintainance;

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

//----------------------------------------------------------------

export function useGetBreakDown(id) {
  const URL = endpoints.cars.list + '/' + id + '/breakdown';

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      breakdown: data?.data || [],
      breakdownLoading: isLoading,
      breakdownError: error,
      breakdownValidating: isValidating,
      breakdownEmpty: !isLoading && !data?.data?.length,
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
      maintenanceEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCarCostIput() {
  const URL = endpoints.cars.transactions;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      cost_input: data?.data || [],
      cost_inputLoading: isLoading,
      cost_inputError: error,
      cost_inputValidating: isValidating,
      cost_inputEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCarPeriodicMaintenance(id) {
  const URL = endpoints.cars.pm(id);

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      maintenance: data?.data || [],
      maintenanceLoading: isLoading,
      maintenanceError: error,
      maintenanceValidating: isValidating,
      maintenanceEmpty: !isLoading && !data?.data?.length,
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
export async function attacheCarToDriver(body) {
  const URL = endpoints.cars.attach;

  return await axios.post(URL, body);
}
export async function detacheCarToDriver(body) {
  const URL = endpoints.cars.detach;

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
export async function AddCarToMentainance(id) {
  const URL = endpoints.cars.list + '/' + id+"/under_maintainance";

  return await axios.post(URL);
}
export async function markCarAsAvailable(id) {
  const URL = endpoints.cars.list + '/' + id+"/available";

  return await axios.post(URL);
}

export async function updateCarODO(id,body) {
  const URL = endpoints.cars.list + '/' + id+"/odometer";
  return await axios.post(URL, body);
}
