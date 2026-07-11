'use client';

import { useQueryState } from 'nuqs';
import LoginContent from '@/components/auth/LoginContent';
import OtpContent from '@/components/auth/OtpContent';
import { useEffect, useState } from 'react';
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

    if (!mounted) return null;

    return (
        <div
            style={{
                opacity: mounted ? 1 : 0,
                transition: 'opacity 0.3s ease',
                minHeight: '100vh',
                width: '100%',
            }}
        >
            {paramMode === 'verify-otp' ? (
                <OtpContent />
            ) : (
                <LoginContent />
            )}
        </div>
    );
}

export default function LoginPage() {
    return (
        <ErrorBoundary fallback={<div>Something went wrong. Please try again.</div>}>
            <LoginPageContent />
        </ErrorBoundary>
    );
}
