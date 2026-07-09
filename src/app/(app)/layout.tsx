'use client';
import { PlateController } from '@udecode/plate/react';
import { ConfigProvider } from 'antd';
import { theme } from '@/config/antd-config';
import { Toaster } from 'sonner';
import { Toaster as HotToaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from '@/constants/definitions';
import dynamic from 'next/dynamic';

const PricingModal = dynamic(() => import('@/components/settings/tabs/Upgarde/PricingModal'), { ssr: false });

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <HotToaster />
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                    },
                }}
            />
            <PlateController>
                <ConfigProvider theme={theme}>
                    <PricingModal />
                    {children}
                </ConfigProvider>
            </PlateController>
        </GoogleOAuthProvider>
    );
}
