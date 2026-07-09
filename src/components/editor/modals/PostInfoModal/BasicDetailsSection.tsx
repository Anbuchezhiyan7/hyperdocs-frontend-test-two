import React from 'react';
import { Typography } from 'antd';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/store/useAppStore';
import { formatDateTime } from '@/utils/timezone';

interface BasicDetailsProps {
    status: string;
    date: string;
    lastUpdated: string;
}

const BasicDetailsSection: React.FC<BasicDetailsProps> = ({ status, date, lastUpdated }) => {
    const { settings } = useAppStore();
    const color = status === 'draft' ? 'text-orange-500' : 'text-success';

    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <Typography.Text>Status</Typography.Text>
                <Typography.Text className={cn(' capitalize', color)}>{status}</Typography.Text>
            </div>
            <div className="flex justify-between">
                <Typography.Text>Date </Typography.Text>
                <Typography.Text>
                    {formatDateTime(date, settings.general.time_zone, 'DD MMM YYYY')}
                </Typography.Text>
            </div>
            <div className="flex justify-between">
                <Typography.Text>Last Updated on</Typography.Text>
                <Typography.Text>
                    {formatDateTime(lastUpdated, settings.general.time_zone, 'DD MMM YYYY')}
                </Typography.Text>
            </div>
        </div>
    );
};

export default BasicDetailsSection;
