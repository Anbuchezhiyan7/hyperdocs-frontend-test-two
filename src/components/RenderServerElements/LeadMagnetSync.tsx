'use client';

import { useEffect } from 'react';
import { useTemplateStore } from '@/store/useTemplateStore';

interface LeadMagnetSyncProps {
    leadMagnetData: any[];
}

export default function LeadMagnetSync({ leadMagnetData }: LeadMagnetSyncProps) {
    const { setTemplateData } = useTemplateStore();

    useEffect(() => {
        if (leadMagnetData) {
            setTemplateData('leadMagnets', leadMagnetData);
        }
    }, [leadMagnetData, setTemplateData]);

    return null; 
}
