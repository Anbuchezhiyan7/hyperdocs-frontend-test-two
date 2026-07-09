'use client';
import React from 'react';

interface HyperblogBrandingProps {
    /** Resolved server-side; the badge only shows for free-plan tenants. */
    isFreePlan?: boolean;
}

const HyperblogBranding: React.FC<HyperblogBrandingProps> = ({ isFreePlan = false }) => {
    const handleClick = () => {
        window.open('https://hyperblog.io/?utm_source=Referral&utm_medium=made-by-hyperblog-tag&utm_campaign=PLG', '_blank');
    };

    if (!isFreePlan) {
        return null;
    }

    return (
        <div className="bg-white border-t border-gray-200 py-2">
            <div className="w-[90%] mx-auto">
                <div className="flex items-center justify-center">
                    <div className="text-sm text-gray-500 flex flex-row items-center gap-1">
                        <span> Made with</span>
                        <span   onClick={handleClick} className='font-bold text-[#FF5200] cursor-pointer hover:opacity-80 transition-opacity'>HyperBlog</span>
                        {/* <HyperBlogIcon/> */}
                        {/* <span
                          
                            className="mt-0.5 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <HyperBlogBranding />
                        </span> */}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default HyperblogBranding;
