'use client';
import React, { useState } from 'react';
import type { UploadProps, UploadFile } from 'antd';
import { Button, Upload } from 'antd';
import styled from 'styled-components';
import { TrashIcon, UploadBannerIcon } from '@/assets/icons';
const { Dragger } = Upload;

interface FileUploaderProps {
    hideBorder?: boolean;
    onUpload?: (file: File) => void;
    value?: string;
    isUploading?: boolean;
    className?: string;
    accept?: string;
    buttonText?: string;
    defaultText?: string;
    resetHeight?: boolean;
    onRemove?: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
    hideBorder = false,
    onUpload,
    value,
    isUploading,
    className,
    accept,
    buttonText = 'Upload File',
    defaultText = 'The maximum size per file is 5 MB',
    resetHeight = false,
    onRemove,
}) => {
    const [fileList, setFileList] = useState<UploadFile | null>(null);

    const props: UploadProps = {
        name: 'file',
        multiple: true,

        fileList: fileList ? [fileList] : [],
        accept: accept || 'image/*',
        onChange (info) {
            setFileList(info.fileList[0]);
            onUpload?.(info.fileList[0].originFileObj as File);
        },
        onDrop (e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setFileList(null);
        onRemove?.();
    };

    console.log(fileList);

    const StyledDragger = styled(Dragger)`
        .ant-upload {
            border-radius: 8px !important;
            min-height: ${resetHeight ? '100%' : '20vh'} !important;
            border: ${hideBorder ? 'none' : '1px solid #e0e0e0'} !important;
            background: #ffffff !important;
            padding: 0 !important;
            height: ${hideBorder ? '100%' : '20vh'} !important;
            .ant-upload-drag-container {
                display: ${resetHeight ? 'flex' : 'table-cell'} !important;
            }
        }

        .ant-upload-drag-icon {
            margin-bottom: 16px !important;
            .anticon {
                color: white !important;
                font-size: 32px !important;
            }
        }

        .ant-upload-text {
            color: white !important;
            font-size: 18px !important;
        }

        .ant-upload-hint {
            color: rgba(255, 255, 255, 0.6) !important;
        }

        .ant-upload-list {
            display: none;
        }

        .ant-upload-list-item {
            border-radius: 4px;
        }
    `;

    return (
        <StyledDragger {...props}>
            {(fileList === null && !value) || isUploading ? (
                <div>
                    <Button
                        loading={isUploading}
                        icon={<UploadBannerIcon className='w-4 mt-1 h-4' />}
                        variant='outlined'
                        className='h-fit w-fit py-1 bg-white hover:!text-black hover:!border-stroke'
                    >
                        {buttonText}
                    </Button>
                    <p className='text-gray-500 mt-2'>{defaultText}</p>
                </div>
            ) : (
                <div
                    className={`w-full relative max-h-[20vh] flex items-center justify-center ${className}`}
                >
                    {/* <Image
                        src={value || URL.createObjectURL(fileList?.originFileObj as Blob)}
                        className={`rounded-md w-full max-h-[20vh] object-fill ${className}`}
                        alt={fileList.name}
                        width={600}
                        height={600}
                    /> */}
                    <div className='flex items-center justify-center gap-2'>
                        {fileList?.name || value?.split('/').pop()}
                        <Button
                            icon={<TrashIcon className='text-xl mt-[3px] !text-error' />}
                            variant='outlined'
                            className='h-fit py-1 bg-white text-error hover:!text-error font-medium hover:!border-stroke'
                            onClick={handleRemoveFile}
                            loading={isUploading}
                        />
                    </div>
                </div>
            )}
        </StyledDragger>
    );
};

export default FileUploader;
