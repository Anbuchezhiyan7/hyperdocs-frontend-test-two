import apiPath from '@/constants/api-path.constants';
import { postRequest, deleteRequest, getRequest } from '@/config/http.config';
import { formatRes } from '@/utils/format/api';

export const apiGetSchedule = async (id: string) => {
    try {
        const { data, status } = await getRequest(apiPath.schedule.id(id));
        return formatRes.success(status, 'Scheduled blog fetched successfully', data);
    } catch (error: any) {
        return formatRes.error(error, 'Scheduled blog not fetched');
    }
};

export const apiCreateSchedule = async (payload: any) => {
    try {
        const { data, status } = await postRequest(apiPath.schedule.base, payload);
        return formatRes.success(status, 'Blog scheduled successfully', data);
    } catch (error: any) {
        return formatRes.error(error, 'Blog not scheduled');
    }
};

export const apiDeleteSchedule = async (id: string) => {
    try {
        const { data, status } = await deleteRequest(apiPath.schedule.id(id));
        return formatRes.success(status, 'Scheduled blog deleted successfully', data);
    } catch (error: any) {
        return formatRes.error(error, 'Scheduled blog not deleted');
    }
};
