'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { Input } from 'antd';

const UrlInput: React.FC<LinkUrlInputProps> = ({
    baseInputClassName = '',
    value,
    onChange,
    ...props
}) => {
    const [localValue, setLocalValue] = useState(value || '');
    const [isInvalid, setIsInvalid] = useState(false);

    useEffect(() => {
        setLocalValue(value || '');
    }, [value]);

    const handleChange = (value: string) => {
        let inputValue = value;

        if (inputValue && !inputValue.startsWith('http://') && !inputValue.startsWith('https://')) {
            inputValue = 'https://' + inputValue;
        }

        setLocalValue(inputValue);
        onChange?.(inputValue);
    };

    return (
        <Input
            name={props?.name || 'url-input'}
            type={props?.inputType || 'text'}
            placeholder={props?.placeholder}
            value={localValue}
            onChange={(e: any) => handleChange(e.target.value)}
            disabled={props?.disabled}
            rootClassName={cn(baseInputClassName)}
            className={cn(
                baseInputClassName,
                props?.inputClassName,
                isInvalid && 'border-red-500 focus:border-red-500 hover:border-red-500'
            )}
        />
    );
};

export default UrlInput;
