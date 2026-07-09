'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Modal, Row, Col } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Link, CheckSquare, Square, ChevronLeft, Eye, EyeOff, Loader2, FileCheck, X } from 'lucide-react';
import { toast } from 'sonner';
import LeadMagnetTemplates from '@/components/editor/LeadMagnet/templates';
import TemplateSelector from './TemplateSelector';
import { useLeadMagnetLibraryService } from '@/services/lead-magnet-library.service';
import { LeadMagnetLibraryItem } from '@/api/lead-magnet-library.api';
import commonApi from '@/api/common.api';

interface LeadMagnetCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    editItem?: LeadMagnetLibraryItem | null;
    onSaved?: () => void;
}

type PdfMode = 'url' | 'file';

const REQUIRED_FIELD_OPTIONS = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone_number', label: 'Phone Number' },
];

const TEMPLATE_FIELDS: Record<string, { hasDescription: boolean; hasImage: boolean; hasPdf: boolean }> = {
    'blog-lead-magnet-1': { hasDescription: true, hasImage: true, hasPdf: true },
    'blog-lead-magnet-2': { hasDescription: true, hasImage: true, hasPdf: true },
    'blog-lead-magnet-3': { hasDescription: true, hasImage: true, hasPdf: true },
    'blog-lead-magnet-4': { hasDescription: true, hasImage: false, hasPdf: false },
};
const getTemplateFields = (id: string) =>
    TEMPLATE_FIELDS[id] ?? { hasDescription: true, hasImage: true, hasPdf: true };

// Maps internal template IDs → API-expected template_number values
const TEMPLATE_NUMBER_MAP: Record<string, string> = {
    'blog-lead-magnet-1': 'template_1',
    'blog-lead-magnet-2': 'template_2',
    'blog-lead-magnet-3': 'template_3',
    'blog-lead-magnet-4': 'template_4',
};
const toTemplateNumber = (id: string): string =>
    TEMPLATE_NUMBER_MAP[id] ?? id;

const buildSchema = (tFields: { hasPdf: boolean }, pdfMode: PdfMode) =>
    z.object({
        name: z.string().min(1, 'Name is required'),
        title: z.string().min(1, 'Title is required'),
        description: z.string().optional(),
        ctaButtonText: z.string().min(1, 'CTA button text is required'),
        pdfUrl:
            tFields.hasPdf && pdfMode === 'url'
                ? z.string().min(1, 'PDF URL is required')
                : z.string().optional(),
    });

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

const inputClass = (hasError?: boolean) =>
    `w-full border rounded-xl px-3 py-2 text-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${hasError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
    }`;
const labelClass = 'block text-sm font-semibold text-gray-700 mb-1';
const errorClass = 'text-red-500 text-xs mt-0.5';

