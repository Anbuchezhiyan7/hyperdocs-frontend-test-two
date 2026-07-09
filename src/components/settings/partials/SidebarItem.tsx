import React from 'react';
import { cn } from '@/utils/cn';
import type { SidebarItem as SidebarItemType } from '@/interface/settings';

interface SidebarItemProps {
    item: SidebarItemType;
    isActive: boolean;
    onClick: (id: SidebarItemType['id']) => void;
}

const SideBarItem: React.FC<SidebarItemProps> = ({ item, isActive, onClick }) => {
    const { id, label, icon, isUpgrade } = item;

    return (
        <button
            onClick={() => onClick(id)}
            className={cn(
                'w-full whitespace-nowrap flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-[600] transition-colors',
                isActive ? 'bg-[#E6E6E6] text-[#333]' : 'hover:bg-gray-100 text-[#5D5D5D]',
                isUpgrade && 'text-[#FF5200] font-[600]'
            )}
        >
            {icon && <span className="w-5 h-5 flex items-center">{React.createElement(icon)}</span>}
            <span>{label}</span>
        </button>
    );
};

export default SideBarItem;
