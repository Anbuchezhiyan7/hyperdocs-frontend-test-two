import {
    QueryClient,
    useMutation,
    useQueryClient,
    useSuspenseQuery,
    UseSuspenseQueryOptions,
} from '@tanstack/react-query';
import { useState } from 'react';

type useSendDataProps<TVariables = unknown> = {
    success?: (data: any) => void;
    error?: (data: any) => void;
    fn: (variables: TVariables) => Promise<any>;
    invalidateKey?: Array<string>;
};

/**
 * Factory — called once in the QueryProvider.
 * staleTime: data is "fresh" for 5 min, so navigating Back never re-fetches.
 * gcTime:    unused cache survives 10 min in memory before React Query GCs it.
 * The localStorage persister (set up in QueryProvider) handles cross-session persistence.
 */
export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
                staleTime: 5 * 60 * 1000,  // 5 minutes — no re-fetch on Back nav
                gcTime: 10 * 60 * 1000,    // 10 minutes in-memory before GC
            },
        },
    });
}

// Singleton used by useSendData / useMutation helpers outside of React tree.
// The provider creates and persists its own client; this one is kept for compat.
export const queryClient = makeQueryClient();

export const useGetData = (options: UseSuspenseQueryOptions) => {
    return useSuspenseQuery(options);
};

export const useSendData = <TVariables = unknown>({
    fn,
    invalidateKey,
    error,
    success,
}: useSendDataProps<TVariables>) => {
    const [isInvalidating, setIsInvalidating] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: fn,
        onSuccess: async data => {
            success && success(data);
            if (invalidateKey) {
                setIsInvalidating(true);
                try {
                    await Promise.all(
                        invalidateKey.map(key => queryClient.invalidateQueries({ queryKey: [key] }))
                    );
                } finally {
                    setIsInvalidating(false);
                }
            }
            return data;
        },
        onError: (data: any) => {
            error && error(data);
            return data;
        },
    });

    return {
        ...mutation,
        isInvalidating,
    };
};
