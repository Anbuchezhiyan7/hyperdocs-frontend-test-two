import { getRequest, postRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';
import { setCookie } from '@/utils/cookie';
import { formatRes } from '@/utils/format/api';

export const apiGoogleLogin = async (access_token: string) => {
    try {
        const { status, data } = await postRequest(
            apiPath.auth.google,
            {},
            { headers: { Authorization: `Bearer ${access_token}` } }
        );
        setCookie('email', data?.email);
        setCookie("username", data?.name);
        return formatRes.success(status, 'Logged in successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Google login failed');
    }
};

export const apiAcceptInvite = async (googleToken: string, inviteToken: string) => {
    try {
        const { status, data } = await postRequest(
            apiPath.members.accept,
            { token: inviteToken },
            { headers: { Authorization: `Bearer ${googleToken}` } }
        );
        setCookie('email', data?.invited_email);
        return formatRes.success(status, 'Invite accepted successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Failed to accept invite');
    }
};

export const apiEmailLogin = async (email: string) => {
    try {
        const { status, data } = await postRequest(apiPath.auth.login, { email });
        setCookie('email', data?.email);
        return formatRes.success(status, 'OTP sent to your email', data);
    } catch (error) {
        return formatRes.error(error, 'Email login failed');
    }
};

export const apiVerifyOtp = async (email: string, otp: string) => {
    try {
        const { status, data } = await postRequest(apiPath.auth.verifyOtp, { otp, email });
        setCookie('token', data?.access_token, { expires: 30 });
        return formatRes.success(status, 'OTP verified', data);
    } catch (error) {
        return formatRes.error(error, 'OTP verification failed');
    }
};

export const apiResendOtp = async (email: string) => {
    try {
        const { status } = await postRequest(apiPath.auth.resendOtp, { email });
        return formatRes.success(status, 'OTP resent successfully');
    } catch (error) {
        return formatRes.error(error, 'Failed to resend OTP');
    }
};

export const apiGetUserDetails = async () => {
    try {
        const { status, data } = await getRequest(apiPath.auth.user);
        return formatRes.success(status, 'User details fetched successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Failed to fetch user details');
    }
};

export const apiUpdateSiteDetails = async (payload: any) => {
    try {
        const { status, data } = await postRequest(apiPath.auth.site, payload);
        return formatRes.success(status, 'Site details updated successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Failed to update site details');
    }
};

export const apiGetProductTour = async () => {
    try {
        const { status, data } = await getRequest(apiPath.auth.productTour);
        return formatRes.success(status, 'Product tour details fetched successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Failed to fetch product tour details');
    }
};

export const apiUpdateProductTour = async () => {
    try {
        const { status, data } = await postRequest(apiPath.auth.productTour, {});
        return formatRes.success(status, 'Product tour updated successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Failed to update product tour');
    }
};
