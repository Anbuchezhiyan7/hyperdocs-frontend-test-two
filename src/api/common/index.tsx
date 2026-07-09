import { deleteRequest, postRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';
import { formatRes } from '@/utils/format/api';

export const apiUploadFile = async (type: UploadFileType, file: any) => {
    try {
        const formData = new FormData();
        formData.append(type, file);

        const { data, status } = await postRequest(apiPath.common.uploadFile(type), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return formatRes.success(status, 'File uploaded successfully', data);
    } catch (error: any) {
        return formatRes.error(error, 'File not uploaded');
    }
};

export const apiDeleteFile = async (type: UploadFileType, file_id: string) => {
    try {
        const { data, status } = await deleteRequest(apiPath.common.deleteFile(type, file_id));
        return formatRes.success(status, 'File deleted successfully', data);
    } catch (error: any) {
        return formatRes.error(error, 'File not deleted');
    }
};
