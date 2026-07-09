'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Row, Col } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { NewsletterTemplateAPI } from '@/api/newsletter.api';
import useNewsletterService from '@/services/newsletter.service';

// ── Schemas ───────────────────────────────────────────────────────────────────
const schema1 = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    button_text: z.string().min(1, 'Button text is required'),
});

const schema2 = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    button_text: z.string().min(1, 'Button text is required'),
    right_panel_heading: z.string().min(1, 'Right heading is required'),
    right_panel_subtext: z.string().min(1, 'Right subtext is required'),
});

type T1Values = z.infer<typeof schema1>;
type T2Values = z.infer<typeof schema2>;

// ── Shared helpers ────────────────────────────────────────────────────────────
const inputClass = (err?: boolean) =>
    `w-full border rounded-xl px-3 py-2 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'}`;
const labelClass = 'block text-sm font-semibold text-gray-700 mb-1';
const errClass = 'text-red-500 text-xs mt-0.5';

interface NewsletterConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    /** The API template object for the currently-active template */
    activeTemplateData: NewsletterTemplateAPI | null;
}

// ── Template 1 form ───────────────────────────────────────────────────────────
const Template1Form: React.FC<{
    isOpen: boolean;
    templateData: NewsletterTemplateAPI | null;
    onClose: () => void;
    onSaved: () => void;
    onLoadingChange: (v: boolean) => void;
}> = ({ isOpen, templateData, onClose, onSaved, onLoadingChange }) => {
    const { saveTemplateConfig } = useNewsletterService();
    const { control, handleSubmit, reset, formState: { errors } } = useForm<T1Values>({
        resolver: zodResolver(schema1),
        defaultValues: { title: '', description: '', button_text: '' },
    });

    useEffect(() => {
        if (!isOpen || !templateData) return;
        reset({
            title: templateData.title,
            description: templateData.description,
            button_text: templateData.button_text,
        });
    }, [isOpen, templateData]);

    const onSubmit = async (data: T1Values) => {
        if (!templateData) return;
        onLoadingChange(true);
        try {
            await saveTemplateConfig(templateData, data);
            toast.success('Template settings saved!');
            onSaved();
            onClose();
        } catch {
            toast.error('Failed to save settings');
        } finally {
            onLoadingChange(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <Row gutter={[16, 12]}>
                <Col xs={24} sm={12}>
                    <label className={labelClass}>Title <span className="text-red-500">*</span></label>
                    <Controller name="title" control={control} render={({ field }) => (
                        <input {...field} placeholder="Subscribe to Our Newsletter" className={inputClass(!!errors.title)} />
                    )} />
                    {errors.title && <p className={errClass}>{errors.title.message}</p>}
                </Col>
                <Col xs={24} sm={12}>
                    <label className={labelClass}>Button Text <span className="text-red-500">*</span></label>
                    <Controller name="button_text" control={control} render={({ field }) => (
                        <input {...field} placeholder="Subscribe Now" className={inputClass(!!errors.button_text)} />
                    )} />
                    {errors.button_text && <p className={errClass}>{errors.button_text.message}</p>}
                </Col>
            </Row>
            <Row gutter={[16, 12]}>
                <Col xs={24}>
                    <label className={labelClass}>Description <span className="text-red-500">*</span></label>
                    <Controller name="description" control={control} render={({ field }) => (
                        <textarea {...field} rows={3} placeholder="Stay up to date with our latest news and updates."
                            className={`${inputClass(!!errors.description)} resize-none`} />
                    )} />
                    {errors.description && <p className={errClass}>{errors.description.message}</p>}
                </Col>
            </Row>
            <input type="submit" id="nl-submit-t1" className="hidden" />
        </form>
    );
};

// ── Template 2 form ───────────────────────────────────────────────────────────
const Template2Form: React.FC<{
    isOpen: boolean;
    templateData: NewsletterTemplateAPI | null;
    onClose: () => void;
    onSaved: () => void;
    onLoadingChange: (v: boolean) => void;
}> = ({ isOpen, templateData, onClose, onSaved, onLoadingChange }) => {
    const { saveTemplateConfig } = useNewsletterService();
    const { control, handleSubmit, reset, formState: { errors } } = useForm<T2Values>({
        resolver: zodResolver(schema2),
        defaultValues: { title: '', description: '', button_text: '', right_panel_heading: '', right_panel_subtext: '' },
    });

    useEffect(() => {
        if (!isOpen || !templateData) return;
        reset({
            title: templateData.title,
            description: templateData.description,
            button_text: templateData.button_text,
            right_panel_heading: templateData.right_panel_heading ?? '',
            right_panel_subtext: templateData.right_panel_subtext ?? '',
        });
    }, [isOpen, templateData]);

    const onSubmit = async (data: T2Values) => {
        if (!templateData) return;
        onLoadingChange(true);
        try {
            await saveTemplateConfig(templateData, {
                title: data.title,
                description: data.description,
                button_text: data.button_text,
                right_panel_heading: data.right_panel_heading,
                right_panel_subtext: data.right_panel_subtext,
            });
            toast.success('Template settings saved!');
            onSaved();
            onClose();
        } catch {
            toast.error('Failed to save settings');
        } finally {
            onLoadingChange(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Left panel fields */}
            <p className="text-xs font-bold text-orange-500 uppercase tracking-wide">Left panel</p>
            <Row gutter={[16, 12]}>
                <Col xs={24} sm={12}>
                    <label className={labelClass}>Title <span className="text-red-500">*</span></label>
                    <Controller name="title" control={control} render={({ field }) => (
                        <input {...field} placeholder="Subscribe to Our Newsletter" className={inputClass(!!errors.title)} />
                    )} />
                    {errors.title && <p className={errClass}>{errors.title.message}</p>}
                </Col>
                <Col xs={24} sm={12}>
                    <label className={labelClass}>Button Text <span className="text-red-500">*</span></label>
                    <Controller name="button_text" control={control} render={({ field }) => (
                        <input {...field} placeholder="Subscribe Now" className={inputClass(!!errors.button_text)} />
                    )} />
                    {errors.button_text && <p className={errClass}>{errors.button_text.message}</p>}
                </Col>
            </Row>
            <Row gutter={[16, 12]}>
                <Col xs={24}>
                    <label className={labelClass}>Description <span className="text-red-500">*</span></label>
                    <Controller name="description" control={control} render={({ field }) => (
                        <textarea {...field} rows={2} placeholder="Stay up to date with our latest news and updates."
                            className={`${inputClass(!!errors.description)} resize-none`} />
                    )} />
                    {errors.description && <p className={errClass}>{errors.description.message}</p>}
                </Col>
            </Row>

            {/* Right panel fields */}
            <p className="text-xs font-bold text-orange-500 uppercase tracking-wide mt-2">Right panel</p>
            <Row gutter={[16, 12]}>
                <Col xs={24} sm={12}>
                    <label className={labelClass}>Heading <span className="text-red-500">*</span></label>
                    <Controller name="right_panel_heading" control={control} render={({ field }) => (
                        <input {...field} placeholder="Join our readers" className={inputClass(!!errors.right_panel_heading)} />
                    )} />
                    {errors.right_panel_heading && <p className={errClass}>{errors.right_panel_heading.message}</p>}
                </Col>
                <Col xs={24} sm={12}>
                    <label className={labelClass}>Subtext <span className="text-red-500">*</span></label>
                    <Controller name="right_panel_subtext" control={control} render={({ field }) => (
                        <input {...field} placeholder="No spam. Unsubscribe anytime." className={inputClass(!!errors.right_panel_subtext)} />
                    )} />
                    {errors.right_panel_subtext && <p className={errClass}>{errors.right_panel_subtext.message}</p>}
                </Col>
            </Row>

            <input type="submit" id="nl-submit-t2" className="hidden" />
        </form>
    );
};

// ── Main modal shell ──────────────────────────────────────────────────────────
const NewsletterConfigModal: React.FC<NewsletterConfigModalProps> = ({
    isOpen,
    onClose,
    onSaved,
    activeTemplateData,
}) => {
    const [isSaving, setIsSaving] = useState(false);

    // Determine which template name we're editing (template_1 or template_2)
    const templateName = activeTemplateData?.template_name ?? 'template_1';
    const isTemplate2 = templateName === 'template_2';
    const submitId = isTemplate2 ? 'nl-submit-t2' : 'nl-submit-t1';

    const templateLabel = isTemplate2 ? 'Template 2' : 'Template 1';

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            width={600}
            title={
                <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-gray-900 m-0">Configure Newsletter</p>
                    <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full">
                        {templateLabel}
                    </span>
                </div>
            }
            styles={{ body: { padding: '16px 24px' } }}
            footer={
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => document.getElementById(submitId)?.click()}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Saving…
                            </>
                        ) : (
                            'Save Settings'
                        )}
                    </button>
                </div>
            }
        >
            {!isTemplate2 ? (
                <Template1Form
                    isOpen={isOpen}
                    templateData={activeTemplateData}
                    onClose={onClose}
                    onSaved={onSaved}
                    onLoadingChange={setIsSaving}
                />
            ) : (
                <Template2Form
                    isOpen={isOpen}
                    templateData={activeTemplateData}
                    onClose={onClose}
                    onSaved={onSaved}
                    onLoadingChange={setIsSaving}
                />
            )}
        </Modal>
    );
};

export default NewsletterConfigModal;
