import { cn } from '@/utils/cn';
import { Input } from 'antd';

const EmailInput: React.FC<EmailInputProps> = ({ baseInputClassName = '', ...props }) => {
    return (
        <Input
            name={props?.name || 'email-input'}
            type={props?.inputType}
            placeholder={props?.placeholder}
            value={props?.value}
            onChange={e => props?.onChange(e.target.value)}
            disabled={props?.disabled}
            rootClassName={cn(baseInputClassName, props?.inputClassName)}
            className={cn(baseInputClassName, props?.inputClassName)}
        />
    );
};

export default EmailInput;
