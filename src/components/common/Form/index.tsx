'use client';

import { UseFormReturn } from 'react-hook-form';
import FormField from './FormField';

type FormType = {
    fields: any[];
    form: UseFormReturn<any>;
};

const Form: React.FC<FormType> = ({ fields, form }) => {
    return fields?.map((field: any, index: number) => (
        <FormField key={field?.name || index} field={field} form={form} />
    ));
};

export default Form;
