import React from 'react';
import { Radio, Switch } from 'antd';
import { formatString } from '@/utils/format/string';

const SwitchInput: React.FC<SwitchInputProps> = ({
    label,
    sublabel,
    options,
    value,
    onChange,
    loading,
}) => {
    return (
        <div className='flex items-center justify-between py-4' key={label}>
            <div>
                <label className='text-sm font-medium text-[#333] block'>{label}</label>
                {sublabel && <span className='text-xs text-[#8F8F8F]'>{sublabel}</span>}
            </div>

            <div className='flex items-center'>
                {Array.isArray(options) ? (
                    <Radio.Group value={value} onChange={e => onChange(e.target.value)}>
                        {options.map((option, index) => {
                            const label = option?.label ?? formatString(option);
                            const val = option?.value ?? option;
                            return (
                                <Radio key={index} value={val}>
                                    {label}
                                </Radio>
                            );
                        })}
                    </Radio.Group>
                ) : (
                    <Switch
                        checked={value}
                        onChange={onChange}
                        className='bg-[#8F8F8F]'
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
};

export default SwitchInput;
