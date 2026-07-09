export const handleConvertBasedOnContentType = (data: any, fileType: string | undefined) => {
    if (fileType?.startsWith('image/')) {
        return {
            image_url: data.url,
            image_id: data.image_id,
        };
    } else if (fileType?.startsWith('video/')) {
        return {
            video_url: data.url,
            video_id: data.video_id,
        };
    } else if (fileType?.startsWith('application/')) {
        return {
            document_url: data.url,
            document_id: data.document_id,
        };
    }
    return data;
};

export const getFileData = async (file: File) => {
    if (file.type.startsWith('image/')) {
        let formData = new FormData();
        formData.append('image', file);
        // const response = await POST_API(endpoints.media_uploader.image, formData);
        // return response.data;
    }

    if (file.type.startsWith('video/')) {
        let formData = new FormData();
        formData.append('video', file);
        // const response = await POST_API(endpoints.media_uploader.video, formData);
        // return response.data;
    }

    if (file.type.startsWith('application/')) {
        let formData = new FormData();
        formData.append('document', file);
        // const response = await POST_API(endpoints.media_uploader.document, formData);
        // return response.data;
    }

    throw new Error('Unsupported file type');
};
