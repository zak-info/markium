import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetDocuments() {
  const URL = endpoints.documents.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      documents: data?.data || [],
      documentsLoading: isLoading,
      documentsError: error,
      documentsValidating: isValidating,
      documentsEmpty: !isLoading && !data?.data?.length,
      mutate,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}



export function useGetDocument(id) {
  const URL = endpoints.documents.list+"/"+id;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      document: data?.data || {},
      documentLoading: isLoading,
      documentError: error,
      documentValidating: isValidating,
      documentEmpty: !isLoading && !data,
      mutate,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}




// ----------------------------------------------------------------------

export function useGetDocumentByID(id) {
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

export async function createDocument(body) {
  const URL = endpoints.documents.list;

  return await axios.post(URL, body);
}

// ----------------------------------------------------------------------

export async function editDocument(id, body) {
  const URL = endpoints.documents.list + '/' + id+"/update";

  return await axios.post(URL, body);
}

export async function editDocument2(id, body) {
  const URL = endpoints.documents.list + '/' + id;

  return await axios.put(URL, body);
}

// ----------------------------------------------------------------------

export async function deleteDocument(id) {
  const URL = endpoints.documents.list + '/' + id;

  return await axios.delete(URL);
}
