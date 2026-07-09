'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { showToast } from '@/components/common/Toast';
import { apiAcceptInvite, apiGetUserDetails, apiGoogleLogin } from '@/api/auth';
import { getCookie, setCookie } from '@/utils/cookie';
import { useAppStore } from '@/store/useAppStore';
import Cookies from 'js-cookie';

interface AuthContextType {
    user: any;
    isLoading: boolean;
    loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const protectedRoutes = [
    '/blogs',
    '/template',
    '/settings',
    '/leads',
    '/lead-library',
    '/newsletter',
    '/analytics',
    '/categories',
    '/tags',
    '/editor',
    '/site-details',
    '/verify-otp',
];

export function AuthProvider ({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { setUserData } = useAppStore();

    const [isLoading, setIsLoading] = useState(false);

    const getUser = () => {
        const user = getCookie('user');
        if (user) {
            return JSON.parse(user);
        }
        return null;
    };

    useEffect(() => {
        // Check if user is logged in on mount
        const token = Cookies.get('token');
        if (token) {
            setIsLoading(false);
            // Validate token and get user info
            apiGetUserDetails()
                .then(response => {
                    console.log('response', response);
                    setUserData(response.data);

                    if (response?.data?.is_new_user) {
                        router.replace('/site-details', { scroll: false });
                        return;
                    }

                    if (
                        !protectedRoutes.some(route =>
                            window.location.pathname.includes(`/admin${route}`)
                        )
                    ) {
                        router.push('/admin/blogs', { scroll: false });
                        return;
                    }
                })
                .catch(() => {
                    Cookies.remove('token');
                    router.replace('/login');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async ({ access_token }) => {
            setIsLoading(true);

            const inviteToken = new URLSearchParams(window.location.search).get('invite');

            // Always run the normal Google signup first.
            const response = await apiGoogleLogin(access_token);
            const { message, type, success, data } = response;

            if (success) {
                setCookie('token', data?.access_token, { expires: 30 });
                setCookie('user', JSON.stringify(data), { expires: 30 });
                setUserData(data);

                // Invitee flow: after signup succeeds, accept the invite with the
                // Google token and switch to the owner's workspace member JWT.
                if (inviteToken) {
                    const inviteRes = await apiAcceptInvite(access_token, inviteToken);

                    if (inviteRes.success) {
                        setCookie('token', inviteRes.data?.access_token, { expires: 30 });
                        setCookie('user', JSON.stringify(inviteRes.data), { expires: 30 });
                        setUserData(inviteRes.data);
                        router.push('/admin/blogs', { scroll: false });
                    } else {
                        showToast(inviteRes.message, inviteRes.type);
                    }

                    setIsLoading(false);
                    return inviteRes;
                }

                showToast(message, type);
                if (data?.is_new_user) {
                    router.push('/site-details', { scroll: false });
                } else {
                    router.push('/admin/blogs', { scroll: false });
                }
            } else {
                showToast(message, type);
            }

            setIsLoading(false);
            return response;
        },
        onError: () => {
            setIsLoading(false);
            showToast('Something went wrong', 'error');
            Promise.reject('Google login failed');
        },
    });

    return (
        <AuthContext.Provider
            value={{
                user: getUser(),
                isLoading,
                loginWithGoogle,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth () {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
