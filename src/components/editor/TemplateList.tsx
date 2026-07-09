import { Input } from '@/components/common/Input';
import TemplateCard from '@/components/common/TemplateCard';
import { useState } from 'react';

type Props = {
    onSelect: (template: any) => void;
    data: any[];
};

const TemplateList = (props: Props) => {
    const { onSelect, data } = props;

    const [search, setSearch] = useState('');

    const handleSearch = (value: string) => {
        setSearch(value);
    };

    const filteredData = data.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='flex flex-col gap-4 w-full'>
            <Input
                placeholder='Search'
                name='search'
                onChange={handleSearch}
                value={search}
                inputType='search'
            />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full place-items-center'>
                {filteredData?.map(item => (
                    <TemplateCard
                        key={item.id}
                        component={item.component}
                        title={item.title}
                        count={10}
                        onClick={() => onSelect(item)}
                        thumbnail={item.thumbnail}
                    />
                ))}
            </div>
        </div>
    );
};

export default TemplateList;
