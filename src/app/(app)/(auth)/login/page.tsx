'use client';

import { CenteredModal } from '@/components/common/Modals';
import { useQueryState } from 'nuqs';
import LoginContent from '@/components/auth/LoginContent';
import OtpContent from '@/components/auth/OtpContent';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ErrorBoundary } from 'react-error-boundary';

function LoginPageContent() {
    const [paramMode, setParamMode] = useQueryState('mode');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const otpExpiry = localStorage.getItem('otp_expiry');
        if (otpExpiry && Number(otpExpiry) > Date.now()) {
            setParamMode('verify-otp');
        } else {
            setParamMode(null);
        }
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className='test'>

        
        <div className={`${mounted ? 'opacity-100' :'opacity-0'} transition-all duration-300 relative min-h-screen w-full flex items-center justify-center`}>
            {/* Overlay image */}
            <div
                className="absolute backgroundImage inset-0 z-0 transition-all duration-300"
                style={{
                    backgroundImage: "url('/images/placeholder/BgOverlay.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: mounted ? 1 : 0, // adjust for overlay effect
                }}
            />
            {/* Modal */}
            <div className="relative z-10 w-full flex items-center justify-center">
                <CenteredModal
                    isOpen={true}
                    onClose={() => {}}
                    contentClassName="!rounded-3xl ![box-shadow:0_1px_20px_0_#fda880] "
                    hideHeader
                    hideFooter
                    hideCloseIcon
                    maskClassName='!bg-transparent !backdrop-blur-[8px]'
                >
                    {paramMode === 'verify-otp' ? (
                        <OtpContent />
                    ) : paramMode === 'welcome' ? (
                        <div className="flex-center flex-col min-h-[350px] font-bold text-xl text-gray-600">
                            Welcome!{' '}
                            <Link href="/editor" className="!text-lg !font-medium">
                                Get Started
                            </Link>
                        </div>
                    ) : (
                        <LoginContent />
                    )}
                </CenteredModal>
            </div>
        </div></div>
    );
}

export default function LoginPage() {
    return (
        <ErrorBoundary fallback={<div>Something went wrong. Please try again.</div>}>
            <LoginPageContent />
        </ErrorBoundary>
    );
}
