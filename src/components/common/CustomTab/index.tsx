import { cn } from '@/utils/cn';
import { Tabs } from 'antd';
interface CustomTabProps {
    tabs: {
        key: string;
        label: string;
        content?: React.ReactNode;
        icon?: React.ReactNode;
    }[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    className?: string;
}
const CustomTab = ({ tabs, activeTab, setActiveTab, className }: CustomTabProps) => {
    return (
        <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabs.map(tab => ({
                key: tab.key,
                label: tab.label,
                icon: tab.icon,

                children: tab.content ? (
                    <div className='p-2 px-0 min-h-[400px]'>{tab.content}</div>
                ) : null,
            }))}
            className={cn(
                `[&_.ant-tabs-tab]:text-[#5d5d5d] [&_.ant-tabs-tab]:!text-[15px]
                [&_.ant-tabs-tab:hover]:text-[#333]
                [&_.ant-tabs-tab.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-[#333]
                [&_.ant-tabs-ink-bar]:bg-[#333] [&_.ant-tabs-ink-bar]:rounded-t-[4px] [&_.ant-tabs-ink-bar]:!w-[150px] [&_.ant-tabs-ink-bar]:!h-[4px]
                [&_.ant-tabs-nav]:bg-white
                [&_.ant-tabs-tab]:focus:!text-[#333] [&_.ant-tabs-tab]:focus:font-semibold [&_.ant-tabs-tab]:focus:text-[14px]
                [&_.ant-tabs-tab-btn]:focus:!text-[#333] [&_.ant-tabs-tab-btn]:active:!text-[#333] [&_.ant-tabs-tab-btn]:[&:focus,:active]:font-semibold [&_.ant-tabs-tab-btn]:[&:focus,:active]:text-[14px]
                [&_.ant-tabs-tab-btn]:!text-inherit [&_.ant-tabs-tab-btn]:flex [&_.ant-tabs-tab-btn]:items-center`,
                className
            )}
        />
    );
};

export default CustomTab;
