import { cn } from '@/utils/cn';
import { Input } from 'antd';

const TextInput: React.FC<TextInputProps> = ({ baseInputClassName = '', ...props }) => {
    return (
        <Input
            name={props?.name || 'text-input'}
            type={props?.inputType}
            placeholder={props?.placeholder}
            pattern={props?.pattern || ''}
            value={props?.value}
            onChange={e => props?.onChange(e.target.value)}
            disabled={props?.disabled}
            rootClassName={cn(baseInputClassName, props?.inputClassName)}
            className={cn(baseInputClassName, props?.inputClassName)}
            status={props?.error ? 'error' : ''}
        />
    );
};

export default TextInput;
