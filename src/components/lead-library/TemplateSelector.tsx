'use client';
import React from 'react';
import LeadMagnetTemplates from '@/components/editor/LeadMagnet/templates';
import { X } from 'lucide-react';
import LeadMagnetTemplatePreview from '@/components/lead-library/LeadMagnetTemplatePreview';

interface TemplateSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (templateId: string) => void;
    inline?: boolean;
}

const TemplateSelectorContent: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => (
    <div className="overflow-y-auto py-2">
        {/* 2 col mobile/tablet → 3 col lg */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {LeadMagnetTemplates.filter(t => !t.isLeadForm).map(template => (
                <button
                    key={template.id}
                    onClick={() => onSelect(template.id)}
                    className="group text-left border-2 border-gray-100 rounded-xl overflow-hidden hover:border-orange-400 hover:shadow-lg transition-all duration-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                    {/* Preview */}
                    <div className="w-full bg-white overflow-hidden relative pointer-events-none select-none">
                        <LeadMagnetTemplatePreview 
                            magnet={{
                                template_id: template.id,
                                template_number: template.id,
                                lead_magnet_instance_name: template.name,
                                lead_magnet_instance_title: 'Download Your Free Guide',
                                description: 'Learn how to quickly thrive with our comprehensive guide.',
                                cta_button_text: 'Download Now',
                                cover_image: { image_id: '', url: template.image ?? '' },
                                pdf_url: '',
                                required_form_fields: ['email'],
                                lead_magnet_instance_id: template.id,
                            }} 
                        />
                        <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-all duration-200" />
                    </div>

                    {/* Name row */}
                    <div className="px-4 py-3 flex items-center justify-between bg-white border-t border-gray-100">
                        <span className="font-semibold text-gray-800 text-sm">{template.name}</span>
                        <span className="text-xs text-orange-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Select →
                        </span>
                    </div>
                </button>
            ))}
        </div>
    </div>
);

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ isOpen, onClose, onSelect, inline }) => {
    // Inline mode — rendered inside the parent modal (no wrapper)
    if (inline) {
        return <TemplateSelectorContent onSelect={onSelect} />;
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[85vh] z-10">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Choose a Template</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Select a template to start creating your lead magnet</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 flex-1">
                    <TemplateSelectorContent onSelect={onSelect} />
                </div>
            </div>
        </div>
    );
};

export default TemplateSelector;