const LeadMagnetCreateModal: React.FC<LeadMagnetCreateModalProps> = ({
    isOpen,
    onClose,
    editItem,
    onSaved,
}) => {
    const { createMagnet, isCreating, updateMagnet, isUpdating } = useLeadMagnetLibraryService();
    const [isUploadingPdf, setIsUploadingPdf] = useState(false);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const update = () => {
            const vw = window.innerWidth;
            setScale(vw < 960 ? (vw * 0.9) / 960 : 1);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const [step, setStep] = useState<'template' | 'form'>('template');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [pdfMode, setPdfMode] = useState<PdfMode>('url');
    const [pdfFileName, setPdfFileName] = useState('');
    const [pdfDocumentId, setPdfDocumentId] = useState('');
    const [pdfDocumentUrl, setPdfDocumentUrl] = useState('');
    const [requiredFields, setRequiredFields] = useState<string[]>(['name']);
    const [requiredFieldsError, setRequiredFieldsError] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const imageFileRef = useRef<HTMLInputElement>(null);
    const pdfFileRef = useRef<HTMLInputElement>(null);

    const isEditing = !!editItem;
    const currentTemplate = LeadMagnetTemplates.find(t => t.id === selectedTemplateId);
    const tFields = getTemplateFields(selectedTemplateId);
    const isSaving = isCreating || isUpdating || isUploadingPdf;

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(buildSchema(tFields, pdfMode)),
        defaultValues: { name: '', title: '', description: '', ctaButtonText: 'Download Now', pdfUrl: '' },
    });

    const watchedTitle = watch('title');
    const watchedDescription = watch('description');
    const watchedCta = watch('ctaButtonText');

    useEffect(() => {
        if (!isOpen) return;
        if (editItem) {
            reset({
                name: editItem.lead_magnet_instance_name,
                title: editItem.lead_magnet_instance_title,
                description: editItem.description,
                ctaButtonText: editItem.cta_button_text,
                pdfUrl: editItem.pdf_url ?? '',
            });
            setSelectedTemplateId(editItem.template_id || editItem.template_number || '');
            setRequiredFields(
                (editItem.required_form_fields ?? ['name']).map(f => f === 'phone' ? 'phone_number' : f)
            );
            setPdfMode(editItem.pdf_url ? 'url' : 'file');
            setPdfFileName('');
            setPdfDocumentId('');
            setPdfDocumentUrl('');
            setImagePreview(editItem.cover_image?.url ?? '');
            setStep('form');
        } else {
            reset({ name: '', title: '', description: '', ctaButtonText: 'Download Now', pdfUrl: '' });
            setSelectedTemplateId('');
            setRequiredFields(['name']);
            setPdfMode('url');
            setPdfFileName('');
            setPdfDocumentId('');
            setPdfDocumentUrl('');
            setImagePreview('');
            setRequiredFieldsError('');
            setStep('template');
        }
    }, [isOpen, editItem]);

    const handleTemplateSelect = (id: string) => { setSelectedTemplateId(id); setStep('form'); };

    const toggleField = (key: string) => {
        setRequiredFields(prev => prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]);
        setRequiredFieldsError('');
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handlePdfFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPdfFileName(file.name);
        setPdfDocumentId('');
        setPdfDocumentUrl('');
        e.target.value = '';

        setIsUploadingPdf(true);
        try {
            const formData = new FormData();
            formData.append('document', file);
            // Returns { document_id, url } directly (axios wrapper already stripped)
            const res = await commonApi.handleUploadFile('document', formData);

            const docId: string = res?.document_id ?? '';
            const docUrl: string = res?.url ?? '';

            if (!docUrl) {
                toast.error('PDF upload failed — no URL returned');
                setPdfFileName('');
                return;
            }
            setPdfDocumentId(docId);
            setPdfDocumentUrl(docUrl);
        } catch (err) {
            console.error('[PDF Upload] error:', err);
            toast.error('PDF upload failed');
            setPdfFileName('');
        } finally {
            setIsUploadingPdf(false);
        }
    };

    const clearPdf = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPdfFileName('');
        setPdfDocumentId('');
        setPdfDocumentUrl('');
        if (pdfFileRef.current) pdfFileRef.current.value = '';
    };

    const onSubmit = async (data: FormValues) => {
        if (requiredFields.length === 0) {
            setRequiredFieldsError('At least one field must be selected');
            return;
        }
        if (tFields.hasPdf && pdfMode === 'file' && !pdfDocumentUrl) {
            if (isUploadingPdf) {
                toast.error('PDF is still uploading, please wait');
            } else {
                toast.error('Please upload a PDF file');
            }
            return;
        }

        const templateNumber = toTemplateNumber(selectedTemplateId);
        const payload = {
            template_id: selectedTemplateId,
            template_number: templateNumber,
            lead_magnet_instance_name: data.name.trim(),
            lead_magnet_instance_title: data.title.trim(),
            description: data.description?.trim() ?? '',
            cta_button_text: data.ctaButtonText.trim(),
            cover_image: {
                image_id: '',
                url: imagePreview || '',
            },
            pdf_url: pdfMode === 'url'
                ? data.pdfUrl?.trim() || ''
                : pdfDocumentUrl || '',
            required_form_fields: requiredFields,
        };

        if (isEditing && editItem) {
            await updateMagnet({ id: editItem.lead_magnet_instance_id, payload });
        } else {
            await createMagnet(payload);
        }
        onSaved?.();
        onClose();
    };

    const modalTitle = (
        <div className="flex items-center gap-2">
            {step === 'form' && !isEditing && (
                <button
                    onClick={() => setStep('template')}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
            )}
            <div>
                <p className="text-base font-bold text-gray-900 m-0">
                    {step === 'template' ? 'Select Template' : isEditing ? 'Edit Lead Magnet' : `Configure — ${currentTemplate?.name ?? ''}`}
                </p>
                {step === 'form' && (
                    <p className="text-xs text-gray-400 font-normal m-0">
                        Template: <span className="text-orange-500 font-medium">{currentTemplate?.name ?? selectedTemplateId}</span>
                    </p>
                )}
            </div>
        </div>
    );

    const modalFooter = step === 'form' ? (
        <div className="flex items-center justify-between gap-3">
            <button
                type="button"
                onClick={() => setShowPreview(p => !p)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${showPreview
                        ? 'border-orange-400 bg-orange-50 text-orange-600'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                    }`}
            >
                {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-60 min-w-[140px] justify-center"
                >
                    {isSaving ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            {isEditing ? 'Saving…' : 'Creating…'}
                        </>
                    ) : (
                        isEditing ? 'Save Changes' : 'Create Lead Magnet'
                    )}
                </button>
            </div>
        </div>
    ) : null;

    const modalBody = (
        <>
            {step === 'template' && (
                <TemplateSelector isOpen={false} onClose={onClose} onSelect={handleTemplateSelect} inline />
            )}
            {step === 'form' && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Row gutter={[16, 12]}>
                        <Col xs={24} sm={12}>
                            <label className={labelClass}>Instance Name <span className="text-red-500">*</span></label>
                            <Controller name="name" control={control} render={({ field }) => (
                                <input {...field} placeholder="e.g. Ultimate SEO Guide" className={inputClass(!!errors.name)} />
                            )} />
                            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                        </Col>
                        <Col xs={24} sm={12}>
                            <label className={labelClass}>Title <span className="text-red-500">*</span></label>
                            <Controller name="title" control={control} render={({ field }) => (
                                <input {...field} placeholder="e.g. The Complete Guide to SEO" className={inputClass(!!errors.title)} />
                            )} />
                            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
                        </Col>
                    </Row>
                    <Row gutter={[16, 12]}>
                        {tFields.hasDescription && (
                            <Col xs={24} sm={12}>
                                <label className={labelClass}>Description</label>
                                <Controller name="description" control={control} render={({ field }) => (
                                    <textarea {...field} rows={3} placeholder="Briefly describe what the reader gets…" className={`${inputClass()} resize-none`} />
                                )} />
                            </Col>
                        )}
                        <Col xs={24} sm={tFields.hasDescription ? 12 : 24}>
                            <label className={labelClass}>CTA Button Text <span className="text-red-500">*</span></label>
                            <Controller name="ctaButtonText" control={control} render={({ field }) => (
                                <input {...field} placeholder="e.g. Download Now" className={inputClass(!!errors.ctaButtonText)} />
                            )} />
                            {errors.ctaButtonText && <p className={errorClass}>{errors.ctaButtonText.message}</p>}
                        </Col>
                    </Row>
                    {(tFields.hasImage || tFields.hasPdf) && (
                        <Row gutter={[16, 12]}>
                            {tFields.hasImage && (
                                <Col xs={24} sm={tFields.hasPdf ? 12 : 24}>
                                    <label className={labelClass}>Cover Image</label>
                                    <input ref={imageFileRef} type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                                    <button type="button" onClick={() => imageFileRef.current?.click()} className="w-full border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl overflow-hidden hover:border-orange-400 hover:bg-orange-50 transition-colors">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img src={imagePreview} alt="Preview" className="w-full h-28 object-cover" />
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <span className="text-white text-xs font-semibold">Click to change</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-5 text-gray-400 gap-1">
                                                <Upload size={18} />
                                                <span className="text-xs">Upload image</span>
                                                <span className="text-[10px]">PNG, JPG, WEBP</span>
                                            </div>
                                        )}
                                    </button>
                                </Col>
                            )}
                            {tFields.hasPdf && (
                                <Col xs={24} sm={tFields.hasImage ? 12 : 24}>
                                    <label className={labelClass}>PDF Source <span className="text-red-500">*</span></label>
                                    <div className="flex bg-gray-100 rounded-xl p-1 mb-2 w-fit">
                                        {(['file', 'url'] as PdfMode[]).map(m => (
                                            <button key={m} type="button" onClick={() => setPdfMode(m)} className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all ${pdfMode === m ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
                                                {m === 'url' ? <Link size={12} /> : <Upload size={12} />}
                                                {m === 'url' ? 'PDF URL' : 'Upload'}
                                            </button>
                                        ))}
                                    </div>
                                    {pdfMode === 'url' ? (
                                        <Controller name="pdfUrl" control={control} render={({ field }) => (
                                            <input {...field} type="url" placeholder="https://example.com/guide.pdf" className={inputClass(!!errors.pdfUrl)} />
                                        )} />
                                    ) : (
                                        <>
                                            <input ref={pdfFileRef} type="file" accept=".pdf" onChange={handlePdfFileChange} className="hidden" disabled={isUploadingPdf} />
                                            <button type="button" onClick={() => !isUploadingPdf && pdfFileRef.current?.click()} disabled={isUploadingPdf}
                                                className={`w-full border-2 border-dashed rounded-xl px-3 py-4 text-xs text-center transition-colors ${isUploadingPdf ? 'border-orange-300 bg-orange-50 cursor-wait' : pdfDocumentUrl ? 'border-green-300 bg-green-50 hover:border-green-400' : 'border-gray-200 bg-gray-50 hover:border-orange-400 hover:bg-orange-50 text-gray-500'}`}>
                                                {isUploadingPdf ? (
                                                    <span className="flex items-center justify-center gap-2 text-orange-500 font-medium"><Loader2 size={14} className="animate-spin" />Uploading {pdfFileName}…</span>
                                                ) : pdfDocumentUrl ? (
                                                    <span className="flex items-center justify-center gap-2 text-green-600 font-medium"><FileCheck size={14} />{pdfFileName}<button type="button" onClick={clearPdf} className="ml-1 rounded-full hover:text-red-500 transition-colors"><X size={12} /></button></span>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-1 text-gray-500"><Upload size={14} />Click to upload PDF</span>
                                                )}
                                            </button>
                                        </>
                                    )}
                                    {errors.pdfUrl && <p className={errorClass}>{errors.pdfUrl.message}</p>}
                                </Col>
                            )}
                        </Row>
                    )}
                    <div>
                        <label className={labelClass}>Required Form Fields <span className="text-red-500">*</span></label>
                        <p className="text-xs text-gray-400 mb-2">Select at least one field to collect from users</p>
                        <Row gutter={[8, 8]}>
                            {REQUIRED_FIELD_OPTIONS.map(field => {
                                const isChecked = requiredFields.includes(field.key);
                                return (
                                    <Col xs={24} sm={8} key={field.key}>
                                        <button type="button" onClick={() => toggleField(field.key)}
                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${isChecked ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'}`}>
                                            {isChecked ? <CheckSquare size={14} className="text-orange-500 shrink-0" /> : <Square size={14} className="text-gray-400 shrink-0" />}
                                            <span className="text-xs font-medium">{field.label}</span>
                                        </button>
                                    </Col>
                                );
                            })}
                        </Row>
                        {requiredFieldsError && <p className={errorClass}>{requiredFieldsError}</p>}
                    </div>
                    {showPreview && selectedTemplateId && (() => {
                        const TemplateComponent = LeadMagnetTemplates.find(t => t.id === selectedTemplateId)?.component as any;
                        if (!TemplateComponent) return null;
                        return (
                            <div className="mt-2">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="h-px flex-1 bg-gray-100" />
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Live Preview</span>
                                    <div className="h-px flex-1 bg-gray-100" />
                                </div>
                                <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm pointer-events-none select-none">
                                    <TemplateComponent title={watchedTitle || 'Your Title Here'} description={watchedDescription || 'Your description will appear here.'} buttonText={watchedCta || 'Click Here'} image={imagePreview || undefined} readOnly={false} onClick={() => { }} />
                                </div>
                            </div>
                        );
                    })()}
                </form>
            )}
        </>
    );

    // Mobile: portal to escape the scaled MainLayout transform context
    if (isOpen && scale < 1) {
        const designWidth = 960;
        return createPortal(
            <div style={{ position: 'fixed', inset: 0, zIndex: 2000, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
                <div style={{
                    position: 'absolute',
                    top: '5dvh',
                    left: '5vw',
                    width: `${designWidth}px`,
                    height: `auto`,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {/* Header */}
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {modalTitle}
                        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                    {/* Body */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
                        {modalBody}
                    </div>
                    {/* Footer */}
                    {modalFooter && (
                        <div style={{ padding: '12px 24px', borderTop: '1px solid #f0f0f0' }}>
                            {modalFooter}
                        </div>
                    )}
                </div>
            </div>,
            document.body
        );
    }

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            width={step === 'template' ? 960 : showPreview ? 1100 : 860}
            styles={{ body: { maxHeight: '70vh', overflowY: 'auto', padding: '16px 24px' } }}
            destroyOnClose={false}
            title={modalTitle}
            footer={modalFooter}
        >
            {modalBody}
        </Modal>
    );
};

export default LeadMagnetCreateModal;
