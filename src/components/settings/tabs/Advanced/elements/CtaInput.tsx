import { Input } from '@/components/common/Input';

const ctaInputs = [
    { name: 'label', inputType: 'text', placeholder: 'Enter CTA button label' },
    { name: 'link', inputType: 'url', placeholder: 'Paste CTA button action link' },
];

const CtaInput = ({ label, value, handleChange, error }: any) => {
    // Ensure value is an object with default values
    const safeValue = value || { label: '', link: '' };
    
    return (
        <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-black'>{label}</label>
            {ctaInputs.map((input, index) => (
                <Input
                    key={index}
                    {...(input as any)}
                    value={safeValue[input.name] || ''}
                    onChange={(val: any) => handleChange({ ...safeValue, [input.name]: val })}
                    className='!mb-0'
                />
            ))}
            {error && <p className='text-xs text-error'>{error}</p>}
        </div>
    );
};

export default CtaInput;
