'use client';

import React from 'react';
import NextjsIntegration from './NextjsIntegration';
import WordPressIntegration from './WordPressIntegration';

interface IntegrationStepProps {
    framework: 'nextjs' | 'wordpress' | null;
    subFolder: string;
}
const IntegrationStep: React.FC<IntegrationStepProps> = ({ framework, subFolder }) => {
    if (framework === 'nextjs') {
        return <NextjsIntegration subFolder={subFolder} />;
    }

    if (framework === 'wordpress') {
        return <WordPressIntegration subFolder={subFolder} />;
    }

    return (
        <div className="flex items-center justify-center p-12 text-gray-400 font-medium italic bg-white rounded-2xl border border-gray-100 shadow-sm">
            Please select a framework to see integration instructions.
        </div>
    );
};

export default IntegrationStep;
