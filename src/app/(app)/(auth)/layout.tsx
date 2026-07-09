import { AuthProvider } from '@/providers/auth.provider';
import React from 'react';

export default function AuthLayout ({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}
