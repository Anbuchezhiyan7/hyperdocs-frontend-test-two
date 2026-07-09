'use client';

import Navbar from '@/components/common/Navbar';
import Domain from '@/components/settings/tabs/Domain';
import { GlobeIcon } from '@/assets/icons';

const CustomDomainPage = () => {
    return (
        <div className="w-full h-screen flex flex-col">
            <Navbar
                title="Custom Domain"
                hideSearch
                titleIcon={<GlobeIcon />}
                hideBtn
            />
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-6 md:p-8">
                    <Domain />
                </div>
            </div>
        </div>
    );
};

export default CustomDomainPage;
