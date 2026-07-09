import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (value: string) => void;
    value?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, value }) => {
    return (
        <div className='relative w-full max-w-xs'>
            <input
                value={value}
                type='text'
                placeholder='Search articles'
                className='w-full py-2 pl-3 pr-10 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary'
                onChange={e => onSearch(e.target.value)}
            />
            <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <Search className='h-4 w-4 text-textTertiary' />
            </div>
        </div>
    );
};

export default SearchBar;
