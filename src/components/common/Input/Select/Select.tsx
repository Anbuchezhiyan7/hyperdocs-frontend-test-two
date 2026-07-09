import React, { ReactElement } from 'react';
import { Select } from 'antd';
import { CaretDownIcon } from '@/assets/icons';
import TagComponent from '../../Tag';
import Button from '../../Buttons';

type InputProps = SelectInputProps & {
    baseInputClassName?: string;
};

const SelectInput: React.FC<InputProps> = ({
    value,
    onChange,
    options = [],
    disabled = false,
    placeholder = 'Search and Select',
    className = '',
    isLoading = false,
    variant = 'single',
    baseInputClassName = '',
    isCreatable,
    optionRender,
    buttonLabel,
    onOptionButtonClick,
    fontPreview = false,
}) => {
    const isMultiple = variant === 'multi';
    const normalizedValue = isMultiple ? (value as string[]) : (value as string);
    const getLabel = (item: any) => {
        console.log(item, options);
        const option = options.find(option => option.value === item);
        return option?.label || item;
    };

    const dropdownRender = (menu: ReactElement): ReactElement => {
        if (!isCreatable) return menu;

        const inputElement = document.querySelector(
            '.ant-select-selection-search-input'
        ) as HTMLInputElement;
        const searchValue = inputElement?.value || '';

        return (
            <div>
                <Button
                    className='px-2 w-full py-1.5 text-primary cursor-pointer hover:bg-gray-100'
                    onClick={e => {
                        e.stopPropagation();
                        onOptionButtonClick?.();
                    }}
                    title={buttonLabel}
                />
                {menu}
            </div>
        );
    };

    const customOptionRender = (option: any) => {
        if (fontPreview) {
            return <div className={`font-${option.data.value}`}>{option.label}</div>;
        }
        return optionRender ? optionRender(option) : option.label;
    };

    console.log('fontPreview', fontPreview, options);
    return (
        <div className='flex flex-col gap-2 h-fit'>
            <Select
                optionLabelProp={fontPreview ? 'label' : undefined}
                mode={isMultiple ? 'multiple' : undefined}
                showSearch
                value={normalizedValue}
                placeholder={placeholder}
                disabled={disabled || isLoading}
                onChange={onChange}
                suffixIcon={<CaretDownIcon />}
                maxTagCount={0}
                tagRender={isMultiple ? () => <div className='hidden' /> : undefined}
                listHeight={300}
                menuItemSelectedIcon={null}
                popupClassName='!bg-background-input'
                options={options}
                loading={isLoading}
                className='!h-[35px] [&_.ant-select-selection-wrap]:!self-auto'
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                optionRender={customOptionRender}
                dropdownRender={dropdownRender}
            />

            {isMultiple && Array.isArray(value) && (
                <div className='flex flex-wrap gap-1'>
                    {value.map(item => (
                        <TagComponent
                            key={item}
                            text={getLabel(item)}
                            onClose={() => onChange(value?.filter(v => v !== item))}
                            isClose
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectInput;
