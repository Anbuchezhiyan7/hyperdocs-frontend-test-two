'use client';

import { apiConnectdomain, apiUpdateSetting } from '@/api/settings';
import { HyperblogLogo } from '@/assets/icons';
import { DOMAIN_URL } from '@/constants/definitions';
import { useAppStore } from '@/store/useAppStore';
import { getLocalUTC } from '@/utils/time';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '../common/Input';
import Urls from '../settings/tabs/Domain/Urls';
import { getCookie } from '@/utils/cookie';

// Utility function to convert site name to URL-friendly format
const convertToUrlFriendly = (siteName: string): string => {
    return siteName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

const SiteDetailsContent = () => {
    const router = useRouter();
    const { user, setUserData } = useAppStore();
    const [siteDetails, setSiteDetails] = useState({
        site_name: '',
        site_address: '',
    });
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');
    const username = getCookie('username');
    console.log(username,'username from cookie');
    // alert(username);

    const [isVerifying, setIsVerifying] = useState<string | null>(null);
    const [isInvalidUrl, setIsInvalidUrl] = useState(false);
    // alert(2);

    const handleVerifySiteDetails = async (isSkip?: boolean) => {
        setIsVerifying(isSkip ? 'skip' : 'continue');
        const timezone = getLocalUTC();
        try {
            const [settingsResponse, domainResponse] = await Promise.all([
                apiUpdateSetting('general', {
                    organization_name: username,
                    time_zone: timezone,
                    accent_color: '#000000',
                    is_new_user: true,
                    show_hyperblog_branding: true,
                    show_description: true,
                    description:
                        'A personal space to share thoughts, ideas, and insights through writing. Explore articles created to inform, express, and inspire.',
                }),
                apiUpdateSetting('seo', {
                    meta_title: 'Blog Articles & Insights | Hyperblog',
                    meta_description:
                        'Explore a collection of blog posts covering ideas, insights, and experiences. Discover articles written to inform, share, and inspire.',
                }),
                apiConnectdomain(
                    {
                        default:
                            siteDetails?.site_address?.toLowerCase().trim().replace(/\s+/g, '') +
                            '.' +
                            DOMAIN_URL,
                        site_name: siteDetails?.site_name,
                    },
                    isSkip
                ),
            ]);

            setUserData({ ...user, ...domainResponse.data });
            router.push('/admin/blogs', { scroll: false });
        } catch (err: any) {
            if (err.status === 400) {
                setIsInvalidUrl(true);
                setError(err.message);
            }
        } finally {
            setIsVerifying(null);
        }
    };

    const handleSiteValue = (key: string, value: any) => {
        // Auto-fill site address when site name changes
        if (key === 'site_name') {
            if (value) {
                const urlFriendlyName = convertToUrlFriendly(value);
                setSiteDetails(prev => ({
                    ...prev,
                    site_name: value,
                    site_address: urlFriendlyName,
                }));
            } else {
                // Clear both site name and site address when site name is cleared
                setSiteDetails(prev => ({
                    ...prev,
                    site_name: value,
                    site_address: '',
                }));
            }
        } else if (key === 'site_address') {
            // Replace spaces with hyphens when user types in site address
            const formattedValue = value.replace(/\s+/g, '-');
            setSiteDetails(prev => ({
                ...prev,
                [key]: formattedValue,
                site_name: formattedValue, // Sync site_name with site_address
            }));
        } else {
            setSiteDetails(prev => ({
                ...prev,
                [key]: value,
            }));
        }

        if (isInvalidUrl) setIsInvalidUrl(false);
    };

    const disableContinueButton = !siteDetails?.site_name || !siteDetails?.site_address;

    return (
        <div className="p-8 flex flex-col justify-between min-h-[350px] gap-6">
            <div className="flex flex-col gap-4">
                <HyperblogLogo className="w-[180px] ml-[-1rem]" />
                <h2 className="text-[20px] font-[700] text-[#333]">
                    Claim Your Hyperblog Identity
                </h2>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        {/* <Input
                            inputType="text"
                            placeholder="Enter your site name"
                            inputClassName="!h-[45px]"
                            label="Site Name"
                            name="site_name"
                            onChange={value => handleSiteValue('site_name', value)}
                            description="This is the name of your blog, brand, or product — feel free to update it anytime."
                        /> */}
                        <Urls
                            label="Site Address"
                            hideAddonBefore={true}
                            hideConnectButton
                            value={siteDetails?.site_address || ''}
                            onChange={value =>
                                handleSiteValue('site_address', value?.toLowerCase())
                            }
                            hideAddonAfter={false}
                            addonAfter=".hyperblog.cloud"
                            labelClassName="!mb-0 !font-normal !text-[14px] !text-black !p-0"
                            description={
                                <>
                                    This will be your permanent Hyperblog URL. Choose wisely — it
                                    can't be changed later. <br /> Don't worry, you can always
                                   <b className='text-black'> connect your own custom domain later.</b>{' '}
                                </>
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-10">
                <Button
                    type="primary"
                    className="w-full h-[40px] !text-[16px]"
                    onClick={() => handleVerifySiteDetails()}
                    loading={isVerifying === 'continue'}
                    disabled={disableContinueButton}
                >
                    Continue
                </Button>
                {/* <Button
                    type="text"
                    className="!p-0 !text-[14px] !h-fit !w-fit hover:!bg-transparent hover:!text-primary"
                    onClick={() => handleVerifySiteDetails(true)}
                    loading={isVerifying === 'skip'}
                >
                    Skip this for now
                </Button> */}
                {isInvalidUrl && (
                    <p className="text-sm font-medium text-[#DC3545] bg-[#FDF2F3] p-2 rounded-[10px]">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export default SiteDetailsContent;
