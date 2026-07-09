import { request } from '@/config/axios.config';
import { AxiosRequestConfig } from 'axios';
async function getRequest<T>(endpoint: string) {
    const response = await request({
        method: 'GET',
        url: endpoint,
    });
    return response;
}

async function postRequest<T>(endpoint: string, data?: T, config?: AxiosRequestConfig) {
    const response = await request({
        method: 'POST',
        url: endpoint,
        data: data,
        ...config,
    });
    return response;
}

async function putRequest<T>(endpoint: string, data: T) {
    const response = await request({
        method: 'PUT',
        url: endpoint,
        data: data,
    });
    return response;
}

async function deleteRequest(endpoint: string, payload?: any) {
    const response = await request({
        method: 'DELETE',
        url: endpoint,
        data: payload,
    });
    return response;
}

export { getRequest, postRequest, putRequest, deleteRequest };
