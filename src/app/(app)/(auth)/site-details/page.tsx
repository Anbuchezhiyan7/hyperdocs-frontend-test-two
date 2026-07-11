'use client';

import SiteDetailsContent from '@/components/auth/SiteDetails';
import { useQueryState } from 'nuqs';
import { useEffect } from 'react';

export default function SiteDetailsPage() {
    const [paramMode, setParamMode] = useQueryState('mode');

    useEffect(() => {
        setParamMode(null);
    }, []);

    return <SiteDetailsContent />;
}
