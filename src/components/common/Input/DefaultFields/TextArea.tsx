import { cn } from '@/utils/cn';
import { Input } from 'antd';
const { TextArea } = Input;

const TextAreaInput: React.FC<TextAreaInputProps> = ({ baseInputClassName = '', ...props }) => {
    return (
        <TextArea 
            name={props?.name || 'textarea-input'}
            placeholder={props?.placeholder}
            value={props?.value}
            onChange={e => props?.onChange(e.target.value)}
            onKeyDown={event => (props?.onKeyDown ? props?.onKeyDown(event) : event)}
            rootClassName={cn(props?.inputClassName, baseInputClassName)}
            className={cn(props?.inputClassName, baseInputClassName)}
            rows={props?.rows ?? 4}
            disabled={props?.disabled}
        />
    );
};

export default TextAreaInput;
