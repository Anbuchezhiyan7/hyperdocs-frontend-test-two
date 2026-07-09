import React from 'react';
import { ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { cn } from '@/utils/cn';
import { getContrastTextColor } from '@/utils/color-extractor';

type InputColorPicker = {
    color: string;
    onChange: (value: string) => void;
    className?: string;
    trigger?: 'hover' | 'click';
}

const InputColorPicker = ({ color, onChange, className, trigger = 'hover' }: InputColorPicker) => {
    const handleChange = (value: Color) => {
        onChange(value.toHexString());
    };

    return (
        <ColorPicker value={color} onChange={handleChange} trigger={trigger}>
            <div
                className={cn('w-[120px] h-[40px] rounded-lg flex items-center justify-center cursor-pointer', className)}
                style={{
                    backgroundColor: color,
                    color: getContrastTextColor(color),
                    border: '1px solid #E0E0E0',
                }}
            >
                {color.toUpperCase()}
            </div>
        </ColorPicker>
    );
};

export default InputColorPicker;
