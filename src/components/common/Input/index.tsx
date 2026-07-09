import React from 'react';
import RadioInput from './RadioButton';
import {
    TextInput,
    NumberInput,
    TextAreaInput,
    SearchInput,
    UrlInput,
    DatePickerInput,
    TimePickerInput,
} from './DefaultFields';
import { SelectInput, CheckBoxInput, DateRangeInput } from './Select';
import EmailInput from './DefaultFields/EmailInput';
import SwitchInput from './RadioButton/Switch';
import FileUploader from './Upload';

export const Input: React.FC<InputProps> = props => {
    const {
        label,
        sublabel,
        description,
        sublabelAlignment = 'bottom',
        name,
        required = false,
        error,
        className = '',
        labelClassName = '',
        labelLineStyle = false,
    } = props;

    const baseInputClassName =
        'hover:border-stroke border w-full text-xs h-fit focus:!border-b-[2px] !bg-background-input focus:border-r-[2px] focus:border-black focus:bg-input-background border-stroke';

    const renderLabel = () => {
        if (!label) return null;

        const labelContent = labelLineStyle ? (
            <div className='relative inline-flex items-center justify-center w-full py-3'>
                <hr className='w-full h-[2px] bg-gray-200 border-0' />
                <span className='absolute left-0 pr-2 bg-white'>{label}</span>
            </div>
        ) : (
            <div>
                {label} {required && <span className='text-red-500 ml-1'>*</span>}
            </div>
        );

        const sublabelContent = sublabel && (
            <p
                className={`text-xs text-gray-light mb-2 text-gray-500 font-normal
                ${sublabelAlignment === 'right' ? '!mb-0' : 'mt-1'}`}
            >
                {sublabel}
            </p>
        );

        return (
            <label htmlFor={name} className={`text-sm font-medium text-black ${labelClassName}`}>
                <div
                    className={`flex ${
                        sublabelAlignment === 'right'
                            ? 'items-center justify-between'
                            : 'flex-col items-start'
                    } gap-1`}
                >
                    {labelContent}
                    {sublabelContent}
                </div>
            </label>
        );
    };

    const renderInput = () => {
        switch (props.inputType) {
            case 'text':
                return <TextInput {...props} baseInputClassName={baseInputClassName} />;

            case 'email':
                return <EmailInput {...props} baseInputClassName={baseInputClassName} />;

            case 'url':
                return <UrlInput {...props} baseInputClassName={baseInputClassName} />;

            case 'number':
                return <NumberInput {...props} baseInputClassName={baseInputClassName} />;

            case 'textarea':
                return <TextAreaInput {...props} baseInputClassName={baseInputClassName} />;

            case 'select':
                return <SelectInput {...props} baseInputClassName={baseInputClassName} />;

            case 'search':
                return <SearchInput {...props} baseInputClassName={baseInputClassName} />;

            case 'checkbox':
                return <CheckBoxInput {...props} />;

            case 'radio':
                return <RadioInput {...props} />;

            case 'datepicker':
                return <DatePickerInput {...props} />;

            case 'timepicker':
                return <TimePickerInput {...props} />;

            case 'daterange':
                return <DateRangeInput {...props} />;

            case 'upload':
                return <FileUploader {...props} className={props.baseInputClassName} />;
        }
    };

    if (props?.inputType === 'switch') {
        return <SwitchInput {...props} />;
    }

    return (
        <div className={`mb-4 w-full h-auto flex flex-col gap-2 ${className}`}>
            {renderLabel()}
            {renderInput()}
            {description && <p className='text-xs text-gray-500'>{description}</p>}
            {error && <p className='text-xs text-red-500'>{error}</p>}
        </div>
    );
};
