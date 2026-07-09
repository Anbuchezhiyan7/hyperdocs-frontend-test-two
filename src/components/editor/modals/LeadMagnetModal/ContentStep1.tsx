import { Divider, Modal } from 'antd';
import { BsStarsIcon, CoinsIcon } from '@/assets/icons';
import leadMagnetsApi from '@/api/lead-magnet.api';
import { Input } from '@/components/common/Input';
import FileUploader from '@/components/common/Input/Upload';
import { useUploadFile } from '@/hooks/use-upload';
import { useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';
import leadMagnetLibraryApi, { LeadMagnetLibraryItem } from '@/api/lead-magnet-library.api';
import LeadMagnetTemplatePreview from '@/components/lead-library/LeadMagnetTemplatePreview';
import { CheckCircle2, CheckSquare, Link2, Square, Upload, Wand2, Sparkles } from 'lucide-react';
import LeadMagnetTemplates from '@/components/editor/LeadMagnet/templates';
import Button from '@/components/common/Buttons';
import useLeadMagnetService from '@/services/lead-magnet.service';
import { useSuggestionService } from '@/services/suggestion.service';
import { getAssetCredit, useCreditPricing } from '@/hooks/use-credit-pricing';

interface ValidationErrors {
    [key: string]: string;
}

type ContentStep1Props = {
    leadMagnet: any;
    handleChange: (name: string, value: any) => void;
    isActive: boolean;
    validationErrors: ValidationErrors;
};

// PDF templates are templates 1–4 (exclude lead-form templates 5 & 6)
const pdfTemplates = LeadMagnetTemplates.filter(t => !t.isLeadForm);

// Lead form templates
const leadFormTemplates = LeadMagnetTemplates.filter(t => t.isLeadForm);

const tabOptions = [
    { label: 'Create New', value: 'upload_pdf', disabled: false, comingSoon: false },
    { label: 'From Library', value: 'library', disabled: false, comingSoon: false },
    { label: 'Generate by AI', value: 'ai_generated', disabled: false, comingSoon: false },
];

// Required form field options
const FIELD_OPTIONS = [
    { label: 'Name', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Phone Number', value: 'phone' }, 
];

/** Pill-style toggle for "Required Form Fields" */
function RequiredFieldsPicker({
    value,
    onChange,
    error,
    label = 'Required Form Fields',
    sublabel = 'Select at least one field to collect from users',
}: {
    value: string[];
    onChange: (val: string[]) => void;
    error?: string;
    label?: string;
    sublabel?: string;
}) {
    const selected = value || [];
    const toggle = (v: string) => {
        const next = selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v];
        onChange(next);
    };

    return (
        <div className="w-full">
            <p className="text-sm font-semibold text-gray-800 mb-0.5">
                {label} <span className="text-red-500">*</span>
            </p>
            {sublabel && <p className="text-xs text-gray-500 mb-2">{sublabel}</p>}
            <div className="grid grid-cols-3 gap-3">
                {FIELD_OPTIONS.map(opt => {
                    const isOn = selected.includes(opt.value);
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => toggle(opt.value)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all cursor-pointer
                                ${isOn
                                    ? 'border-orange-400 bg-orange-50 text-orange-600'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'
                                }`}
                        >
                            {isOn
                                ? <CheckSquare size={15} className="shrink-0 text-orange-500" />
                                : <Square size={15} className="shrink-0 text-gray-400" />
                            }
                            {opt.label}
                        </button>
                    );
                })}
            </div>
            {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
        </div>
    );
}

const ContentStep1 = ({
    leadMagnet,
    handleChange,
    isActive,
    validationErrors,
}: ContentStep1Props) => {
    const { uploadFile, isUploading } = useUploadFile({
        onUploadComplete: file => { handleChange('image_url', file.url); },
        onUploadError: error => { console.log(error); },
    });

    const [leadType] = useQueryState('leadType');
    const isLeadForm =
        leadType === 'lead-form' ||
        leadMagnet?.template_type === 'lead_form' ||
        ['blog-lead-magnet-5', 'blog-lead-magnet-6'].includes(leadMagnet?.lead_magnet_template_id);
    const isFromLibrary = leadMagnet?.template_type === 'library';
    const hasGeneratedContent = !!(leadMagnet?.pdf_url || leadMagnet?.title);

    // Default to upload_pdf if no valid template_type set
    useEffect(() => {
        if (leadMagnet && !tabOptions.find(t => t.value === leadMagnet.template_type)) {
            handleChange('template_type', 'upload_pdf');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leadMagnet?.template_type]);

    const activeTab = leadMagnet?.template_type || 'upload_pdf';

    const [type] = useQueryState('type');
    const [mandatoryResource] = useQueryState('mandatory_resource');
    const isEditMode = type === 'edit';
    
    const displayedTabs = (isEditMode || mandatoryResource === 'true')
        ? tabOptions.filter(t => t.value === activeTab)
        : tabOptions;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'upload_pdf':
                return (
                    <TabUploadPDF
                        leadMagnet={leadMagnet}
                        handleChange={handleChange}
                        validationErrors={validationErrors}
                    />
                );
            case 'library':
                return (
                    <TabFromLibrary
                        leadMagnet={leadMagnet}
                        handleChange={handleChange}
                        validationErrors={validationErrors}
                    />
                );
            case 'ai_generated':
                return (
                    <TabAIGenerated
                        leadMagnet={leadMagnet}
                        handleChange={handleChange}
                        validationErrors={validationErrors}
                        hasGeneratedContent={hasGeneratedContent}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className={`${!isActive ? '!hidden' : ''}`}>
            <div className="py-3">
                {isLeadForm ? (
                    // Lead Form template picker
                    <LeadFormTemplatePicker
                        leadMagnet={leadMagnet}
                        handleChange={handleChange}
                    />
                ) : (
                    <>
                        {/* Custom Tab Bar */}
                        <div className="flex gap-2 mb-1 flex-wrap">
                            {displayedTabs.map(tab => {
                                const isSelected = activeTab === tab.value;
                                return (
                                    <div key={tab.value} className="relative">
                                        {tab.comingSoon && (
                                            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap z-20">
                                                COMING SOON
                                            </span>
                                        )}
                                        {tab.value === 'ai_generated' && (
                                            <div className="absolute -top-2.5 -right-2.5 text-primary animate-pulse z-20 pointer-events-none">
                                                <Sparkles className="w-5 h-5 fill-primary" />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            disabled={tab.disabled}
                                            onClick={() => {
                                                if (!tab.disabled) handleChange('template_type', tab.value);
                                            }}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all
                                                ${isSelected
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-primary/50'
                                                }
                                                ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                                            `}
                                        >
                                            {tab.label}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Tab Content */}
                        <div>{renderTabContent()}</div>
                    </>
                )}
            </div>

            {/* Details section — hidden when From Library is selected OR AI generated is selected but not yet generated */}
            {!isFromLibrary && !(activeTab === 'ai_generated' && !hasGeneratedContent) && (
                <>
                    <Divider className="!my-2 !border-t-2 !border-gray-200" />
                    <div className="pt-4">
                        <h6 className="text-base font-bold mb-4">Details</h6>

                        <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-5">
                            {/* Row 1: Title | CTA Button */}
                            <div>
                                <Input
                                    name="title"
                                    value={leadMagnet?.title}
                                    onChange={(v: any) => handleChange('title', v)}
                                    inputType="text"
                                    label="Title"
                                    placeholder={isLeadForm ? 'Get In Touch With Us' : 'Enter lead magnet title'}
                                    error={validationErrors.title}
                                />
                            </div>
                            <div>
                                <Input
                                    name="cta_button"
                                    value={leadMagnet?.cta_button}
                                    onChange={(v: any) => handleChange('cta_button', v)}
                                    inputType="text"
                                    label="CTA Button Text"
                                    placeholder={isLeadForm ? 'Contact Us Now' : 'Enter CTA button text'}
                                    error={validationErrors.cta_button}
                                />
                            </div>

                            {/* Row 2: Description | (empty) */}
                            <div className="col-span-2">
                                <Input
                                    name="description"
                                    value={leadMagnet?.description}
                                    onChange={(v: any) => handleChange('description', v)}
                                    inputType="textarea"
                                    label="Description"
                                    placeholder={isLeadForm ? 'Have questions? We are here to help.' : 'Enter lead magnet description'}
                                    error={validationErrors.description}
                                />
                            </div>

                            {/* Row 3: Cover Image | PDF Source — only for upload_pdf or ai_generated */}
                            {!isLeadForm && (activeTab === 'upload_pdf' || activeTab === 'ai_generated') && (
                                <>
                                    <div>
                                        <Input
                                            name="image_url"
                                            value={leadMagnet?.image_url}
                                            inputType="upload"
                                            label="Cover Image"
                                            accept="image/*"
                                            hideBorder
                                            resetHeight
                                            buttonText="Upload Image"
                                            defaultText=""
                                            onUpload={file => uploadFile(file, 'image')}
                                            isUploading={isUploading}
                                            onRemove={() => handleChange('image_url', null)}
                                        />
                                    </div>
                                    <div>
                                        <PdfSourceField
                                            leadMagnet={leadMagnet}
                                            handleChange={handleChange}
                                            validationErrors={validationErrors}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Pill-style Required Form Fields */}
                        <RequiredFieldsPicker
                            value={leadMagnet?.details_required || []}
                            onChange={val => handleChange('details_required', val)}
                            error={validationErrors.details_required}
                            label={isLeadForm ? 'Fields to Collect' : 'Required Form Fields'}
                            sublabel="Select at least one field to collect from users"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

/** Template picker shown when lead-form type is active */
function LeadFormTemplatePicker({
    leadMagnet,
    handleChange,
}: {
    leadMagnet: any;
    handleChange: (name: string, value: any) => void;
}) {
    const selectedId = leadMagnet?.lead_magnet_template_id || 'blog-lead-magnet-5';

    useEffect(() => {
        if (!leadMagnet?.lead_magnet_template_id) {
            handleChange('lead_magnet_template_id', 'blog-lead-magnet-5');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="pt-3">
            <p className="text-xs font-semibold text-gray-500 mb-2">Select Template</p>
            <div className="grid grid-cols-2 gap-3">
                {leadFormTemplates.map(template => {
                    const isSelected = selectedId === template.id;
                    return (
                        <div
                            key={template.id}
                            onClick={() => handleChange('lead_magnet_template_id', template.id)}
                            className={`relative rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden
                                ${isSelected ? 'border-primary shadow-md' : 'border-gray-200 hover:border-primary/50'}`}
                        >
                            <div className="px-3 py-2.5 bg-white flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-800">{template.name}</p>
                                {isSelected && <CheckCircle2 size={16} className="shrink-0 text-primary" />}
                            </div>
                            <div className="pointer-events-none select-none w-full h-[110px] overflow-hidden bg-white">
                                <LeadMagnetTemplatePreview 
                                    magnet={{
                                        template_id: template.id,
                                        template_number: template.id,
                                        lead_magnet_instance_id: template.id,
                                        lead_magnet_instance_name: template.name,
                                        lead_magnet_instance_title: leadMagnet?.title || 'Get In Touch With Us',
                                        description: leadMagnet?.description || 'Have questions? We are here to help.',
                                        cta_button_text: leadMagnet?.cta_button || 'Contact Us Now',
                                        cover_image: { image_id: '', url: leadMagnet?.image_url || template.image || '' },
                                        pdf_url: '',
                                        required_form_fields: leadMagnet?.details_required?.length ? leadMagnet.details_required : ['name', 'email'],
                                    }} 
                                    height={110} 
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function TabUploadPDF({
    leadMagnet,
    handleChange,
    validationErrors,
}: {
    leadMagnet: any;
    handleChange: (name: string, value: any) => void;
    validationErrors: ValidationErrors;
}) {
    const { uploadFile, isUploading } = useUploadFile({
        onUploadComplete: file => { handleChange('pdf_url', file.url); },
        onUploadError: error => { console.log(error); },
    });

    const selectedTemplateId = leadMagnet?.lead_magnet_template_id || 'blog-lead-magnet-1';

    // Default template to blog-lead-magnet-1 if not set
    useEffect(() => {
        if (!leadMagnet?.lead_magnet_template_id) {
            handleChange('lead_magnet_template_id', 'blog-lead-magnet-1');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="pt-4">
            {/* Template Picker */}
            <p className="text-xs font-semibold text-gray-500 mb-2">Select Template</p>
            <div className="grid grid-cols-4 gap-2 mb-5">
                {pdfTemplates.map(template => {
                    const isSelected = selectedTemplateId === template.id;
                    return (
                        <div
                            key={template.id}
                            onClick={() => handleChange('lead_magnet_template_id', template.id)}
                            className={`relative rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden
                                ${isSelected ? 'border-primary shadow-md' : 'border-gray-200 hover:border-primary/50'}
                            `}
                        >
                            <div className="px-3 py-2.5 bg-white flex items-center justify-between gap-1">
                                <p className="text-sm font-semibold text-gray-800 truncate">{template.name}</p>
                                {isSelected && <CheckCircle2 size={16} className="shrink-0 text-primary" />}
                            </div>
                            <div className="pointer-events-none select-none w-full h-[110px] overflow-hidden bg-white">
                                <LeadMagnetTemplatePreview 
                                    magnet={{
                                        template_id: template.id,
                                        template_number: template.id,
                                        lead_magnet_instance_id: template.id,
                                        lead_magnet_instance_name: template.name,
                                        lead_magnet_instance_title: leadMagnet?.title || 'Download Your Free Guide',
                                        description: leadMagnet?.description || 'Learn how to quickly thrive with our comprehensive guide.',
                                        cta_button_text: leadMagnet?.cta_button || 'Download Now',
                                        cover_image: { image_id: '', url: leadMagnet?.image_url || template.image || '' },
                                        pdf_url: '',
                                        required_form_fields: ['email'],
                                    }} 
                                    height={110} 
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// PDF Source field with URL / Upload toggle
function PdfSourceField({
    leadMagnet,
    handleChange,
    validationErrors,
}: {
    leadMagnet: any;
    handleChange: (name: string, value: any) => void;
    validationErrors: ValidationErrors;
}) {
    const [mode, setMode] = useState<'url' | 'upload'>(
        leadMagnet?.pdf_url ? 'url' : 'upload'
    );
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    const { uploadFile, isUploading } = useUploadFile({
        onUploadComplete: file => handleChange('pdf_url', file.url),
        onUploadError: err => console.log(err),
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-800">
                    PDF Source <span className="text-red-500">*</span>
                    {leadMagnet?.template_type === 'ai_generated' && leadMagnet?.pdf_url && (
                        <span 
                            className="ml-3 font-medium text-xs text-primary hover:text-primary/80 underline cursor-pointer" 
                            onClick={() => setIsPdfModalOpen(true)}
                        >
                            View PDF
                        </span>
                    )}
                </p>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
                    <button
                        type="button"
                        onClick={() => setMode('url')}
                        className={`px-3 py-1.5 flex items-center gap-1 transition-colors
                            ${mode === 'url' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Link2 size={11} /> PDF URL
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('upload')}
                        className={`px-3 py-1.5 flex items-center gap-1 transition-colors
                            ${mode === 'upload' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Upload size={11} /> Upload
                    </button>
                </div>
            </div>
            {mode === 'url' ? (
                <Input
                    name="pdf_url"
                    value={leadMagnet?.pdf_url}
                    onChange={(v: any) => handleChange('pdf_url', v)}
                    inputType="text"
                    placeholder="Paste PDF URL here"
                    error={validationErrors.pdf_url}
                />
            ) : (
                <FileUploader
                    onUpload={(file: any) => uploadFile(file, 'document')}
                    className="w-full"
                    isUploading={isUploading}
                    value={leadMagnet?.pdf_url}
                    accept="application/pdf"
                />
            )}

            <Modal
                title="View PDF"
                open={isPdfModalOpen}
                onCancel={() => setIsPdfModalOpen(false)}
                footer={null}
                width={1200}
                centered
                destroyOnClose
            >
                <div className="w-full h-[70vh]">
                    <iframe
                        src={`${leadMagnet?.pdf_url}#toolbar=0`}
                        className="w-full h-full border-0 rounded-lg bg-gray-50"
                        title="PDF Viewer"
                    />
                </div>
            </Modal>
        </div>
    );
}

function TabAIGenerated({
    leadMagnet,
    handleChange,
    validationErrors,
    hasGeneratedContent,
}: {
    leadMagnet: any;
    handleChange: (name: string, value: any) => void;
    validationErrors: ValidationErrors;
    hasGeneratedContent: boolean;
}) {
    const { handleGenerateAIPDF, isGeneratingAIPDF } = useLeadMagnetService();
    const { checkIfCanUseAI } = useSuggestionService();
    const { data: creditPricing } = useCreditPricing();
    const leadMagnetCredits = getAssetCredit(creditPricing, 'lead_magnet');
    const leadMagnetId = leadMagnet?.lead_magnet_id;

    const onGenerate = async () => {
        if (!leadMagnetId) return;
        if (!checkIfCanUseAI()) return;
        try {
            await handleGenerateAIPDF({ leadMagnetId });
            const res = await leadMagnetsApi.handleGetLeadMagnet(leadMagnetId);
            if (res && res.details) {
                // Fill fields from details
                Object.entries(res.details).forEach(([key, value]) => {
                    let finalValue = value;
                    if (key === 'details_required' && Array.isArray(value)) {
                        finalValue = value.map(v => (v === 'phone_number' ? 'phone' : v));
                    }
                    handleChange(key, finalValue);
                });
                // Also ensure template_type and lead_magnet_template_id are set
                handleChange('template_type', 'ai_generated');
                if (res.lead_magnet_template_id) {
                    handleChange('lead_magnet_template_id', res.lead_magnet_template_id);
                }
            }
        } catch (error) {
            console.error('AI PDF Generation Error:', error);
        }
    };



    return (
        <div className="pt-4">
            <style>{`
                .coins-icon-white svg path {
                    fill: white !important;
                }
            `}</style>
            {!hasGeneratedContent && (
                <div
                    className={`flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-xl bg-primary/5 p-6 group hover:border-primary/40 transition-all min-h-[220px] mb-5`}
                >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Wand2 className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">AI Lead Magnet Resource Generator</h3>
                    <p className="text-sm text-gray-500 text-center max-w-[350px] mb-6">
                        Automatically generate a professional Lead Magnet for your blog post using AI.
                    </p>
                    <Button
                        loading={isGeneratingAIPDF}
                        onClick={onGenerate}
                        title={isGeneratingAIPDF ? 'Generating...' : 'Generate Lead Magnet with AI'}
                        className="rounded-xl h-11 px-8 !bg-primary !text-white font-semibold flex items-center gap-2"
                        icon={!isGeneratingAIPDF ? <BsStarsIcon /> : undefined}
                    >
                        {!isGeneratingAIPDF && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-white/25 backdrop-blur-sm text-white rounded-full text-xs font-semibold border border-white/40 shadow-sm ml-2">
                                <span className="inline-flex items-center coins-icon-white">
                                    <CoinsIcon className="h-3 w-3" />
                                </span>
                                {leadMagnetCredits}
                            </span>
                        )}
                    </Button>
                </div>
            )}

            {hasGeneratedContent && (
                <TabUploadPDF
                    leadMagnet={leadMagnet}
                    handleChange={handleChange}
                    validationErrors={validationErrors}
                />
            )}
        </div>
    );
}

function TabFromLibrary({
    leadMagnet,
    handleChange,
    validationErrors,
}: {
    leadMagnet: any;
    handleChange: (name: string, value: any) => void;
    validationErrors: ValidationErrors;
}) {
    const [libraryItems, setLibraryItems] = useState<LeadMagnetLibraryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchingId, setFetchingId] = useState<string | null>(null);
    const selectedId = leadMagnet?.library_lead_magnet_id;

    useEffect(() => {
        setIsLoading(true);
        leadMagnetLibraryApi.getAll()
            .then((res: any) => {
                const list: LeadMagnetLibraryItem[] = Array.isArray(res)
                    ? res
                    : Array.isArray(res?.data) ? res.data
                    : Array.isArray(res?.items) ? res.items
                    : Array.isArray(res?.results) ? res.results
                    : [];
                setLibraryItems(list);

                // Edit mode: if a library ID is already stored but item data is missing,
                // auto-select it to restore visual selection and populate library_lead_magnet_item.
                if (selectedId && !leadMagnet?.library_lead_magnet_item) {
                    const match = list.find(item => item.lead_magnet_instance_id === selectedId);
                    if (match) {
                        // fetch full details then set; fall back to the list item on error
                        leadMagnetLibraryApi.getById(selectedId)
                            .then(fresh => {
                                const resolved = fresh ?? match;
                                handleChange('library_lead_magnet_id', selectedId);
                                handleChange('library_lead_magnet_item', resolved);
                            })
                            .catch(() => {
                                handleChange('library_lead_magnet_id', selectedId);
                                handleChange('library_lead_magnet_item', match);
                            });
                    }
                }
            })
            .catch(() => setLibraryItems([]))
            .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelect = async (item: LeadMagnetLibraryItem) => {
        const id = item.lead_magnet_instance_id;
        setFetchingId(id);
        try {
            const fresh = await leadMagnetLibraryApi.getById(id);
            const resolved = fresh ?? item;
            handleChange('library_lead_magnet_id', id);
            handleChange('library_lead_magnet_item', resolved);
        } catch {
            handleChange('library_lead_magnet_id', id);
            handleChange('library_lead_magnet_item', item);
        } finally {
            setFetchingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-3 mt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl border-2 border-gray-100 overflow-hidden animate-pulse">
                        <div className="w-full h-[110px] bg-gray-100" />
                        <div className="px-3 py-2 bg-white flex flex-col gap-1">
                            <div className="h-3 bg-gray-200 rounded w-3/4" />
                            <div className="h-2 bg-gray-100 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (libraryItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[160px] text-center py-8 mt-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-sm font-medium mb-1">No library items found</p>
                <p className="text-gray-400 text-xs">Create lead magnets in the Lead Library page first.</p>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <p className="text-xs text-gray-500 mb-3">Select a saved lead magnet from your library</p>
            <div className='max-h-[calc(100vh-380px)] min-h-[300px] overflow-y-auto'>
            <div className="grid grid-cols-2 gap-3  pr-1">
                {libraryItems.map(item => {
                    const id = item.lead_magnet_instance_id;
                    const isSelected = selectedId === id;
                    const isFetching = fetchingId === id;
                    return (
                        <div
                            key={id}
                            onClick={() => !fetchingId && handleSelect(item)}
                            className={`relative rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                                isFetching ? 'opacity-70 cursor-wait' :
                                isSelected ? 'border-primary shadow-md cursor-pointer' :
                                'border-gray-200 hover:border-primary/50 cursor-pointer'
                            }`}
                        >
                            <div className="pointer-events-none select-none">
                                <LeadMagnetTemplatePreview magnet={item} height={110} />
                            </div>
                            <div className="px-3 py-2 bg-white flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-gray-800 truncate">
                                        {item.lead_magnet_instance_title || item.lead_magnet_instance_name}
                                    </p>
                                    <p className="text-[10px] text-gray-400 truncate">{item.lead_magnet_instance_name}</p>
                                </div>
                                {isFetching
                                    ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                                    : isSelected && <CheckCircle2 size={16} className="shrink-0 text-primary" />}
                            </div>
                        </div>
                    );
                })}
            </div>
            </div>
            {validationErrors.library_lead_magnet_id && (
                <p className="text-red-500 text-xs mt-2">{validationErrors.library_lead_magnet_id}</p>
            )}
        </div>
    );
}

export default ContentStep1;
