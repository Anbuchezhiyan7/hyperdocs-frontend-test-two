import { postRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

const commonApi = {
    handleUploadFile: (type: UploadFileType, formData: FormData) =>
        postRequest(apiPath.common.uploadFile(type), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })?.then(res => res?.data),
};

export default commonApi;
