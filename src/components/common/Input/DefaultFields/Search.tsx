import { cn } from '@/utils/cn';
import { Input as AntInput } from 'antd';

const SearchInput: React.FC<SearchInputProps> = ({ baseInputClassName = '', ...props }) => {
    return (
        <AntInput
            inputMode='search'
            placeholder={props?.placeholder}
            onChange={e => props?.onChange(e.target.value)}
            value={props?.value}
            rootClassName={cn(
                props?.inputClassName ? props?.inputClassName : '',
                baseInputClassName
            )}
            prefix={props?.prefix}
            suffix={props?.suffix}
            className={cn(props?.inputClassName, baseInputClassName)}
        />
    );
};

export default SearchInput;
