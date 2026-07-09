import React, { useState } from 'react';
import CenteredModal from '@/components/common/Modals/CenteredModal';
import { Input } from '@/components/common/Input';
import Button from '@/components/common/Buttons';
import useLeadMagnetService from '@/services/lead-magnet.service';

interface LeadMagnetDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    allowedFields: string[];
    leadMagnet: any;
}

const LeadMagnetDetailsForm = [
    {
        label: 'Name',
        type: 'text',
        placeholder: 'Enter name',
        name: 'user_name',
        key: 'name',
        required: true,
    },
    {
        label: 'Email ID',
        type: 'email',
        placeholder: 'Enter email ID',
        name: 'user_email',
        key: 'email',
        required: true,
    },
    {
        label: 'Phone Number',
        type: 'text',
        placeholder: 'Enter phone number',
        name: 'phone',
        key: 'phone',
        required: true,
    },
];

const LeadMagnetDetailsModal: React.FC<LeadMagnetDetailsModalProps> = ({
    isOpen,
    onClose,
    allowedFields,
    leadMagnet,
}) => {
    console.log("🚀 ~ LeadMagnetDetailsModal ~ leadMagnet:", leadMagnet)
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { handleStoreBlogLeads, isLoading, isError } = useLeadMagnetService();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Validate Name (required)
        if (
            allowedFields.includes('name') &&
            (!formData.user_name || formData.user_name.trim() === '')
        ) {
            newErrors.user_name = 'Name is required';
        }

        // Validate Email (required)
        if (allowedFields.includes('email')) {
            if (!formData.user_email || formData.user_email.trim() === '') {
                newErrors.user_email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
                newErrors.user_email = 'Please enter a valid email address';
            }
        }

        // Validate Phone (required)
        if (
            allowedFields.includes('phone') &&
            (!formData.phone || formData.phone.trim() === '')
        ) {
            newErrors.phone = 'Phone number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        const templateType = leadMagnet?.template_type?.toLowerCase();
        const templateId = leadMagnet?.details?.lead_magnet_template_id;
        const LEAD_FORM_TEMPLATE_IDS = ['blog-lead-magnet-5', 'blog-lead-magnet-6'];

        let lead_type = 'lead_magnet';
        if (templateType === 'newsletter' || templateType === 'news-letter') {
            lead_type = 'newsletter';
        } else if (
            templateType === 'lead_form' ||
            templateType === 'lead-form' ||
            LEAD_FORM_TEMPLATE_IDS?.includes(templateId)
        ) {
            lead_type = 'lead_form';
        }

        const payload = {
            ...formData,
            blog_id: leadMagnet?.blog_id,
            lead_magnet_id: leadMagnet?.lead_magnet_id,
            lead_type,
            created_date: new Date().toISOString(),
            created_time: new Date().toISOString(),
        };
        await handleStoreBlogLeads({ details: payload });

        setFormData({});
        setErrors({});
        onClose();
    };

    return (
        <CenteredModal
            isOpen={isOpen}
            onClose={onClose}
            width={600}
            hideHeader
            hideFooter
            rootClassName="bg-[#fdf8f3] rounded-2xl shadow-xl"
        >
            <div className="flex flex-col items-center p-6 w-full">
                <div className="text-xl font-bold text-center mb-5 mt-2 text-[#232323]">
                    PLEASE ENTER THE DETAILS BELOW
                </div>
                <form className="w-full flex flex-col max-w-xl">
                    {LeadMagnetDetailsForm.filter(field => allowedFields.includes(field.key)).map(
                        field => {
                            const { key, label, placeholder, name, type, required, ...otherProps } =
                                field;
                            return (
                                <Input
                                    key={field.name}
                                    label={label}
                                    inputType={type as any}
                                    placeholder={placeholder}
                                    name={name}
                                    required={required}
                                    error={errors[name]}
                                    {...otherProps}
                                    inputClassName="!h-[40px]"
                                    onChange={(value: any) => {
                                        setFormData({ ...formData, [name]: value });
                                        // Clear error when user starts typing
                                        if (errors[name]) {
                                            setErrors({ ...errors, [name]: '' });
                                        }
                                    }}
                                    value={formData[name] || ''}
                                />
                            );
                        }
                    )}
                    <Button
                        className="!bg-primary !text-white mt-4"
                        title="SUBMIT"
                        onClick={handleSubmit}
                        loading={isLoading}
                    />
                </form>
            </div>
        </CenteredModal>
    );
};

export default LeadMagnetDetailsModal;
