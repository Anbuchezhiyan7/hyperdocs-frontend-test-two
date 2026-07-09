import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import ImgCrop from 'antd-img-crop';

// Define available aspect ratios
const ASPECT_RATIOS = {
    '16:9': 16 / 9,
    '1:1': 1
} as const;

type AspectRatioKey = keyof typeof ASPECT_RATIOS;

interface CroppableImageInputProps {
    children: React.ReactElement;
    inputClassName?: string;
    inputContainerClassName?: string;
    onAspectRatioChange?: (aspectRatio: AspectRatioKey) => void;
    aspectRatio?: AspectRatioKey;
}

const CroppableImageInput: React.FC<CroppableImageInputProps> = ({
    children,
    inputClassName,
    inputContainerClassName,
    onAspectRatioChange,
    aspectRatio,
}) => {
    const [currentAspectRatio, setCurrentAspectRatio] = useState<AspectRatioKey>(aspectRatio || '16:9');

    const handleAspectRatioChange = (aspectRatio: AspectRatioKey) => {
        setCurrentAspectRatio(aspectRatio);
        onAspectRatioChange?.(aspectRatio);
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="[&_.ant-upload]:!w-[100px] [&_.ant-upload]:!h-[100px] [&_.ant-upload]:!m-0 [&_.ant-upload]:!bg-transparent [&_.ant-upload]:!border-none [&_.ant-upload-list-picture-card-container]:!w-auto [&_.ant-upload-list-picture-card-container]:!m-0">
                <ImgCrop 
                    quality={1} 
                    showGrid 
                    aspect={ASPECT_RATIOS[currentAspectRatio]}
                >
                    {children}
                </ImgCrop>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="flex items-center justify-center gap-2">
                {/* <span className="text-[10px] font-medium text-[#8F8F8F]">Aspect Ratio:</span> */}
                <div className="flex gap-2">
                    {Object.entries(ASPECT_RATIOS).map(([key, value]) => (
                        <button
                            key={key}
                            onClick={() => handleAspectRatioChange(key as AspectRatioKey)}
                            className={cn(
                                'py-1 text-xs w-[40px] rounded-md border transition-all duration-200 font-medium',
                                currentAspectRatio === key
                                    ? 'bg-primary text-white border-primary shadow-sm'
                                    : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:bg-gray-50'
                            )}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CroppableImageInput;