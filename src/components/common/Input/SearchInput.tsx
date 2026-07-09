import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { useDebouncedCallback } from 'use-debounce';

interface SearchInputProps {
    onSearch?: (value: string) => void;
    placeholder?: string;
    className?: string;
    value?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
    onSearch,
    placeholder = 'Search',
    className = 'w-full rounded-lg px-3 py-2 bg-[#F3F3F3] border-[1px] border-[#E0E0E0] h-[40px]',
    value = '',
}) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const debouncedSearch = useDebouncedCallback((val: string) => {
        if (onSearch) {
            onSearch(val);
        }
    }, 500);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        if (!newValue) {
            debouncedSearch.cancel();
            if (onSearch) onSearch('');
        } else {
            debouncedSearch(newValue);
        }
    };

    return (
        <Input
            placeholder={placeholder}
            onChange={handleChange}
            className={className}
            value={inputValue}
        />
    );
};

export default SearchInput;
