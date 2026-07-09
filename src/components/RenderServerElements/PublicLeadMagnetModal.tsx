'use client';

/**
 * PUBLIC-ONLY lead-magnet form modal — plain TSX + Tailwind, NO antd.
 *
 * Replaces editor/LeadMagnet/LeadMagnetDetailsModal on the public blog page so
 * that antd (Modal / Input / Button and their transitive Upload/Select/DatePicker
 * deps) never enter the public JS bundle. Preserves the same submit behaviour via
 * useLeadMagnetService.
 */

import React, { useEffect, useState } from 'react';
import useLeadMagnetService from '@/services/lead-magnet.service';

interface PublicLeadMagnetModalProps {
    isOpen: boolean;
    onClose: () => void;
    allowedFields: string[];
    leadMagnet: any;
}

const LEAD_FIELDS = [
    { label: 'Name', type: 'text', placeholder: 'Enter name', name: 'user_name', key: 'name' },
    { label: 'Email ID', type: 'email', placeholder: 'Enter email ID', name: 'user_email', key: 'email' },
    { label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number', name: 'phone', key: 'phone' },
];

const PublicLeadMagnetModal: React.FC<PublicLeadMagnetModalProps> = ({
    isOpen,
    onClose,
    allowedFields,
    leadMagnet,
}) => {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { handleStoreBlogLeads, isLoading } = useLeadMagnetService();

    // Lock body scroll while open.
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isOpen]);

    // Close on Escape.
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (allowedFields.includes('name') && !formData.user_name?.trim()) {
            newErrors.user_name = 'Name is required';
        }
        if (allowedFields.includes('email')) {
            if (!formData.user_email?.trim()) {
                newErrors.user_email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
                newErrors.user_email = 'Please enter a valid email address';
            }
        }
        if (allowedFields.includes('phone') && !formData.phone?.trim()) {
            newErrors.phone = 'Phone number is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

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
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Card */}
            <div className="relative z-10 w-full max-w-[600px] rounded-2xl bg-[#fdf8f3] p-6 shadow-xl">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-4 top-4 text-2xl leading-none text-gray-400 transition-colors hover:text-gray-700"
                >
                    &times;
                </button>

                <div className="flex w-full flex-col items-center">
                    <div className="mb-5 mt-2 text-center text-xl font-bold text-[#232323]">
                        PLEASE ENTER THE DETAILS BELOW
                    </div>

                    <form
                        className="flex w-full max-w-xl flex-col"
                        onSubmit={e => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        {LEAD_FIELDS.filter(field => allowedFields.includes(field.key)).map(field => (
                            <div key={field.name} className="mb-4 flex w-full flex-col gap-1">
                                <label
                                    htmlFor={field.name}
                                    className="text-sm font-medium text-black"
                                >
                                    {field.label} <span className="ml-1 text-red-500">*</span>
                                </label>
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={formData[field.name] || ''}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setFormData(prev => ({ ...prev, [field.name]: value }));
                                        if (errors[field.name]) {
                                            setErrors(prev => ({ ...prev, [field.name]: '' }));
                                        }
                                    }}
                                    className="h-[40px] w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none transition-colors focus:border-black focus:border-b-2 focus:border-r-2"
                                />
                                {errors[field.name] && (
                                    <p className="text-xs text-red-500">{errors[field.name]}</p>
                                )}
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 w-full rounded-md bg-[color:var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? 'Submitting…' : 'SUBMIT'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PublicLeadMagnetModal;
