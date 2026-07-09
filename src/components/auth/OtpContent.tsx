'use client';

import React, { useEffect, useState } from 'react';
import { HyperblogLogo } from '@/assets/icons';
import { Button, Input } from 'antd';
import { apiResendOtp, apiVerifyOtp } from '@/api/auth';
import { showToast } from '../common/Toast';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import OtpTimer from './Timer';
import { useQueryState } from 'nuqs';

const OtpContent = () => {
    const router = useRouter();
    const { user, setUserData } = useAppStore();
    const [email, setEmailState] = useState(user?.email || '');

    useEffect(() => {
        if (typeof window !== 'undefined' && !email) {
            const savedEmail = localStorage.getItem('otp_email');
            if (savedEmail) setEmailState(savedEmail);
        }
    }, [email]);

    const [paramMode, setParamMode] = useQueryState('mode');
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(() => {
        const expiry = localStorage.getItem('otp_expiry');
        if (expiry) {
            const remaining = Math.max(0, Math.floor((Number(expiry) - Date.now()) / 1000));
            return remaining;
        }
        return 300;
    });

    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isInvalidOTP, setIsInvalidOTP] = useState(false);

    const handleWrongEmail = () => {
        localStorage.removeItem('otp_expiry');
        localStorage.removeItem('otp_email');
        setParamMode(null);
    };

    const hanldeResendOtp = async () => {
        setIsResending(true);
        const res = await apiResendOtp(email);
        if (res.success) {
            const newExpiry = Date.now() + 300 * 1000;
            localStorage.setItem('otp_expiry', newExpiry.toString());
            setTimer(300);
        }
        showToast(res?.message, res.type);
        setIsResending(false);
    };

    const handleVerifyOTP = async () => {
        setIsVerifying(true);
        const { type, success, data, message } = await apiVerifyOtp(email, otp);
        if (success) {
            setUserData({ ...user, ...data });
            if (data?.is_new_user) {
                router.push('/site-details');
            } else {
                router.push('/admin/blogs');
            }
        } else {
            setOtp('');
            setIsInvalidOTP(true);
            setIsVerifying(false);
            showToast(message, type);
        }
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
        if (isInvalidOTP) setIsInvalidOTP(false);
    };

    return (
        <div className='p-8 flex flex-col justify-between min-h-[450px] gap-6'>
            <div className='flex flex-col gap-4'>
                <HyperblogLogo className='w-[180px] ml-[-1rem]' />
                <h2 className='text-[20px] font-[700] text-[#333]'>Verify OTP</h2>
                <p className='text-sm text-[#8F8F8F]'>
                    We've sent a 6 digit OTP to <strong>{email}</strong>{' '}
                    <span
                        className='text-[#333] font-semibold cursor-pointer underline ml-1'
                        onClick={handleWrongEmail}
                    >
                        Wrong email?
                    </span>
                </p>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-[#333]'>OTP</label>
                        <Input
                            type='password'
                            placeholder='Enter OTP here'
                            className='h-[48px]'
                            maxLength={6}
                            value={otp}
                            onChange={handleOtpChange}
                        />
                    </div>

                    <div className='flex justify-between items-center'>
                        <OtpTimer setHeadTimer={setTimer} headTimer={timer} />
                        <Button
                            onClick={hanldeResendOtp}
                            type='link'
                            className='!text-sm !font-medium !text-gray-700 !p-0 !underline flex items-center gap-1'
                            loading={isResending}
                            disabled={timer > 0}
                        >
                            Resend OTP
                        </Button>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-10'>
                {isInvalidOTP && (
                    <p className='text-sm font-medium text-[#DC3545] bg-[#FDF2F3] p-2 rounded-[10px]'>
                        Please enter valid OTP
                    </p>
                )}
                <Button
                    type='primary'
                    className='w-full h-[40px] !text-[16px]'
                    onClick={handleVerifyOTP}
                    loading={isVerifying}
                    disabled={!otp || otp.length < 6}
                >
                    Verify
                </Button>
            </div>
        </div>
    );
};

export default OtpContent;
