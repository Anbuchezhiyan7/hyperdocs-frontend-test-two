import { Checkbox } from 'antd';
import { useMemo } from 'react';

const CheckBoxInput: React.FC<CheckboxInputProps> = props => {
    return (
        (props?.variant === 'single') ? (
            <Checkbox
                className={props?.inputClassName}
                checked={props?.value as boolean}
                {...props}
                onChange={e => props?.onChange(e.target.checked)}
            >
                {props?.children || props?.placeholder}
            </Checkbox>
        ) : (
            <div className='flex flex-wrap gap-2'>
                {props?.options?.map((option: any, index: number) => {
                    const value = props?.value as any[] || [];
                    const optionValue = option?.value;
                    
                    const isChecked =  useMemo(() => value?.includes(optionValue), [value, optionValue]);

                    const handleChange = (checked: any) => {
                        const updatedValue = checked ? [...value, optionValue] : value?.filter((item: any) => item !== optionValue);
                        props?.onChange(updatedValue)
                    };

                    return (
                        <Checkbox
                            key={index}
                            className={props?.inputClassName}
                            checked={isChecked}
                            {...props}
                            onChange={e => handleChange(e.target.checked)}
                        >
                            {option?.label || option?.value}
                        </Checkbox>
                    )
                })}
            </div>
        )
    );
}

export default CheckBoxInput;