import React, { useState } from 'react';
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { DotsIcon } from '@/assets/icons';

interface DropdownMenuProps {
    items: MenuProps['items'];
    className?: string;
    placement?:
        | 'bottomLeft'
        | 'bottomCenter'
        | 'bottomRight'
        | 'topLeft'
        | 'topCenter'
        | 'topRight';
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
    items,
    className = '',
    placement = 'bottomRight',
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const menuStyle: React.CSSProperties = {
        padding: '0',
        border: 'none',
        borderRadius: '0',
        boxShadow: 'none',
    };

    return (
        <Dropdown
            menu={{ items, style: menuStyle }}
            placement={placement}
            trigger={['click']}
            onOpenChange={setIsDropdownOpen}
            dropdownRender={menu => (
                <div className='w-[250px] bg-white rounded-[10px] py-2 shadow-md border border-[#E0E0E0]'>
                    <div className='[&_.ant-dropdown-menu]:!p-0 [&_.ant-dropdown-menu-item]:!py-2 [&_.ant-dropdown-menu-item]:!px-3 [&_.ant-dropdown-menu-item]:!mx-3 [&_.ant-dropdown-menu-item]:!rounded-md [&_.ant-dropdown-menu-item:hover]:!bg-[#FF5200]/10'>
                        {menu}
                    </div>
                </div>
            )}
        >
            <Button
                type='text'
                className={`flex items-center justify-center aspect-square rounded-full transition-colors ${
                    isDropdownOpen ? 'bg-[#FF5200]/10' : ''
                } ${className}`}
            >
                <DotsIcon className='h-6 w-6' />
            </Button>
        </Dropdown>
    );
};

export default DropdownMenu;
