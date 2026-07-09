'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import CenteredModal from '@/components/common/Modals/CenteredModal';
import SettingsSidebar from './partials/Sidebar';
import SettingsContent from './partials/SettingsContent';
import { X } from 'lucide-react';

const SETTINGS_WIDTH = 900;

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const update = () => {
            const vw = window.innerWidth;
            setScale(vw < SETTINGS_WIDTH ? (vw * 0.9) / SETTINGS_WIDTH : 1);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const innerContent = (
        <div className='flex h-full w-full overflow-hidden relative'>
            <SettingsSidebar />
            <main className='h-full flex-1 min-w-0 bg-white p-6 overflow-y-auto relative'>
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 z-50 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 rounded-full transition-colors flex items-center justify-center'
                    aria-label="Close Settings"
                >
                    <X className='w-5 h-5' />
                </button>
                <SettingsContent />
            </main>
        </div>
    );

    if (!isOpen) return null;

    // Mobile: portal into document.body to escape the scaled MainLayout transform context
    if (scale < 1) {
        return createPortal(
            <div style={{ position: 'fixed', inset: 0, zIndex: 2000, overflow: 'hidden' }}>
                {/* Backdrop */}
                <div
                    style={{ position: 'absolute', inset: 0, background: 'rgba(100,100,100,0.4)', backdropFilter: 'blur(4px)' }}
                    onClick={onClose}
                />
                {/* Scaled content */}
                <div
                    style={{
                        position: 'absolute',
                        top: '5dvh',
                        left: '5vw',
                        width: `${SETTINGS_WIDTH}px`,
                        height: `calc(90dvh / ${scale})`,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        background: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                    }}
                >
                    {innerContent}
                </div>
            </div>,
            document.body
        );
    }

    // Desktop: existing modal
    return (
        <CenteredModal
            isOpen={isOpen}
            onClose={onClose}
            title='Settings'
            width='80vw'
            height='90vh'
            hideFooter
            childrenClassName='!p-0 overflow-hidden'
            headerClassName='!hidden'
            hideCloseIcon={true}
        >
            <div className='flex h-[90vh] overflow-hidden relative'>
                {innerContent}
            </div>
        </CenteredModal>
    );
};

export default SettingsModal;
