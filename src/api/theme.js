import useSWR from 'swr';
import { useMemo } from 'react';
import axios , { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------




const options = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};



// ----------------------------------------------------------------------


// ----------------------------------------------------------------------



export async function createTheme(body) {
  const URL = endpoints.product.root;

  return await axios.post(URL, body);
}



export async function updateTheme(data) {
    const URL = endpoints.store.root;
    console.log(" URL : ",URL)
    return await axios.post(URL, data);
}