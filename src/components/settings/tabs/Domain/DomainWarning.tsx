'use client';

import React from 'react';
import { Alert } from 'antd';
import { AlertCircle } from 'lucide-react';

interface DomainWarningProps {
    isVisible: boolean;
}

const DomainWarning: React.FC<DomainWarningProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <Alert
                message={
                    <span className="font-bold text-[#856404]">
                        Connection Restricted
                    </span>
                }
                description={
                    <span className="text-[#856404] font-medium">
                        Only one connection type can be active at a time. Please disconnect your existing connection to proceed.
                    </span>
                }
                type="warning"
                showIcon
                icon={<AlertCircle className="w-5 h-5 text-orange-500" />}
                className="rounded-2xl border-orange-200 bg-[#FFF3CD] shadow-sm py-4"
            />
        </div>
    );
};

export default DomainWarning;
