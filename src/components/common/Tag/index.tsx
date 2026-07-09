'use client';
import { Tag } from 'antd';
import { CloseOutlinedIcon } from '@/assets/icons';

interface TagComponentProps {
    text: string | null;
    isClose?: boolean;
    onClose?: () => void;
    className?: string;
    icon?: any;
    onClick?: () => void;
}

const TagComponent = ({ text, isClose, onClose, className, icon, onClick }: TagComponentProps) => {
    return (
        <Tag
            onClick={onClick}
            closeIcon={false}
            onClose={isClose ? onClose : undefined}
            rootClassName={`${className} w-fit flex items-center gap-2 flex-row-reverse`}
            icon={
                isClose ? (
                    <span className="cursor-pointer">
                        <CloseOutlinedIcon onClick={onClose} />
                    </span>
                ) : undefined
            }
            className={`bg-white border-stroke border-2 p-1 px-4 text-black font-medium text-[0.8rem] capitalize rounded-2xl`}
        >
            {text} {icon ? icon : null}
        </Tag>
    );
};

export default TagComponent;
