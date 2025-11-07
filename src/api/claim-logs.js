import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const options = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export function useGetClaimLogs() {
    const { data, isLoading, error, isValidating, mutate } = useSWR(
        endpoints.claims.logs,
        fetcher,
        options
    );

    const memoizedValue = useMemo(
        () => ({
            logs: data?.data || [],
            logsLoading: isLoading,
            logsError: error,
            logsValidating: isValidating,
            logsEmpty: !isLoading && !data?.data?.length,
            mutate,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}
