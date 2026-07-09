import { jwtDecode } from 'jwt-decode';
import Cookie from 'js-cookie';
import { removeCookie } from './cookie';

// A member's JWT has `sub = "invite:<invite_id>"`, while an owner's `sub` is
// their own user_id. Only owners can manage the workspace's team members.
export const getIsOwner = (): boolean => {
    const token = Cookie.get('token');
    if (!token) return false;
    try {
        const decoded: any = jwtDecode(token);
        const sub = String(decoded?.sub ?? '');
        return !sub.startsWith('invite:');
    } catch {
        return false;
    }
};

export const isTokenValid = (token: string) => {
    if (!token) return false;
    try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp && decodedToken.exp < currentTime) return false;
        return true;
    } catch {
        return false;
    }
};

export const checkUserAuth = (cookies: any) => {
    const token = cookies.get('token')?.value;
    return isTokenValid(token);
};

export const logoutUser = () => {
    const cookies = ['token'];
    cookies.forEach(cookie => removeCookie(cookie));

    if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
    }
};
