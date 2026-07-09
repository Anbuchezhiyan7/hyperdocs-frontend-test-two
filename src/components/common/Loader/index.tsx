'use client';

import { HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import HyperblogLogo from '@/assets/icons/HyperblogLogo';
import { usePathname } from 'next/navigation';

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
    size?: number;
}

export default function Loader({ size = 151, className = '', ...props }: LoaderProps) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/login')

    if (pathname && !isAdminRoute) {
        return null;
    }

    const loaderContent = (
        <>
            <style>{`
                .full-screen-loader-overlay {
                    z-index: 999999 !important;
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                }
            `}</style>
            <div
                style={{
                    zIndex: 999999,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                } as React.CSSProperties}
                className={`full-screen-loader-overlay flex justify-center items-center !backdrop-blur-3xl bg-white/30 ${className}`}
                {...props}
            >
                <div className=' h-fit w-fit'>
                    <HyperblogLogo
                        style={{
                            width: size,
                            height: size * (20 / 151),
                        }}
                        className='animate-pulse'
                    />
                </div>
            </div>
        </>
    );

    // Render to document body using portal to escape stacking contexts
    if (typeof window !== 'undefined') {
        return createPortal(loaderContent, document.body);
    }
    
    return loaderContent;
}
