import React, { useRef, useState } from 'react';
import { Spin, Upload } from 'antd';
import Image from 'next/image';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import { imageplaceholder } from '@/assets/images';
import { apiUploadFile, apiDeleteFile } from '@/api/common';
import { showToast } from '@/components/common/Toast';
import { cn } from '@/utils/cn';
import { ChangeIcon, DeleteIcon } from '@/assets/icons';
import Button from '@/components/common/Buttons';
import { UploadRef } from 'antd/es/upload/Upload';
import CroppableImageInput from './CroppableImageInput';

const SIZE_IN_MB = 1;
const MAX_FILE_SIZE = 1024 * 1024 * SIZE_IN_MB;

const ImageInput: React.FC<ImageInputProps> = ({
    label,
    sublabel = '',
    imageDimension,
    description,
    value,
    onChange,
    rootClassName,
    inputClassName,
    inputContainerClassName,
    error,
    required,
    isCroppable = false,
    onAspectRatioChange,
    aspectRatio,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const uploadRef = useRef<UploadRef>(null);

    console.log('author image error', error);
    const imageUrl = value?.url && typeof value.url === 'string' ? value.url : imageplaceholder;
    const previousImageId = value?.image_id;

    const beforeUpload = (file: RcFile) => {
        if (file.size > MAX_FILE_SIZE) {
            showToast(`File size must be less than ${SIZE_IN_MB}MB`, 'error');
            return false;
        }
        return true;
    };

    const handleCustomUpload: UploadProps['customRequest'] = async ({ file }) => {
        setIsLoading(true);
        if (previousImageId) {
            const { success } = await apiDeleteFile('image', previousImageId);
            if (!success) return setIsLoading(false);
        }

        const { type, success, message, data } = await apiUploadFile('image', file as RcFile);
        if (success) onChange(data);
        showToast(message, type);
        setIsLoading(false);
    };

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsLoading(true);
        if (previousImageId) {
            const { success } = await apiDeleteFile('image', previousImageId);
            if (!success) return setIsLoading(false);
        }
        onChange(null);
        setIsLoading(false);
    };

    const showUpdateDeleteOverlay = value?.url ? (
        <div className="absolute inset-0 rounded-lg transition-all duration-300 group-hover:flex hidden items-end py-2 justify-center bg-black/40 ">
            <div className="flex gap-2">
                <Button
                    variant="outlined"
                    className="!p-0 !border-none !bg-transparent hover:opacity-80"
                    icon={<DeleteIcon />}
                    onClick={handleDelete}
                />
                <Button
                    variant="outlined"
                    className="!p-0 !border-none !bg-transparent hover:opacity-80"
                    icon={<ChangeIcon />}
                />
            </div>
        </div>
    ) : null;

    const renderImage = () => {
        return (
            <Upload
                ref={uploadRef}
                name="image"
                accept="image/*"
                listType="picture-card"
                className="image-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={handleCustomUpload}
                disabled={isLoading}
            >
                <div
                    className={cn(
                        'relative group flex flex-col items-center justify-center w-[100px] h-[100px] p-2 bg-white border border-[#E0E0E0] rounded-[10px]',
                        inputContainerClassName,
                    )}
                >
                    {showUpdateDeleteOverlay}
                    {isLoading && (
                        <Spin className="absolute inset-0 flex items-center justify-center bg-white/20" />
                    )}
                    <Image
                        src={imageUrl}
                        alt="placeholder"
                        width={100}
                        height={100}
                        className={cn(' rounded-md', inputClassName)}
                    />
                </div>
            </Upload>
        );
    };

    return (
        <div className={cn('flex flex-col w-full justify-between', rootClassName)}>
            <div className="flex flex-row justify-between w-full">
                <div>
                    <h4 className="m-0 text-sm font-medium text-[#333]">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </h4>
                    {imageDimension && (
                        <span className="text-xs font-medium text-[#8F8F8F]">
                            Image should be {imageDimension} in dimension
                        </span>
                    )}
                    {sublabel && (
                        <span className="text-xs font-medium text-[#8F8F8F]">{sublabel}</span>
                    )}
                </div>

                <div className="[&_.ant-upload]:!w-[100px] [&_.ant-upload]:!h-[100px] [&_.ant-upload]:!m-0 [&_.ant-upload]:!bg-transparent [&_.ant-upload]:!border-none [&_.ant-upload-list-picture-card-container]:!w-auto [&_.ant-upload-list-picture-card-container]:!m-0">
                    {isCroppable ? (
                        <CroppableImageInput
                            inputClassName={inputClassName}
                            inputContainerClassName={inputContainerClassName}
                            onAspectRatioChange={onAspectRatioChange}
                            aspectRatio={aspectRatio as '16:9' | '1:1'}
                        >
                            {renderImage()}
                        </CroppableImageInput>
                    ) : (
                        renderImage()
                    )}
                </div>
            </div>
            <p className="text-xs text-[#8F8F8F]">{description}</p>
            {error && <p className="text-xs text-error">{error}</p>}
        </div>
    );
};

export default ImageInput;
