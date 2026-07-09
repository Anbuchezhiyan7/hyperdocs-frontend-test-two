import React from 'react';
import Image from 'next/image';
import { Tooltip } from 'antd';
import { TrashIcon } from '@/assets/icons';
import EditOulineIcon from '@/assets/icons/EditOulineIcon';

interface AuthorCardProps {
    name: string;
    role: string;
    image?: string;
    joinedDate?: string;
    onClick?: () => void;
    onDelete?: () => void;
    disableDelete?: boolean;
}

const formatJoinedDate = (date?: string) => {
    if (!date) return null;
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return null;
    return `Joined ${parsed.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
};

const CalendarIcon = () => (
    <svg width='13' height='13' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
            d='M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z'
            stroke='currentColor'
            strokeWidth='1.6'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>
);

const AuthorCard: React.FC<AuthorCardProps> = ({
    name,
    role,
    image,
    joinedDate,
    onClick,
    onDelete,
    disableDelete,
}) => {
    const initials =
        name
            ?.split(' ')
            ?.map(n => n?.[0])
            ?.join('')
            ?.slice(0, 2)
            ?.toUpperCase() || 'A';

    const joined = formatJoinedDate(joinedDate);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick?.();
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!disableDelete) onDelete?.();
    };

    return (
        <div
            onClick={onClick}
            className='group flex flex-row justify-between items-center bg-white border border-[#EDEDED] rounded-2xl p-4 w-full min-h-[96px] cursor-pointer transition-colors duration-200 hover:border-[#FFC7A8]'
        >
            <div className='flex items-center gap-4 min-w-0'>
                <div className='shrink-0'>
                    {image ? (
                        <div className='w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#F3F3F3]'>
                            <Image
                                src={image}
                                alt={name || ''}
                                width={56}
                                height={56}
                                className='w-full h-full object-cover'
                            />
                        </div>
                    ) : (
                        <div className='w-14 h-14 rounded-full bg-gradient-to-br from-[#FFF3ED] to-[#FFE3D3] text-[#FF5200] flex items-center justify-center text-[16px] font-bold ring-2 ring-[#F3F3F3]'>
                            {initials}
                        </div>
                    )}
                </div>

                <div className='min-w-0 flex flex-col gap-1'>
                    <div className='text-[15px] font-bold text-[#1A1A1A] truncate'>{name}</div>
                    <div>
                        <span className='inline-block max-w-full truncate rounded-full bg-[#FFF3ED] px-2.5 py-0.5 text-[12px] font-semibold text-[#FF5200]'>
                            {role || 'No designation'}
                        </span>
                    </div>
                    {joined && (
                        <div className='flex items-center gap-1.5 text-[12px] font-medium text-[#8F8F8F]'>
                            <CalendarIcon />
                            <span className='truncate'>{joined}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className='flex items-center gap-2 shrink-0'>
                <Tooltip title='Edit author'>
                    <button
                        type='button'
                        onClick={handleEdit}
                        aria-label='Edit author'
                        className='w-9 h-9 flex items-center justify-center rounded-full border border-[#EDEDED] bg-white text-[#555] hover:border-[#FFC7A8] hover:text-[#FF5200] hover:bg-[#FFF9F5] transition-colors duration-200'
                    >
                        <EditOulineIcon className='w-4 h-4' />
                    </button>
                </Tooltip>
                <Tooltip title={disableDelete ? 'At least one author is required' : 'Delete author'}>
                    <button
                        type='button'
                        onClick={handleDelete}
                        disabled={disableDelete}
                        aria-label='Delete author'
                        className='w-9 h-9 flex items-center justify-center rounded-full border border-[#EDEDED] bg-white text-[#555] hover:border-[#FFB3B3] hover:text-[#DC3545] hover:bg-[#FFF5F5] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#EDEDED] disabled:hover:bg-white'
                    >
                        <TrashIcon />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};

export default AuthorCard;
