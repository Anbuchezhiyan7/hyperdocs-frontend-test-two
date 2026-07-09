'use client';

import { Controller, UseFormReturn } from 'react-hook-form';
import { Input } from '../Input';

type FormFieldProps = {
    field: any;
    form: UseFormReturn<any>;
};

const FormField: React.FC<FormFieldProps> = ({ field, form }) => {
    const {
        control,
        formState: { errors },
    } = form;
    console.log('VALUES FORM FIELD', form.getValues());

    return (
        <Controller
            key={field?.name}
            name={field?.name || 'form_field'}
            control={control}
            render={({ field: { onChange, value } }) => (
                <Input
                    {...(field as any)}
                    inputType={field?.type || field?.inputType || 'text'}
                    onChange={onChange}
                    error={errors[field.name]?.message}
                    value={value}
                />
            )}
        />
    );
};

export default FormField;
