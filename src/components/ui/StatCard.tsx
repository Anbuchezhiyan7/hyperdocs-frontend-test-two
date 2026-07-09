import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode | LucideIcon | ((props: any) => JSX.Element);
    backgroundColor?: string;
    iconBackgroundColor?: string;
    iconColor?: string;
    borderColor?: string;
    border?: boolean;
    className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    backgroundColor = 'bg-[#FEF7F6]',
    iconBackgroundColor = 'bg-[#FDEBEC]',
    iconColor = 'text-[#D44C47]',
    border = false,
    className = '',
}) => {
    return (
        <div
            className={`${backgroundColor} rounded-[20px] h-[150px] p-5 ${
                border ? 'border' : ''
            } ${className}`}
        >
            <div className="flex items-center mb-3">
                <div
                    className={`
                        w-8 h-8 
                        rounded-full 
                        ${iconBackgroundColor} 
                        flex items-center justify-center 
                        mr-3
                    `}
                >
                    {React.isValidElement(icon)
                        ? icon
                        : typeof icon === 'function'
                        ? React.createElement(icon as any, {
                              size: 18,
                              className: iconColor,
                          })
                        : null}
                </div>
                <span className="text-gray-700 font-medium">{title}</span>
            </div>
            <div className="text-5xl font-bold text-gray-800">{value}</div>
        </div>
    );
};

export default StatCard;
