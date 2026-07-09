import { Switch } from 'antd';
import { Input } from '@/components/common/Input';
import timezones from '@/constants/common/timezones.json';
import { useAppStore } from '@/store/useAppStore';
import { useQueryState } from 'nuqs';

interface SettingItem {
    id: string;
    title: string;
    type: 'timezone' | 'switch';
    defaultChecked?: boolean;
    required?: boolean;
}

const settingsData: SettingItem[] = [
    {
        id: 'time_zone',
        title: 'Select Timezone',
        type: 'timezone',
        required: true,
    },
    {
        id: 'show_description',
        title: 'Show Description',
        type: 'switch',
        required: false,
    },
    {
        id: 'show_hyperblog_branding',
        title: 'Remove Hyperblog branding',
        type: 'switch',
        required: false,
    },
];

type SettingsProps = {
    data: any;
    handleChange: (key: string, value: any) => void;
    errors: any;
};

const Settings = ({ data, handleChange, errors }: SettingsProps) => {

      const { user } = useAppStore();
    const isFreePlan = user?.current_plan_id === 'free_plan';
       const [modelType, setModelType] = useQueryState('model-type');
    const handleUpgrade = () => {
        setModelType('pricing');
    };

    const handleSwitchChange = (id: string, checked: boolean) => {
        if (id === 'show_hyperblog_branding') {
            if (checked && isFreePlan) {
                handleUpgrade();
                return;
            }
            handleChange(id, !checked);
            return;
        }
        handleChange(id, checked);
    };

    const renderSettingItem = (item: (typeof settingsData)[0], index: number) => {
        return (
            <div key={index} className='flex justify-between items-center gap-3'>
                <div className='flex flex-col gap-2'>
                    <h3 className='text-sm font-medium text-[#333] m-0'>
                        {item?.title}

                        {item?.required && <span className='text-red-500 ml-1'>*</span>}
                    </h3>
                    {item?.id === 'show_hyperblog_branding' && (
                        <p className='text-xs font-medium text-[#8F8F8F] m-0'>
                            Upgrade to remove logo
                        </p>
                    )}
                </div>
                {item?.type === 'timezone' ? (
                    <Input
                        name={item?.id}
                        value={data?.[item?.id] || ''}
                        inputType='select'
                        options={timezones as any}
                        onChange={value => handleChange(item?.id, value)}
                        className='min-w-[150px] !w-auto'
                    />
                ) : (
                    <Switch
                        checked={item?.id === 'show_hyperblog_branding' ? !data?.[item?.id] : !!data?.[item?.id]}
                        onChange={checked => handleSwitchChange(item?.id, checked)}
                        className='bg-[#8F8F8F]'
                    />
                )}
            </div>
        );
    };    
    return (
        <div className='flex flex-col gap-4'>
            {settingsData.map((item, index) => (
                <div key={index} className='flex flex-col gap-3'>
                    {renderSettingItem(item, index)}
                    {errors?.[item?.id]?.message && (
                        <p className='text-xs text-error'>{errors?.[item?.id]?.message}</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Settings;
