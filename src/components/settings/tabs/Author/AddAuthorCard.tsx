import React from 'react';
import { PlusOutlinedIcon } from '@/assets/icons';

interface AddAuthorCardProps {
    onClick?: () => void;
}

const AddAuthorCard: React.FC<AddAuthorCardProps> = ({ onClick }) => {
    return (
        <div
            className='group flex flex-row items-center gap-3.5 bg-[#FFF9F5] border border-dashed border-[#FFC7A8] rounded-2xl p-4 w-full min-h-[96px] cursor-pointer hover:bg-[#FFF3ED] transition-colors duration-200'
            onClick={onClick}
        >
            <div className='w-12 h-12 shrink-0 rounded-full bg-white border border-[#FFD9C4] text-[#FF5200] flex items-center justify-center group-hover:scale-105 transition-transform duration-300'>
                <PlusOutlinedIcon />
            </div>
            <span className='text-primary text-[15px] font-bold'>Add New Author</span>
        </div>
    );
};

export default AddAuthorCard;
