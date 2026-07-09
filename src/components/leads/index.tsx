'use client';

import React from 'react';
import { LeadListItem } from '@/assets/types';
import { LeadsToolbar } from '../blogs/BlogDetail/Leads/LeadsToolbar';
import { Table } from '../ui/table';

const Leads: React.FC = () => {
    const handleSearch = (query: string) => {
        console.log('Searching:', query);
    };

    const handleDownload = () => {
        console.log('Downloading CSV');
    };

    const handleRowClick = (lead: LeadListItem) => {
        console.log('Lead clicked:', lead);
    };

    return (
        <div className='p-6'>
            <LeadsToolbar onSearch={handleSearch} onDownload={handleDownload} />
            <Table className='rounded-lg overflow-hidden' />
        </div>
    );
};

export default Leads;
