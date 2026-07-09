'use client';

import SiteDetailsContent from '@/components/auth/SiteDetails';
import { useQueryState } from 'nuqs';
import { useEffect } from 'react';

export default function LoginPage () {
    const [paramMode, setParamMode] = useQueryState('mode');

    useEffect(() => {
        setParamMode(null);
    }, []);

    return (
        <div className='flex items-center h-screen justify-center flex-col gap-4'>
            <SiteDetailsContent />
        </div>
    );
}
