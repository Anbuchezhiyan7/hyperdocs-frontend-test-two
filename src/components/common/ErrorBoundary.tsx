'use client';

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorFallback ({ error }: { error: Error }) {
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='text-center'>
                <h1 className='text-2xl font-bold text-gray-800 mb-4'>Something went wrong</h1>
                <p className='text-gray-600'>Please try refreshing the page</p>
                <button
                    onClick={() => window.location.reload()}
                    className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                >
                    Refresh Page
                </button>
            </div>
        </div>
    );
}

export function ErrorBoundary ({ children }: { children: React.ReactNode }) {
    return <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>;
}
