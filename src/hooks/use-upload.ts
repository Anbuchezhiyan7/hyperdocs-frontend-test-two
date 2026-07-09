import * as React from 'react';

import type { ClientUploadedFileData } from 'uploadthing/types';

import { generateReactHelpers } from '@uploadthing/react';
import { toast } from 'sonner';
import { z } from 'zod';
import { OurFileRouter } from '@/app/api/uploading/route';
import commonApi from '@/api/common.api';
import { apiDeleteFile } from '@/api/common';
export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {}

interface UseUploadFileProps
    extends Pick<any, 'headers' | 'onUploadBegin' | 'onUploadProgress' | 'skipPolling'> {
    onUploadComplete?: (res: any) => void;
    onUploadError?: (error: unknown) => void;
}

export function useUploadFile({
    onUploadComplete,
    onUploadError,
    ...props
}: Partial<UseUploadFileProps>) {
    const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
    const [uploadingFile, setUploadingFile] = React.useState<File>();
    const [progress, setProgress] = React.useState<number>(0);
    const [isUploading, setIsUploading] = React.useState(false);

    async function uploadThing(file: File, type: UploadFileType) {
        setIsUploading(true);
        setUploadingFile(file);

        try {
            const formData = new FormData();
            formData.append(type, file);
            const res = await commonApi.handleUploadFile(type, formData);
            console.log('upload res', res);

            setUploadedFile(res);
            onUploadComplete?.(res);

            return res;
        } catch (error) {
            const errorMessage = getErrorMessage(error);

            const message =
                errorMessage.length > 0
                    ? errorMessage
                    : 'Something went wrong, please try again later.';

            toast.error(message);

            onUploadError?.(error);
        } finally {
            setProgress(0);
            setIsUploading(false);
            setUploadingFile(undefined);
        }
    }

    const handleRemoveFile = async (id: string, type: UploadFileType) => {
        try {
            setIsUploading(true);
            const res = await apiDeleteFile(type, id);
            console.log('REMOVE IMAGE RES', res);
            return res;
        } catch (error) {
            console.error('Error removing image:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return {
        isUploading,
        progress,
        uploadedFile,
        uploadFile: uploadThing,
        uploadingFile,
        handleRemoveFile,
    };
}

export const { uploadFiles, useUploadThing } = generateReactHelpers<OurFileRouter>();

export function getErrorMessage(err: unknown) {
    const unknownError = 'Something went wrong, please try again later.';

    if (err instanceof z.ZodError) {
        const errors = err.issues.map(issue => {
            return issue.message;
        });

        return errors.join('\n');
    } else if (err instanceof Error) {
        return err.message;
    } else {
        return unknownError;
    }
}

export function showErrorToast(err: unknown) {
    const errorMessage = getErrorMessage(err);

    return toast.error(errorMessage);
}
