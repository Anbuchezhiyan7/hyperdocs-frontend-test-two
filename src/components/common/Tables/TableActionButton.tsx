'use client';

import React from 'react';
import { Tooltip } from 'antd';
import { cn } from '@/utils/cn';

interface TableActionButtonProps {
    icon: React.ReactNode;
    onClick?: () => void;
    tooltip?: string;
    danger?: boolean;
    disabled?: boolean;
}

const TableActionButton: React.FC<TableActionButtonProps> = ({
    icon,
    onClick,
    tooltip,
    danger,
    disabled,
}) => {
    const button = (
        <button
            type='button'
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all',
                danger
                    ? 'hover:bg-red-50 hover:border-red-200 hover:text-red-500'
                    : 'hover:bg-gray-50 hover:border-gray-300',
                disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent hover:border-gray-200'
            )}
        >
            {icon}
        </button>
    );

    return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : button;
};

export default TableActionButton;
