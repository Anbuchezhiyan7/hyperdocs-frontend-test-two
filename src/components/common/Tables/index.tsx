'use client';

import React from 'react';
import {
    Table as TableRoot,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/utils/cn';

interface TableProps {
    columns: TableColumn[];
    data: Record<string, any>[];
    isLoading?: boolean;
}

const Table: React.FC<TableProps> = React.memo(({ columns, data, isLoading }) => {
    return (
        <div className='w-full'>
            <TableRoot>
                <TableHeader>
                    <TableRow className='bg-white border-b'>
                        {columns.map(({ key, title, className }) => (
                            <TableHead key={key} className={cn('py-4', className)}>
                                {title}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={columns.length} className='h-24 text-center'>
                                No results
                            </TableCell>
                        </TableRow>
                    )}
                    {data?.map(row => (
                        <TableRow key={row.id} className='bg-white hover:bg-gray-50'>
                            {columns.map(({ key, className, render }) => (
                                <TableCell
                                    key={key}
                                    className={cn('py-4 font-semibold', className)}
                                >
                                    {render ? render(row) : row[key] || '-'}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </TableRoot>
        </div>
    );
});

Table.displayName = 'Table';

export default Table;
