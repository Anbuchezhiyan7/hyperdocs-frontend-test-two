'use client';

import React from 'react';
import { CenteredModal } from '@/components/common/Modals';
import { useQueryState } from 'nuqs';
import { Button } from 'antd';
import { Wand2, Upload } from 'lucide-react';
import useLeadMagnetService from '@/services/lead-magnet.service';
import { useSuggestionService } from '@/services/suggestion.service';
import { CoinsIcon } from '@/assets/icons';
import { getAssetCredit, useCreditPricing } from '@/hooks/use-credit-pricing';

const LeadMagnetAIModal = () => {
    const [open, setOpen] = useQueryState('mode');
    const [leadMagnetId, setLeadMagnetId] = useQueryState('id');
    const { handleGenerateAIPDF, isGeneratingAIPDF } = useLeadMagnetService();
    const { checkIfCanUseAI } = useSuggestionService();

    const { data: creditPricing } = useCreditPricing();
    const aiPdfCredits = getAssetCredit(creditPricing, 'ai_pdf_generation');

    const [mandatoryResource, setMandatoryResource] = useQueryState('mandatory_resource');

    const handleAIGenerated = async () => {
        if (!leadMagnetId) return;
        if (!checkIfCanUseAI()) return;

        try {
            const res = await handleGenerateAIPDF({ leadMagnetId });
            console.log('AI PDF Generation Response:', res);
            setMandatoryResource('true');
            setOpen('lead-magnet');
        } catch (error) {
            console.error('AI PDF Generation Error:', error);
            setMandatoryResource('true');
            setOpen('lead-magnet');
        }
    };

    const handleManualUpload = () => {
        setMandatoryResource('true');
        setOpen('lead-magnet');
    };

    return (
        <CenteredModal
            isOpen={open === 'lead-magnet-ai'}
            onClose={() => {}}
            title="Lead Magnet Resource"
            width={500}
            hideFooter
            hideCloseIcon
        >
            <div className="flex flex-col gap-6 py-4">
                <p className="text-gray-600 text-center">
                    How would you like to provide the Resource for this lead magnet?
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleAIGenerated}
                        disabled={isGeneratingAIPDF}
                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-primary/20 hover:border-primary hover:bg-primary/5 transition-all group relative overflow-hidden"
                    >
                        {!isGeneratingAIPDF && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-[#FFEEE5] text-[#FF5200] rounded-full text-[12px] font-bold shadow-sm">
                                <span className="inline-flex items-center [&_path]:fill-[#FF5200] text-lg">
                                    <CoinsIcon className="h-4 w-4" />
                                </span>
                                {aiPdfCredits}
                            </div>
                        )}
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Wand2 className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-center">
                            <span className="block font-semibold text-gray-900"> Generate by HyperBlog</span>
                            <span className="text-xs text-gray-500">Automatically create via AI</span>
                        </div>
                        {isGeneratingAIPDF && <span className="text-xs text-primary animate-pulse">Generating...</span>}
                    </button>

                    <button
                        onClick={handleManualUpload}
                        disabled={isGeneratingAIPDF}
                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="text-center">
                            <span className="block font-semibold text-gray-900">Upload Manually</span>
                            <span className="text-xs text-gray-500">Choose your own PDF file</span>
                        </div>
                    </button>
                </div>
            </div>
        </CenteredModal>
    );
};

export default LeadMagnetAIModal;
