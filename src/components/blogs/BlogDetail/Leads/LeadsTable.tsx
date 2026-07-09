import Table from '@/components/common/Tables';
import React from 'react';

const columns: TableColumn[] = [
    { key: 'user_name', title: 'NAME', className: 'pl-6' },
    { key: 'user_email', title: 'EMAIL ID' },
    { key: 'phone', title: 'PHONE' },
    {
        key: 'created_date',
        title: 'DATE & TIME',
        render: (row) => (
            <div className="flex flex-col">
                <span className='whitespace-nowrap'>{row.created_date || '-'}</span>
                <span className="text-[10px] text-gray-500 font-normal leading-tight">{row.created_time || '-'}</span>
            </div>
        )
    },
];

export const LeadsTable: React.FC<any> = ({ leads }) => {
    return (
        <div className='w-full'>
            <Table columns={columns} data={leads} />
        </div>
    );
};
