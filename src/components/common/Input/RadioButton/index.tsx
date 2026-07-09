import React from 'react';
import { Radio } from 'antd';
import { cn } from '@/utils/cn';

const RadioInput: React.FC<RadioInputProps> = ({
    name,
    value,
    onChange,
    disabled,
    options = [],
    inputClassName = '',
    variant = 'default',
    radioButtonClassName = '',
    optionsClassName = '',
    optLabelClassName = '',
}) => {
    if (variant === 'rating') {
        return (
            <Radio.Group
                name={name}
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={disabled}
                className={`flex gap-4 ${inputClassName}`}
            >
                {options.map((option, index) => (
                    <div key={option.value} className='flex flex-col items-center gap-2'>
                        <Radio.Button
                            value={option.value}
                            className={`flex items-center justify-center w-12 h-12 rounded-full
                            ${
                                value === option.value
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-background-input text-gray hover:border-primary'
                            } transition-colors ${radioButtonClassName}`}
                        >
                            {option.value}
                        </Radio.Button>
                        <span
                            className={`text-sm ${
                                value === option.value ? 'text-primary' : 'text-gray'
                            }`}
                        >
                            {option.label}
                        </span>
                    </div>
                ))}
            </Radio.Group>
        );
    }

    return (
        <Radio.Group
            name={name}
            value={value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            className={inputClassName}
        >
            <div className={cn('flex items-center gap-2 w-full h-full', optionsClassName)}>
                {options.map(option => (
                    <div
                        key={option.value}
                        className={`flex items-center hover:bg-background-input bg-background-input px-2 py-1 rounded-lg ${radioButtonClassName}`}
                    >
                        <Radio disabled={option.disabled} value={option.value}>
                            <div>
                                <span className={optLabelClassName}>{option.label}</span>
                                {option.sublabel && (
                                    <p className='text-sm text-gray-500 ml-0'>{option.sublabel}</p>
                                )}
                            </div>
                        </Radio>
                    </div>
                ))}
            </div>
        </Radio.Group>
    );
};

export default RadioInput;
