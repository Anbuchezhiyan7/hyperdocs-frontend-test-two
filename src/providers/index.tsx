'use client';

import { PropsWithChildren, Suspense } from 'react';
import { QueryProvider } from './query.provider';
import { NuqsAdapter } from 'nuqs/adapters/next';
import Loader from '@/components/common/Loader';
import { useServiceWorker } from '@/hooks/useServiceWorker';

// Polyfill for BigInt serialization to prevent JSON.stringify crashes (e.g., in PostHog)
if (typeof BigInt !== 'undefined' && !('toJSON' in BigInt.prototype)) {
    (BigInt.prototype as any).toJSON = function () {
        return this.toString();
    };
}

export const Providers = ({ children }: PropsWithChildren) => {
    // Phase 8: Register Service Worker for offline draft caching
    useServiceWorker();

    return (
        <NuqsAdapter>
            <QueryProvider>
                <Suspense fallback={<Loader />}>
                    {children}
                </Suspense>
            </QueryProvider>
        </NuqsAdapter>
    );
};