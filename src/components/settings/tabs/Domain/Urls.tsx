import React from 'react';
import { Input, Button } from 'antd';
import { DOMAIN_URL } from '@/constants/definitions';
interface UrlsProps {
    addonBefore?: string;
    hideConnectButton?: boolean;
    hideLabel?: boolean;
    value?: string;
    onChange?: (value: string) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
    loading?: boolean;
    disabled?: boolean;
    isConnected?: boolean;
    addonAfter?: string;
    description?: any;
    labelClassName?: string;
    hideAddonBefore?: boolean;
    hideAddonAfter?: boolean;
    label?: string;
    buttonText?: string;
    buttonClassName?: string;
    buttonIcon?: React.ReactNode;
    error?: string;
    placeholder?: string;
}

const Urls: React.FC<UrlsProps> = ({
    addonBefore = 'https://',
    hideConnectButton = false,
    hideLabel = false,
    hideAddonBefore = false,
    hideAddonAfter = true,
    value,
    onChange,
    onConnect,
    onDisconnect,
    loading = false,
    disabled = false,
    isConnected = false,
    addonAfter,
    description,
    labelClassName,
    label,
    buttonText,
    buttonClassName,
    buttonIcon,
    error,
    placeholder,
}) => {
    const isSubdomain = addonBefore === `https://${DOMAIN_URL}/`;

    return (
        <div className='flex flex-col w-full gap-2'>
            {!hideLabel && (
                <p className={`text-[14px] font-[700] text-[#8F8F8F] ${labelClassName}`}>
                    {label || 'URL'}
                </p>
            )}
            <div className='flex flex-row gap-2'>
                <Input
                    rootClassName='hover:!border-stroke border w-full text-xs h-fit focus:!border-b-[2px] !bg-background-input focus:border-r-[2px] focus:!border-black focus:bg-input-background border-stroke'
                    value={value}
                    disabled={disabled || loading}
                    addonBefore={
                        !hideAddonBefore && (
                            <span className=' text-[#333333] px-3 rounded-l-lg  border-[#E5E5E5] '>
                                {isSubdomain ? 'https://' : addonBefore}
                            </span>
                        )
                    }
                    addonAfter={
                        !hideAddonAfter && addonAfter && (
                            <span className=' text-[#333333] px-3 rounded-r-lg  border-[#E5E5E5] '>
                                {addonAfter}
                            </span>
                        )
                    }
                    className='rounded-lg [&>input]:bg-[#F3F3F3] [&>input]:text-[#8F8F8F] [&_.ant-input-group-addon]:bg-white'
                    placeholder={placeholder || 'Paste or type here'}
                    onChange={e => onChange?.(e.target.value)}
                />

                {!hideConnectButton && (
                    <Button
                        type='primary'
                        className={`rounded-lg ${buttonClassName}`}
                        onClick={isConnected ? onDisconnect : onConnect}
                        loading={loading}
                        disabled={loading}
                        icon={buttonIcon}
                    >
                        {buttonText || (isConnected ? 'Disconnect' : 'Connect')}
                    </Button>
                )}
            </div>
            {description && <p className='text-xs text-gray-500'>{description}</p>}
            {error && <p className='text-xs text-red-500'>{error}</p>}
        </div>
    );
};

export default Urls;
