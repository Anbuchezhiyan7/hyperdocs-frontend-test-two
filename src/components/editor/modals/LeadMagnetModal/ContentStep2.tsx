import { Input } from '@/components/common/Input';
import { Info } from 'lucide-react';

interface ValidationErrors {
    [key: string]: string;
}

type ContentStep2Props = {
    leadMagnet: any;
    handleChange: (name: string, value: any) => void;
    isActive: boolean;
    allLeadMagnets: any[];
    validationErrors: ValidationErrors;
};

const options = [
    // {
    //     value: 'above_fold',
    //     label: 'Above-the-Fold CTA Block',
    //     sublabel: 'Right below the blog title',
    //     disabled: false,
    // },
    {
        value: 'sticky_sidebar',
        label: 'Sticky CTA',
        sublabel: 'Visible as the user scrolls in a bottom corner',
        disabled: false,
    },
    // {
    //     value: 'inline_mid_post',
    //     label: 'Inline CTA (Mid-Post)',
    //     sublabel: 'Inserted dynamically after the first 3-4 paragraphs',
    //     disabled: false,
    // },
];

const ContentStep2 = ({
    leadMagnet,
    handleChange,
    isActive,
    allLeadMagnets,
    validationErrors,
}: ContentStep2Props) => {
    const ctaPlacement = leadMagnet?.cta_placement;

    const stickyOption = options[0];
    const isStickyDisabled = allLeadMagnets.some(
        lead =>
            (lead.cta_placement === 'sticky_sidebar' || lead.details?.cta_placement === 'sticky_sidebar') &&
            lead?.lead_magnet_id !== leadMagnet?.lead_magnet_id
    );

    return (
        <div className={`flex flex-col gap-4 ${!isActive ? '!hidden' : ''}`}>
            <div className='flex flex-col gap-1'>
                <h6 className='text-base font-bold'>Dynamic CTA Placement</h6>
                <p className='text-xs text-gray-500'>Control where this lead magnet appears on your blog post</p>
            </div>

            <div className={`p-4 rounded-xl border transition-all duration-200 ${ctaPlacement === 'sticky_sidebar' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'} ${isStickyDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col'>
                        <span className='font-bold text-sm text-gray-900'>{stickyOption.label}</span>
                        <span className='text-xs text-gray-500'>{stickyOption.sublabel}</span>
                    </div>
                    
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full shadow-inner">
                        <input
                            type="checkbox"
                            id="sticky-toggle"
                            className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border-4 border-gray-300 rounded-full appearance-none cursor-pointer checked:translate-x-6 checked:border-orange-500 disabled:cursor-not-allowed"
                            checked={ctaPlacement === 'sticky_sidebar'}
                            disabled={isStickyDisabled}
                            onChange={(e) => {
                                handleChange('cta_placement', e.target.checked ? 'sticky_sidebar' : null);
                            }}
                        />
                        <label 
                            htmlFor="sticky-toggle" 
                            className={`block h-6 overflow-hidden transition-colors duration-200 ease-in-out rounded-full cursor-pointer ${ctaPlacement === 'sticky_sidebar' ? 'bg-orange-500' : 'bg-gray-300'}`}
                        ></label>
                    </div>
                </div>

                {isStickyDisabled && (
                    <div className='mt-3 flex items-start gap-2 p-2 bg-white rounded-lg border border-gray-100 shadow-sm'>
                        <Info size={14} className='text-orange-500 mt-0.5' />
                        <p className='text-[11px] text-gray-600 leading-normal'>
                            This placement is <strong>disabled</strong> because another lead magnet on this blog is already occupying the sticky position. You can only have one sticky lead magnet per post.
                        </p>
                    </div>
                )}
            </div>

            {validationErrors.cta_placement && (
                <p className='text-xs text-red-500'>{validationErrors.cta_placement}</p>
            )}
        </div>
    );
};

export default ContentStep2;
