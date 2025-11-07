import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetCompany() {
  const URL = endpoints.company.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      company: data?.data || [],
      companyLoading: isLoading,
      companyError: error,
      companyValidating: isValidating,
      companyEmpty: !isLoading && !data?.data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCompanyByID(productId) {
  const URL = productId ? [endpoints.company.list, { params: { productId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      product: data?.product,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const URL = query ? [endpoints.company.list, { params: { query } }] : '';

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

export async function createCompany(body) {
  const URL = endpoints.company.list;

  return await axios.post(URL, body);
}

// ----------------------------------------------------------------------

export async function editCompany(body) {
  const URL = endpoints.company.list;

  return await axios.put(URL, body);
}

// ----------------------------------------------------------------------

export async function deleteCompany(id) {
  const URL = endpoints.company.list;

  return await axios.delete(URL);
}
