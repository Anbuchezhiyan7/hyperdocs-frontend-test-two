'use client';

import { PropsWithChildren, Suspense } from 'react';
import { QueryProvider } from './query.provider';

import { NuqsAdapter } from 'nuqs/adapters/next';
import Loader from '@/components/common/Loader';

// Polyfill for BigInt serialization to prevent JSON.stringify crashes (e.g., in PostHog)
if (typeof BigInt !== 'undefined' && !('toJSON' in BigInt.prototype)) {
    (BigInt.prototype as any).toJSON = function () {
        return this.toString();
    };
}

export const Providers = ({ children }: PropsWithChildren) => {
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