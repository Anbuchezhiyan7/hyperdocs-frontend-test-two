import { useState } from 'react';
import { HyperblogLogo, GoogleIcon } from '@/assets/icons';
import { useAuth } from '@/providers/auth.provider';

import { useQueryState } from 'nuqs';
import { apiEmailLogin } from '@/api/auth';
import { Input } from '../common/Input';
import { isValidEmail } from '@/utils/validate';
import { showToast } from '../common/Toast';
import { useAppStore } from '@/store/useAppStore';
import { setCookie } from '@/utils/cookie';
import Button from '../common/Buttons';

const LoginContent = () => {
    const { setUserData } = useAppStore();
    const { isLoading, loginWithGoogle } = useAuth();

    const [_, setParamMode] = useQueryState('mode');
    const [email, setEmail] = useState('');
    const [isContinuing, setIsContinuing] = useState(false);

    const handleContinue = async () => {
        setIsContinuing(true);
        const response = await apiEmailLogin(email);
        const { message, type, success, data } = response;
        if (success) {
            localStorage.setItem('otp_email', email);
            localStorage.setItem('otp_expiry', (Date.now() + 300 * 1000).toString());
            setParamMode('verify-otp');
            setCookie('user', JSON.stringify(data), { expires: 30 });
            setUserData(data);
        }
        showToast(message, type);
        setIsContinuing(false);
    };

    return (
        <div className='p-8 flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
                <HyperblogLogo className='w-[180px] ml-[-1rem]' />
                <div className='flex flex-col gap-1'>
                    <h1 className='text-[24px] font-bold text-[#1A1A1A] tracking-tight'>
                        From Writing to Leads.
                    </h1>
                    <p className='text-[16px] font-medium text-[#666] leading-relaxed whitespace-normal md:whitespace-nowrap'>
                        Write, optimize, publish, convert <br className='md:hidden' />— <span className='text-[#E27951] font-bold'>all in one place.</span>
                    </p>
                </div>
            </div>

            <div className='flex flex-col gap-6'>
                <Button
                    className='w-full h-[48px] flex items-center justify-center gap-2 !text-base'
                    icon={<GoogleIcon />}
                    disabled={isContinuing}
                    loading={isLoading}
                    onClick={loginWithGoogle}
                >
                    Sign In With Google
                </Button>

                <div className='flex items-center gap-4'>
                    <div className='h-[1px] flex-1 bg-[#E6E6E6]' />
                    <span className='text-[#5D5D5D] text-base font-semibold'>or</span>
                    <div className='h-[1px] flex-1 bg-[#E6E6E6]' />
                </div>

                <div className='flex flex-col gap-2'>
                    <Input
                        name='email'
                        inputType='email'
                        label='Email ID'
                        placeholder='Enter email ID'
                        inputClassName='h-[48px] text-base'
                        value={email}
                        onChange={value => setEmail(value)}
                    />
                    <p className='text-sm font-medium text-[#8F8F8F]'>
                        We recommend using <span className='text-[#5D5D5D]'>Work Email</span> - It
                        keeps work & life separate
                    </p>
                </div>

                <Button
                    onClick={handleContinue}
                    disabled={!isValidEmail(email) || isLoading}
                    loading={isContinuing}
                    type='primary'
                    className='w-full h-[40px] !text-base'
                >
                    Continue
                </Button>
            </div>

            <p className='text-sm font-medium text-[#8F8F8F]'>
                Your name and photo are displayed to users who invite you to a workspace using your
                email. By continuing, you acknowledge that you understand and agree to the{' '}
                <span className='text-[#5D5D5D] cursor-pointer hover:underline'>
                    Terms & Conditions
                </span>{' '}
                and{' '}
                <span className='text-[#5D5D5D] cursor-pointer hover:underline'>
                    Privacy Policy
                </span>
            </p>
        </div>
    );
};

export default LoginContent;
