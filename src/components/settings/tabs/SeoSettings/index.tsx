import { Input } from '@/components/common/Input';
import { SeoSettingForm } from '@/constants/forms/settings';
import ActionFooter from '../partials/ActionFooter';
import { SeoSettings as SeoSettingsType } from '@/interface/settings';
import SettingsHeader from '../partials/SettingsHeader';
import { useSettingsForm2 } from '@/hooks/api-calls/useSettingsForm2';
import { useAppStore } from '@/store/useAppStore';
import { useQueryState } from 'nuqs';
import Button from '@/components/common/Buttons';

const SeoSettings = () => {
    const { form, handleSave, isModified, isLoading } = useSettingsForm2('seo');
    const { user } = useAppStore();
    const [modelType, setModelType] = useQueryState('model-type');
    // const isFreePlan = user?.current_plan_id === 'free_plan';
    const isFreePlan = false

    const formData = form.watch() as any;

    // Dummy data for free plan users (except meta_title and meta_description)
    const dummyData: Partial<SeoSettingsType> = {
        google_analytics_id: 'G-ABCD123456',
        google_adsense_publisher_id: 'ca-pub-9876543210987654',
        google_adsense_ads_txt: 'google.com, pub-9876543210987654, DIRECT, f08c47fec0942fa0\ngoogle.com, pub-9876543210987654, RESELLER, f08c47fec0942fa0',
        default_cookie_popup: true,
        privacy_policy_url: 'https://www.example.com/privacy-policy',
        hide_authors: false,
        hide_post_dates: false,
        hide_social_sharing_icons: false,
        hide_default_menu_items_in_footer: false,
        show_searchbar_on_homepage: true,
        send_email_upon_deploy: true,
        show_post_progress_bar_on_scroll: true,
        homepage_type: 'recent_posts',
        miscellaneous_scripts: '<script>\n  (function() {\n    console.log("Custom script loaded");\n    // Add your custom JavaScript here\n  })();\n</script>',
        head_scripts: '<script>\n  // Analytics or tracking scripts\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n</script>',
        custom_css: 'body {\n  font-family: "Inter", sans-serif;\n  color: #1a1a1a;\n  line-height: 1.6;\n}\n\n.header {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n}',
        custom_robots_txt: 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /private/\n\nSitemap: https://www.example.com/sitemap.xml',
    };

    const handleChange = (name: string, value: any) => {
        // Allow meta_title and meta_description to be changed even on free plan
        const allowedFieldsOnFreePlan = ['meta_title', 'meta_description'];
        if (isFreePlan && !allowedFieldsOnFreePlan.includes(name)) {
            return; // Prevent changes on free plan for other fields
        }
        console.log('DO NOT REMOVE THIS', formData, form.clearErrors());

        form.setValue(name as any, value);
    };

    const handleUpgrade = () => {
        setModelType('pricing');
    };

    console.log('FORM DATA', formData);

    return (
        <div className='h-full flex flex-col justify-between'>
            <div className='h-full flex flex-col hide-scrollbar'>
                <SettingsHeader
                    title='SEO Settings'
                    description='Configure SEO settings, analytics, and other advanced features for your blog'
                />

                <div className='py-3'>
                    {isFreePlan && (
                        <div className='mb-4 p-4 bg-[#e549001f] border border-[#e54a00] rounded-lg'>
                            <div className='flex items-center justify-between'>
                                <p className='text-[14px] text-[#333] font-medium'>
                                    Upgrade to access SEO settings
                                </p>
                                <Button
                                    type='primary'
                                    size='small'
                                    className='font-semibold px-2 py-1 !rounded-xl w-fit h-[28px] text-[12px]'
                                    onClick={handleUpgrade}
                                >
                                    Upgrade
                                </Button>
                            </div>
                        </div>
                    )}
                    {SeoSettingForm.map(field => {
                        const name = field?.name as keyof SeoSettingsType;
                        // Allow meta_title and meta_description to be editable on free plan
                        const allowedFieldsOnFreePlan = ['meta_title', 'meta_description'];
                        const isFieldDisabled = isFreePlan && !allowedFieldsOnFreePlan.includes(name as string);
                        
                        // Use dummy data for disabled fields on free plan, real data for allowed fields
                        const displayValue = isFreePlan && isFieldDisabled 
                            ? (dummyData[name] ?? formData[name])
                            : formData[name];
                        
                        return (
                            <div
                                key={name}
                                
                            >
                                <Input
                                    {...(field as any)}
                                    name={name}
                                    value={displayValue}
                                    onChange={(val: any) => handleChange(name, val)}
                                    error={(form?.formState?.errors as any)?.[name]?.message}
                                    disabled={isFieldDisabled}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            <ActionFooter
                disableButtons={!isModified}
                isSaving={isLoading}
                handleSave={handleSave}
            />
        </div>
    );
};

export default SeoSettings;
