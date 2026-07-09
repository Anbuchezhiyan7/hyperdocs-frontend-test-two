'use client';

import React, { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import { LeadMagnet } from '@/assets/icons';
import LeadLibraryGrid from '@/components/lead-library/LeadLibraryGrid';
import LeadMagnetCreateModal from '@/components/lead-library/LeadMagnetCreateModal';
import { useLeadMagnetLibraryService } from '@/services/lead-magnet-library.service';

export default function LeadLibraryPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { refetchMagnets } = useLeadMagnetLibraryService();

    const handleSaved = () => {
        setIsCreateModalOpen(false);
        // React Query invalidation handles the list refresh
    };

    return (
        <div className="w-full h-screen flex flex-col">
            <Navbar
                title="Lead Library"
                hideSearch
                titleIcon={<LeadMagnet />}
                hideBtn={false}
                btnLabel="Add New Lead Magnet"
                btnAction={() => setIsCreateModalOpen(true)}
            />
            <div className="flex-1 overflow-auto p-6">
                <LeadLibraryGrid
                    onCreateNew={() => setIsCreateModalOpen(true)}
                />
            </div>

            <LeadMagnetCreateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSaved={handleSaved}
            />
        </div>
    );
}
