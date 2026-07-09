'use client';
import React, { PropsWithChildren, useEffect, useLayoutEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/common/Sidebar';
import { useQuery } from '@tanstack/react-query';
import { subscriptionApi } from '@/api/subscription.api';

const DESKTOP_WIDTH = 1024;

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const pathname = usePathname();

    const [scale, setScale] = useState(1);

    const isEditorOrTemplate = pathname.includes('editor') || pathname.includes('template_');

    useLayoutEffect(() => {
        if (isEditorOrTemplate) return;
        const updateScale = () => {
            const vw = window.innerWidth;
            setScale(vw < DESKTOP_WIDTH ? vw / DESKTOP_WIDTH : 1);
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [isEditorOrTemplate]);

    const { data: activeSubscription } = useQuery({
        queryKey: ['active_subscription'],
        queryFn: () => subscriptionApi.handleGetActiveSubscription(),
        meta: { persist: true },
    });

    if (isEditorOrTemplate) {
        return <>{children}</>;
    }

    const isScaled = scale < 1;

    if (isScaled) {
        return (
            <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
                <div
                    className='flex bg-white'
                    style={{
                        width: `${DESKTOP_WIDTH}px`,
                        height: `calc(100dvh / ${scale})`,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                    }}
                >
                    <div className='w-[240px] shrink-0'>
                        <Sidebar />
                    </div>
                    <div className='flex-1 flex flex-col overflow-hidden'>
                        <div className='flex-1 overflow-y-auto bg-gray-50/30'>{children}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex h-screen overflow-hidden bg-white'>
            <div className='w-[240px] shrink-0'>
                <Sidebar />
            </div>
            <div className='flex-1 flex flex-col overflow-hidden'>
                <div className='flex-1 overflow-y-auto bg-gray-50/30'>{children}</div>
            </div>
        </div>
    );
};

export default MainLayout;
