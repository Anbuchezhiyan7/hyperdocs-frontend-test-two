import { useEffect, useState } from 'react';
import { PlusIcon } from '@/assets/icons';
import { useQueryState } from 'nuqs';

import AntTabs from '@/components/common/AntTabs';
import DraggableTable from './table/DraggableTable';
import SettingsHeader from '../partials/SettingsHeader';
import Button from '@/components/common/Buttons';
import { useSettingsForm } from '@/hooks/api-calls/useSettingsForm';
import { Tooltip } from 'antd';
import NavigationExtraSettings from './NavigationExtraSettings';

const TABS = [
    {
        key: 'navigation',
        label: 'Navigation',
        children: (
            <div className='flex flex-col'>
                <DraggableTable key='navigation' type='navigation' />
                <NavigationExtraSettings />
            </div>
        ),
    },
    {
        key: 'footer',
        label: 'Footer',
        children: <DraggableTable key='footer' type='footer' />,
    },
];

const NavigationAndFooter = () => {
    const [, setParamMode] = useQueryState('mode');
    const [, setParamMenuId] = useQueryState('menu_id');
    const [activeTab, setActiveTab] = useState('navigation');

    const { formData } = useSettingsForm('navigation_footer');

    useEffect(() => {
        setParamMode(null);
        setParamMenuId(null);
    }, []);

    const disableAddButton =
        activeTab === 'navigation'
            ? formData?.navigation?.length >= 5
            : formData?.footer?.length >= 5;

    const extraTabContent = (
        <Tooltip title={disableAddButton ? 'You can only add up to 5 menu items' : ''}>
            <Button
                disabled={disableAddButton}
                variant='text'
                className='ml-4 flex cursor-pointer items-center border-none gap-2 text-[#5D5D5D] hover:text-[#333]'
                onClick={() => setParamMode(activeTab)}
            >
                <PlusIcon/>
                <span>{activeTab === 'navigation' ? 'Add Menu Item' : 'Add Footer Section'}</span>
            </Button>
        </Tooltip>
    );

    return (
        <div className='h-full overflow-y-scroll hide-scrollbar'>
            <SettingsHeader
                title='Navigation & Footer'
                description='Customize your header and footer menus for a better browsing experience'
            />
            <div className='relative z-10'>
                <AntTabs items={TABS} extraContent={extraTabContent} onChange={setActiveTab} />
            </div>
        </div>
    );
};

export default NavigationAndFooter;
