'use client';

import { Button } from 'antd';
import { Facebook, Xicon, Watsapp, Message, LinkedIn, CopyIcon } from '@/assets/icons';
import Urls from '@/components/settings/tabs/Domain/Urls';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

const ConfirmContent = ({ publishedURL }: { publishedURL: string }) => {
    const { blog, settings } = useAppStore();
    const fullURL = `https://${publishedURL}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(fullURL);
        toast.success('Copied to clipboard');
    };

    const handleSocialShare = (platform: string) => {
        const encodedURL = encodeURIComponent(fullURL);
        
        let shareURL = '';
        
        switch (platform) {
            case 'linkedin':
                shareURL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`;
                break;
            case 'whatsapp':
                shareURL = `https://wa.me/?text=${encodedURL}`;
                break;
            case 'facebook':
                shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`;
                break;
            case 'twitter':
                shareURL = `https://twitter.com/intent/tweet?url=${encodedURL}`;
                break;
            case 'email':
                shareURL = `mailto:?body=${encodedURL}`;
                break;
            default:
                return;
        }
        
        window.open(shareURL, '_blank', 'width=600,height=400');
    };

    const socialPlatforms = [
        { icon: LinkedIn, platform: 'linkedin' },
        { icon: Watsapp, platform: 'whatsapp' },
        { icon: Facebook, platform: 'facebook' },
        { icon: Xicon, platform: 'twitter' },
        { icon: Message, platform: 'email' }
    ];

    return (
        <div className='flex flex-col gap-[12px] items-center px-6 '>
            {/* <p className='text-[14px] font-[500] text-start w-full text-[#8F8F8F]'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            </p> */}
            <div className='w-full flex'>
                <Urls
                    hideLabel
                    value={publishedURL}
                    buttonText='Copy'
                    buttonIcon={<CopyIcon />}
                    buttonClassName='!bg-white !text-black border border-[#E0E0E0]'
                    onConnect={handleCopy}
                />
            </div>
            <div className='w-full flex flex-col gap-[18px]'>
                <p className='text-[14px] font-[600] text-[#333] text-start w-full'>
                    Share the blog on
                </p>
                <div className='flex items-center gap-[24px]'>
                    {socialPlatforms.map(({ icon: Icon, platform }, index) => (
                        <Button
                            key={index}
                            className='rounded-[10px]'
                            icon={<Icon className='h-6 w-6' />}
                            onClick={() => handleSocialShare(platform)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ConfirmContent;
