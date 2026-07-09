import { BASE_URL } from '@/constants/definitions';
import { logoutUser } from '@/utils/auth';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookie from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
    withCredentials: true,
    headers: {
        'ngrok-skip-browser-warning': 'any',
    },
});

export const request = async (options: AxiosRequestConfig<any>) => {
    let token = Cookie.get('token');

    //* check if the token is null or not
    if (token !== null) {
        //* if not null - set Bearer token
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    if (options.data instanceof FormData) {
        options.headers = {
            ...options.headers,
            'Content-Type': 'multipart/form-data',
        };
    }

    const onSuccess = (response: AxiosResponse) => response;
    const onError = (error: any) => {
        if (!error.response) {
            // Handle Network Error
            return Promise.reject({
                status: null,
                message: 'Network error. Please check your internet connection or server.',
            });
        }

        if (error?.status === 401) logoutUser();
        return Promise.reject(error?.response);
    };

    //* options will contain the request type and data
    return axiosInstance(options).then(onSuccess).catch(onError);
};
