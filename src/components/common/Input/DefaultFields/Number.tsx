import { cn } from '@/utils/cn';
import { InputNumber } from 'antd';


const NumberInput: React.FC<NumberInputProps> = ({ baseInputClassName = '', ...props }) => {
    const preventInvalidInputForNumber = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (['e', 'E', '-', '+'].includes(event.key)) {
            event.preventDefault();
        }
    };

    return (
        <InputNumber
            {...props}
            maxLength={props?.maxLength}
            min={props?.min}
            name={props?.name || 'number-input'}
            type={props?.inputType}
            placeholder={props.placeholder}
            value={props?.value}
            onChange={value => props.onChange(value)}
            onKeyDown={preventInvalidInputForNumber}
            rootClassName={cn(props.inputClassName ? 'w-[49%]' : '', baseInputClassName)}
            className={cn(props.inputClassName, baseInputClassName)}
        />
    );
};

export default NumberInput;
