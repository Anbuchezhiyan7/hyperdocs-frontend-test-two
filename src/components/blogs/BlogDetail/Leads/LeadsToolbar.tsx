import React from 'react';
import { Button } from 'antd';
import { FileDownloadIcon } from '@/assets/icons';
import { FilterIcon} from '@/assets/icons';
import SearchInput from '@/components/common/Input/SearchInput';

interface LeadsToolbarProps {
    onSearch: (query: string) => void;
    onDownload: () => void;
}

export const LeadsToolbar: React.FC<LeadsToolbarProps> = ({ onSearch, onDownload }) => {
    return (
        <div className="flex items-center justify-between mb-4  pr-6">
            <div className="flex gap-2 w-full">
                <SearchInput
                    className=" h-[40px]"
                    onSearch={onSearch}
                    placeholder="Search leads..."
                />
                <Button
                    className="text-white rounded-[14px]"
                    icon={<FileDownloadIcon />}
                    type="primary"
                    onClick={onDownload}
                >
                    Download as CSV
                </Button>
                <Button
                    className="text-black rounded-[14px]"
                    type="default"
                    icon={<FilterIcon  />}
                >
                    Filters
                </Button>
            </div>
        </div>
    );
};
