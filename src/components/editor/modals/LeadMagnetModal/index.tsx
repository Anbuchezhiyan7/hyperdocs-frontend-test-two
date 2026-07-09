import { useState, useEffect, useRef } from 'react';
import { CenteredModal } from '@/components/common/Modals';
import { LeadMagnetLibraryItem } from '@/api/lead-magnet-library.api';
import { Modal } from 'antd';

import ModalHeader from './Header';
import ContentStep1 from './ContentStep1';
import ContentStep2 from './ContentStep2';
import ModalFooter from './Footer';
import { useQueryState } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import leadMagnetsApi from '@/api/lead-magnet.api';
import useLeadMagnetService from '@/services/lead-magnet.service';
import { useEditorRef } from '@udecode/plate/react';
import { useParams } from 'next/navigation';
import { queryClient } from '@/config/query.config';
import { insertLeadMagnetNode, removeLeadMagnetFromEditor } from './helper';
import { Spinner } from '@/components/plate-ui/spinner';

interface ValidationErrors {
    [key: string]: string;
}

const LeadMagnetModal = () => {
    const [open, setOpen] = useQueryState('mode');
    const [mandatoryResource, setMandatoryResource] = useQueryState('mandatory_resource');
    const [activeIndex, setActiveIndex] = useState(0);
    const [leadMagnetId, setLeadMagnetId] = useQueryState('id');
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const [allFormData, setAllFormData] = useState<any>({});
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const editor = useEditorRef();
    const blogId = useParams().id as string;
    const [type, setType] = useQueryState('type');
    const [leadType, setLeadType] = useQueryState('leadType');

    const {
        isLoading: isUpdatingLeadMagnet,
        handleCreateLeadMagnet,
        handleDeleteLeadMagnet,
        handleUpdateLeadMagnet,
        isDeletingLeadMagnet,
        isError,
        isCreatingLeadMagnet,
    } = useLeadMagnetService(leadMagnetId);

    const currentLead = allFormData[leadMagnetId as string];
    const LEAD_FORM_IDS = ['blog-lead-magnet-5', 'blog-lead-magnet-6'];
    const isLeadForm =
        leadType === 'lead-form' ||
        currentLead?.template_type === 'lead_form' ||
        LEAD_FORM_IDS.includes(currentLead?.lead_magnet_template_id);
    const isFromLibrary = currentLead?.template_type === 'library';

    const validateStep1 = () => {
        const errors: ValidationErrors = {};
        const currentData = allFormData[leadMagnetId as string] || {};

        // From Library: only validate that a library item is selected — no title/desc/cta needed
        if (isFromLibrary) {
            if (!currentData.library_lead_magnet_id) {
                errors.library_lead_magnet_id = 'Please select a lead magnet from your library';
            }
            setValidationErrors(errors);
            return Object.keys(errors).length === 0;
        }

        if (!currentData.title?.trim()) {
            errors.title = 'Title is required';
        }
        if (!currentData.description?.trim()) {
            errors.description = 'Description is required';
        }
        if (!currentData.cta_button?.trim()) {
            errors.cta_button = 'CTA button text is required';
        }

        // Newsletter: no longer handled here
        if (isLeadForm) {
            if (!currentData.details_required?.length) {
                errors.details_required = 'Please select at least one field to collect';
            }
            setValidationErrors(errors);
            return Object.keys(errors).length === 0;
        }

        if (currentData.template_type !== 'newsletter' && !currentData.details_required?.length) {
            errors.details_required = 'At least one detail field is required';
        }

        // Template specific validations
        if ((currentData?.template_type === 'upload_pdf' || currentData?.template_type === 'ai_generated') && !currentData?.pdf_url?.trim()) {
            errors.pdf_url = 'PDF URL or file is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep2 = () => {
        const errors: ValidationErrors = {};
        const currentData = allFormData[leadMagnetId as string];

        // if (!currentData?.cta_placement) {
        //     errors.cta_placement = 'CTA placement is required';
        // }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const fetchLeadMagnets = async () => {
        const res = await leadMagnetsApi.handleGetAllLeadMagnets(blogId);
        if (res?.length > 0) {
            if (!leadMagnetId) {
                setLeadMagnetId(res[0].lead_magnet_id);
            }
            res?.map((lead: any) => {
                // library_lead_magnet_id and library_lead_magnet_item are returned at the
                // TOP LEVEL of the API response, not inside details.
                const topLevelLibId = lead.library_lead_magnet_id;
                const topLevelLibItem = lead.library_lead_magnet_item;

                setAllFormData((prev: any) => ({
                    ...prev,
                    [lead.lead_magnet_id]: {
                        ...lead,
                        ...lead?.details,
                        details_required: (lead?.details?.details_required || []).map((v: any) => v === 'phone_number' ? 'phone' : v),
                        // Prefer top-level library fields; fall back to details for older records
                        library_lead_magnet_id: topLevelLibId || lead?.details?.library_lead_magnet_id,
                        library_lead_magnet_item: topLevelLibItem || lead?.details?.library_lead_magnet_item,
                        title: lead?.details?.title || (
                            lead.template_type === 'newsletter' ? 'Subscribe to Newsletter'
                            : ['blog-lead-magnet-5', 'blog-lead-magnet-6'].includes(lead?.details?.lead_magnet_template_id) ? 'Get In Touch With Us'
                            : ''
                        ),
                        description: lead?.details?.description || (
                            lead.template_type === 'newsletter' ? 'Stay up to date with our latest news'
                            : ['blog-lead-magnet-5', 'blog-lead-magnet-6'].includes(lead?.details?.lead_magnet_template_id) ? 'Have questions? We are here to help.'
                            : ''
                        ),
                        // Remap lead-form template ids back to 'lead_form' for internal UI use
                        template_type: ['blog-lead-magnet-5', 'blog-lead-magnet-6'].includes(lead?.details?.lead_magnet_template_id)
                            ? 'lead_form'
                            : (lead.template_type || 'upload_pdf'),
                        lead_magnet_template_id: lead?.details?.lead_magnet_template_id || 'blog-lead-magnet-1',
                        cta_placement: lead?.details?.cta_placement
                            ? lead?.details?.cta_placement
                            : 'above_fold',
                    },
                }));
            });
        }
        return res;
    };

    const { data: leadMagnets, isLoading: isGettingLeadMagnets } = useQuery({
        queryKey: ['lead-magnets'],
        queryFn: () => fetchLeadMagnets(),
        enabled: open === 'lead-magnet',
    });

    // Filter lead magnets based on the type that was clicked in the insert menu.
    // Lead form is identified by lead_magnet_template_id='blog-lead-magnet-5' (stored as 'library' in API).
    const LEAD_FORM_TEMPLATE_IDS = ['blog-lead-magnet-5', 'blog-lead-magnet-6'];
    const filteredLeadMagnets = (leadMagnets ?? []).filter((lm: any) => {
        const isLeadFormEntry = LEAD_FORM_TEMPLATE_IDS.includes(lm?.details?.lead_magnet_template_id);
        if (leadType === 'lead-form') return isLeadFormEntry;
        // default: hide lead-form entries; newsletter is now a separate global feature
        return !isLeadFormEntry;
    });

    const isCreatingRef = useRef(false);

    // Only trigger creation when leadMagnetId is explicitly 'new' (set by insert menu).
    useEffect(() => {
        if (open !== 'lead-magnet' || leadMagnetId !== 'new') {
            return;
        }
        handleCreate();
    }, [open, leadMagnetId]);

    const handleClose = (forceBypass?: boolean | any) => {
        const currentFormData = allFormData[leadMagnetId as string];
        const isLib = currentFormData?.template_type === 'library' || isFromLibrary;
        const isForm = currentFormData?.template_type === 'lead_form' || isLeadForm;
        
        if (mandatoryResource === 'true' && forceBypass !== true && !isLib && !isForm && !currentFormData?.pdf_url) {
            setIsWarningModalOpen(true);
            return;
        }

        setActiveIndex(0);
        setOpen(null);
        setMandatoryResource(null);
        setLeadMagnetId(null);
        setCurrentStep(1);
        setValidationErrors({});
        setType(null);
        setLeadType(null); // clear so stale leadType doesn't affect next edit
        isCreatingRef.current = false; // reset so re-opening works correctly
    };

    const handleDelete = async () => {
        await handleDeleteLeadMagnet({ leadMagnetId: leadMagnetId as string }).then(async () => {
            if (!isError && !isDeletingLeadMagnet) {
                await removeLeadMagnetFromEditor(editor, leadMagnetId as string);
                handleClose(true);
            }
        });
    };

    const handleSave = async () => {
        const currentFormData = allFormData[leadMagnetId as string] || {};
        if (!isLeadForm && !isFromLibrary && !validateStep2()) {
            return;
        }

        // From Library: pull data from the API-fetched library item
        if (isFromLibrary) {
            const libItem: LeadMagnetLibraryItem | undefined = currentFormData.library_lead_magnet_item;

            // Map template_number (e.g. 'template_1') → internal ID (e.g. 'blog-lead-magnet-1')
            const TEMPLATE_NUMBER_MAP: Record<string, string> = {
                template_1: 'blog-lead-magnet-1',
                template_2: 'blog-lead-magnet-2',
                template_3: 'blog-lead-magnet-3',
                template_4: 'blog-lead-magnet-4',
            };
            const resolvedTemplateId =
                libItem?.template_id ||
                TEMPLATE_NUMBER_MAP[libItem?.template_number ?? ''] ||
                'blog-lead-magnet-1';

            const payload = {
                lead_magnet_id: leadMagnetId,
                blog_id: blogId,
                template_type: 'library' as const,
                library_lead_magnet_id: libItem?.lead_magnet_instance_id || currentFormData.library_lead_magnet_id || '',
                library_lead_magnet_item: libItem || currentFormData.library_lead_magnet_item || null,
                details: {
                    pdf_url: libItem?.pdf_url || null,
                    title: libItem?.lead_magnet_instance_title || libItem?.lead_magnet_instance_name || '',
                    description: libItem?.description || '',
                    cta_placement: currentFormData.cta_placement || 'above_fold',
                    cta_button: libItem?.cta_button_text || '',
                    details_required: libItem?.required_form_fields || [],
                    image_url: libItem?.cover_image?.url || null,
                    placeholder_text: '',
                    bg_color: '',
                    button_color: '',
                    lead_magnet_template_id: resolvedTemplateId,
                    library_lead_magnet_id: libItem?.lead_magnet_instance_id || currentFormData.library_lead_magnet_id || '',
                    library_lead_magnet_item: libItem || currentFormData.library_lead_magnet_item || null,
                },
            };
       
            try {
                if (leadMagnetId) {
                    const updateRes = await handleUpdateLeadMagnet({
                        leadMagnetId: leadMagnetId as string,
                        leadMagnet: payload,
                    });
                    if (updateRes) {
                        queryClient.setQueryData(['lead-magnet', leadMagnetId as string], updateRes);
                    }
                    queryClient.invalidateQueries({ queryKey: ['lead-magnet', leadMagnetId as string] });
                    if (type === 'edit') {
                        await queryClient.invalidateQueries({ queryKey: ['blog', blogId] });
                    }
                    const pluginData = {
                        plugin_data_id: leadMagnetId,
                        type: 'lead_magnet',
                        lead_magnet_type: 'library',
                        children: [{ text: '' }],
                    };
                    await insertLeadMagnetNode(editor, pluginData, payload.details.cta_placement);
                    handleClose();
                }
            } catch (error) {
                console.error('SAVE ERROR', error);
            }
            return;
        }

        const templateType = isLeadForm
            ? 'library'
            : (currentFormData.template_type || 'upload_pdf');

        const payload = {
            lead_magnet_id: leadMagnetId,
            blog_id: blogId,
            template_type: templateType,
            details: {
                pdf_url: currentFormData.pdf_url || null,
                title: currentFormData.title || '',
                description: currentFormData.description || '',
                cta_placement: currentFormData.cta_placement || 'above_fold',
                cta_button: currentFormData.cta_button || '',
                details_required: currentFormData.details_required || [],
                image_url: currentFormData.image_url || null,
                placeholder_text: currentFormData.placeholder_text || '',
                bg_color: currentFormData.bg_color || '',
                button_color: currentFormData.button_color || '',
                lead_magnet_template_id: currentFormData.lead_magnet_template_id
                    || (isLeadForm ? 'blog-lead-magnet-5' : 'blog-lead-magnet-1'),
            },
        };

     

        try {
            if (leadMagnetId) {
                const updateRes = await handleUpdateLeadMagnet({
                    leadMagnetId: leadMagnetId as string,
                    leadMagnet: payload,
                });
                // Directly set the new data into the cache key the LeadMagnetElement watches.
                // This avoids the timing/key-mismatch issues with invalidateQueries vs remount.
                if (updateRes) {
                    queryClient.setQueryData(['lead-magnet', leadMagnetId as string], updateRes);
                }
                // Also invalidate to sync any background watchers
                queryClient.invalidateQueries({
                    queryKey: ['lead-magnet', leadMagnetId as string],
                });
                if (type === 'edit') {
                    await queryClient.invalidateQueries({
                        queryKey: ['blog', blogId],
                    });
                }
                const pluginData = {
                    plugin_data_id: leadMagnetId,
                    type: 'lead_magnet',
                    lead_magnet_type: isLeadForm ? 'lead-form' : templateType,
                    children: [{ text: '' }],
                };
                const placement = payload?.details?.cta_placement;
                await insertLeadMagnetNode(editor, pluginData, placement);
                handleClose();
            } else {
            }
        } catch (error) {
            console.error('SAVE ERROR', error);
        }
    };

    const handleCreate = async () => {
        // Single guard for all callers (useEffect + ModalHeader's "Add New" button)
        if (isCreatingRef.current) return;
        isCreatingRef.current = true;
        try {
            const res = await handleCreateLeadMagnet();
            if (res) {
                setLeadMagnetId(res.lead_magnet_id);
                setAllFormData((prev: any) => ({
                    ...prev,
                    [res.lead_magnet_id]: {
                        ...res,
                        ...res?.details,
                        details_required: (res?.details?.details_required || []).map((v: any) => v === 'phone_number' ? 'phone' : v),
                        title: res?.details?.title || (res.template_type === 'newsletter' || res.template_type === 'news-letter' ? 'Subscribe to Newsletter' : ''),
                        description: res?.details?.description || (res.template_type === 'newsletter' || res.template_type === 'news-letter' ? 'Stay up to date with our latest news' : ''),
                        template_type: res.template_type && res.template_type !== 'upload_pdf' 
                            ? res.template_type 
                            : (res?.details?.lead_magnet_template_id === 'blog-lead-magnet-4' ? 'newsletter' : 'upload_pdf'),
                        lead_magnet_template_id: res?.details?.lead_magnet_template_id || 'blog-lead-magnet-1',
                        cta_placement: res?.details?.cta_placement
                            ? res?.details?.cta_placement
                            : 'above_fold',
                    },
                }));
            }
        } catch (error) {
            console.error('CREATE ERROR', error);
        } finally {
            isCreatingRef.current = false;
        }
    };

    const handleChange = (name: string, value: any) => {
        setAllFormData((prev: any) => ({
            ...prev,
            [leadMagnetId as string]: { ...prev[leadMagnetId as string], [name]: value },
        }));
        // Clear validation error when field is updated
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleNextStep = () => {
        if (validateStep1()) {
            if (isLeadForm) {
                handleSave();
            } else if (isFromLibrary) {
                setCurrentStep(2);
            } else {
                setCurrentStep(2);
            }
        }
    };

    return (
        <>
        <CenteredModal
            isOpen={open === 'lead-magnet'}
            onClose={handleClose}
            width={950}
            hideCloseIcon
            rootClassName='h-[85vh]'
            headerComponent={
                <ModalHeader
                    leadMagnets={filteredLeadMagnets}
                    allFormData={allFormData}
                    activeLead={activeIndex}
                    setActiveLead={setCurrentStep}
                    handleAdd={handleCreate}
                    onClose={handleClose}
                    isLoading={isCreatingLeadMagnet}
                />
            }
            footerComponent={
                filteredLeadMagnets?.length > 0 || allFormData[leadMagnetId as string] ? (
                    <ModalFooter
                        currentStep={currentStep}
                        setCurrentStep={(step) => step === 1 ? setCurrentStep(1) : handleNextStep()}
                        onRemove={handleDelete}
                        onSave={handleSave}
                        isNewsletter={false}
                        isLeadForm={isLeadForm}
                        isDeleting={isDeletingLeadMagnet}
                        isSaving={isUpdatingLeadMagnet}
                    />
                ) : (
                    <></>
                )
            }
        >
            {isGettingLeadMagnets ? (
                <div className='flex justify-center items-center h-full'>
                    <Spinner className='w-10 h-10' />
                </div>
            ) : filteredLeadMagnets?.length === 0 && !allFormData[leadMagnetId as string] ? (
                <div className='flex justify-center items-center h-full'>
                    <p className='text-primary'>No lead magnets found</p>
                </div>
            ) : (
                <div className='pt-3'>
                    {!isLeadForm && !isFromLibrary && <h6 className='text-primary mb-2'>Step - {currentStep}/2</h6>}
                    <ContentStep1
                        leadMagnet={allFormData[leadMagnetId as string]}
                        handleChange={handleChange}
                        isActive={currentStep === 1}
                        validationErrors={validationErrors}
                    />
                    <ContentStep2
                        leadMagnet={allFormData[leadMagnetId as string]}
                        handleChange={handleChange}
                        isActive={currentStep === 2}
                        allLeadMagnets={Object.values(allFormData)}
                        validationErrors={validationErrors}
                    />
                </div>
            )}
        </CenteredModal>
        
        <Modal
            title="Resource Required"
            open={isWarningModalOpen}
            onOk={() => setIsWarningModalOpen(false)}
            onCancel={() => setIsWarningModalOpen(false)}
            okText="Got it"
            cancelButtonProps={{ style: { display: 'none' } }}
            centered
            zIndex={9999}
        >
            <p>This Lead Magnet requires a resource. Please upload a Lead Magnet Resource</p>
        </Modal>
        </>
    );
};

export default LeadMagnetModal;
