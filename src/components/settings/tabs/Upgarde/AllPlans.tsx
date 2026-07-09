'use client';

import { Button } from 'antd';
import PlanInfo from './PlanInfo';
import { useQuery } from '@tanstack/react-query';
import { paddleApi } from '@/api/paddle.api';
import { Input } from '@/components/common/Input';
import { useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import {
    CheckoutEventNames,
    Environments,
    initializePaddle,
    Paddle,
    PaddleEventData,
} from '@paddle/paddle-js';
import Cookies from 'js-cookie';
import { queryClient, useSendData } from '@/config/query.config';
import { useAppStore } from '@/store/useAppStore';
import { apiGetUserDetails } from '@/api/auth';

const AllPlans = () => {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
    const [modelType, setModelType] = useQueryState('model-type');
    const [type, setType] = useQueryState('type');
    const pathname = usePathname();
    const isUpgradeRoute = pathname?.includes('/settings/upgrade');
    const { setUserData } = useAppStore();
    const {
        data: plans,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['plans', billingPeriod],
        queryFn: () => paddleApi.handleGetAllPlans(),
        enabled: modelType === 'pricing' || type === 'upgrade' || isUpgradeRoute,
    });

    const [paddleInstance, setPaddleInstance] = useState<Paddle | undefined>(undefined);

    useEffect(() => {
        initializePaddle({
            token: process.env.NEXT_PUBLIC_PADDLE_TOKEN,
            seller: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID as any,
            environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as Environments,
            eventCallback: async (event: PaddleEventData) => {
                const { name } = event;
                const transactionId: any = event.data?.transaction_id;
                const subscriptionId = Cookies.get('subscription_id');
                if (name === CheckoutEventNames.CHECKOUT_COMPLETED) {
                    await paddleApi
                        .handleCreateSubscription({
                            transaction_id: transactionId,
                            subscription_id: subscriptionId as string,
                        })
                        .then(async () => {
                            // Fetch updated user data and update store
                            try {
                                const userResponse = await apiGetUserDetails();
                                if (userResponse?.data) {
                                    setUserData(userResponse.data);
                                }
                            } catch (error) {
                                console.error('Error fetching updated user data:', error);
                            }
                        })
                        .finally(() => {
                            Cookies.remove('subscription_id');
                            queryClient.invalidateQueries({
                                queryKey: ['plans'],
                            });
                            queryClient.invalidateQueries({
                                queryKey: ['active_subscription'],
                            });
                        });
                }
            },
        })
            .then((paddleInstance: Paddle | undefined) => {
                console.log('paddleInstance', paddleInstance);
                setPaddleInstance(paddleInstance);
            })
            .catch(err => {
                console.log('initializePaddle error', err);
            });
    }, [type, modelType, isLoading]);

    const handleAttemptSubscription = async (data: {
        pricing_id: string;
        billing_period: 'monthly' | 'yearly';
    }) => {
        try {
            const attemptSubscriptionResponse = await paddleApi.handleAttemptSubscription(data);
            const { subscription_id } = attemptSubscriptionResponse;
            Cookies.set('subscription_id', subscription_id);
            console.log('paddleInstance', paddleInstance);
            if (paddleInstance) {
                paddleInstance?.Checkout.open({
                    items: [{ priceId: data.pricing_id }],
                    settings: {
                        displayMode: 'overlay',
                        theme: 'light',
                        locale: 'en',
                    },
                });
            }
            return attemptSubscriptionResponse;
        } catch (error) {
            console.log('handleAttemptSubscription error', error);
        }
    };

    const { mutate: handleUpgradePlan, isPending: isUpgradePlanPending } = useSendData({
        fn: handleAttemptSubscription,
        success: (data: any) => {
            toast.success('Subscription attempt successful');
            console.log('handleUpgradePlan success', data);
        },
        error: err => {
            toast.error('Subscription attempt failed');
            console.log('Subscription attempt failed', err);
        },
        invalidateKey: ['plans', 'active_subscription'],
    });

    if (isError) {
        return (
            <div className='flex justify-center items-center h-full'>
                <h1>{error?.message}</h1>
            </div>
        );
    }

    const isUpgradeable = (plan: Plan) => {
        return !plan.is_current_plan && plan.id !== 'free_plan';
    };

    const planKey =
        billingPeriod === 'monthly' ? 'monthly_pricing_details' : 'yearly_pricing_details';

    return (
        <div className='flex flex-col gap-3 w-full'>
            <div className='flex flex-row justify-between items-center'>
                <h2 className='text-[16px] font-[600] text-[#333]'>
                    {modelType === 'pricing' ? 'Upgrade Plan' : 'All Plans'}
                </h2>
                <div className='flex flex-row gap-2 items-center'>
                    <span className='text-[14px] font-[600] text-[#333]'>Monthly</span>
                    <Input
                        name='billing-period'
                        inputType='switch'
                        onChange={() => {
                            setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly');
                        }}
                        value={billingPeriod === 'yearly'}
                    />
                    <span className='text-[14px] font-[600] text-[#333]'>Yearly</span>
                </div>
            </div>

            {isLoading ? (
                <div className='border border-[#E0E0E0] rounded-[10px] bg-white p-5'>
                    {/* Desktop skeleton */}
                    <div className='hidden md:grid grid-cols-5 gap-6'>
                        <div />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className='flex flex-col gap-3'>
                                <div className='h-6 w-24 rounded-md bg-gray-200 animate-pulse' />
                                <div className='h-4 w-full rounded bg-gray-100 animate-pulse' />
                                <div className='h-9 w-[120px] rounded-md bg-gray-200 animate-pulse' />
                            </div>
                        ))}
                    </div>
                    <div className='hidden md:flex flex-col gap-3 mt-8'>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className='grid grid-cols-5 gap-6 items-center'>
                                <div className='h-4 w-32 rounded bg-gray-100 animate-pulse' />
                                {Array.from({ length: 4 }).map((__, j) => (
                                    <div key={j} className='h-4 w-16 rounded bg-gray-100 animate-pulse' />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Mobile skeleton */}
                    <div className='flex flex-col md:hidden gap-4'>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className='flex flex-col gap-3 p-5 border border-[#E0E0E0] rounded-2xl'>
                                <div className='h-5 w-28 rounded-md bg-gray-200 animate-pulse' />
                                <div className='h-7 w-24 rounded-md bg-gray-200 animate-pulse' />
                                <div className='h-9 w-full rounded-md bg-gray-100 animate-pulse' />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='border border-[#E0E0E0] rounded-[10px] bg-white'>
                    {/* Desktop Pricing Grid */}
                    <div className='hidden md:grid grid-cols-5 gap-6 p-5'>
                        <div className='flex flex-col gap-3' />
                        {plans?.[planKey]?.map((plan: Plan) => (
                            <div key={plan.name} className='flex flex-col gap-3'>
                                <div className='flex items-center gap-2'>
                                    <h3 className='text-[20px] font-[700] text-[#000]'>
                                        {plan.name}
                                    </h3>
                                </div>

                                <div className='flex flex-col justify-center items-start gap-2'>
                                    <div className='flex items-baseline gap-1 w-[90%]'>
                                        <span className='text-[14px] font-[600] text-[#333]'>
                                            $
                                            {billingPeriod === 'monthly'
                                                ? plan.price
                                                : plan?.price
                                                ? plan.price / 12
                                                : 0}
                                        </span>
                                        <span className='text-[#8F8F8F] text-sm'>
                                            per month billed annually
                                        </span>
                                    </div>
                                </div>

                                {plan.is_current_plan ? (
                                    <Button
                                        id={plan.id}
                                        disabled
                                        className='w-[120px] bg-[#F5F5F5] text-[#8F8F8F]'
                                    >
                                        Active Plan
                                    </Button>
                                ) : (
                                    isUpgradeable(plan) && (
                                        <Button
                                            id={plan.id}
                                            disabled={isUpgradePlanPending}
                                            type='primary'
                                            className='w-[120px]'
                                            onClick={() =>
                                                handleUpgradePlan({
                                                    pricing_id: plan.id || '',
                                                    billing_period: billingPeriod,
                                                })
                                            }
                                        >
                                            Upgrade
                                        </Button>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                    <div className='hidden md:block'>
                        <PlanInfo plans={plans?.[planKey] || []} />
                    </div>

                    {/* Mobile Pricing List */}
                    <div className='flex flex-col md:hidden gap-4 p-4'>
                        {plans?.[planKey]?.map((plan: Plan) => (
                            <div key={plan.name} className='flex flex-col gap-4 p-5 bg-white border border-[#E0E0E0] rounded-2xl shadow-sm'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-[18px] font-bold text-black'>
                                        {plan.name}
                                    </h3>
                                    {plan.is_current_plan && (
                                        <span className='px-2.5 py-1 bg-green-50 text-green-600 font-semibold text-xs rounded-lg'>
                                            Current
                                        </span>
                                    )}
                                </div>

                                <div className='flex flex-col justify-center items-start gap-1'>
                                    <div className='flex items-baseline gap-1'>
                                        <span className='text-[24px] font-bold text-[#FF5200]'>
                                            $
                                            {billingPeriod === 'monthly'
                                                ? plan.price
                                                : plan?.price
                                                ? plan.price / 12
                                                : 0}
                                        </span>
                                        <span className='text-[#8F8F8F] text-xs'>
                                            / month billed {billingPeriod}
                                        </span>
                                    </div>
                                </div>

                                {plan.is_current_plan ? (
                                    <Button
                                        id={plan.id}
                                        disabled
                                        className='w-full bg-[#F5F5F5] text-[#8F8F8F]'
                                    >
                                        Active Plan
                                    </Button>
                                ) : (
                                    isUpgradeable(plan) && (
                                        <Button
                                            id={plan.id}
                                            disabled={isUpgradePlanPending}
                                            type='primary'
                                            className='w-full'
                                            onClick={() =>
                                                handleUpgradePlan({
                                                    pricing_id: plan.id || '',
                                                    billing_period: billingPeriod,
                                                })
                                            }
                                        >
                                            Upgrade
                                        </Button>
                                    )
                                )}

                                {/* Features List */}
                                <div className='border-t border-gray-100 pt-4 mt-2'>
                                    <h4 className='text-xs font-bold text-gray-800 mb-2 uppercase tracking-wider'>Highlights</h4>
                                    <div className='flex flex-col gap-2'>
                                        {Array.isArray(plan?.features) &&
                                            plan?.features?.map((feature, index) => (
                                                <div key={index} className='flex items-start gap-2'>
                                                    <span className='text-[#FF5200] shrink-0 text-sm'>•</span>
                                                    <p className='text-xs font-medium text-[#5D5D5D] leading-relaxed'>
                                                        {feature}
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllPlans;
