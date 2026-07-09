'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import OnboardingSpotlight from './OnboardingSpotlight';
import OnboardingTooltip from './OnboardingTooltip';
import { waitForElement, scrollToElement, dataTourSelector } from '@/utils/onboarding.utils';

/**
 * Dashboard Onboarding Layer (Step 1).
 * Highlights the "Create New Blog" button and waits for user to click it.
 * Mounts on /admin/blogs — isolated from app logic.
 */
export default function DashboardOnboarding() {
    const { isActive, phase, completeOnboarding, setPhase } = useOnboardingStore();
    const hasSetup = useRef(false);

    const [isButtonReady, setIsButtonReady] = React.useState(false);

    const isDashboardPhase = isActive && phase === 'dashboard';

    const setup = useCallback(async () => {
        if (hasSetup.current) return;
        hasSetup.current = true;

        // Wait for the Create New Blog button to appear
        const el = await waitForElement(dataTourSelector('create-blog-btn'), {
            timeout: 15000,
            interval: 200,
        });

        if (!el) return;

        // Button is ready, now we can render the spotlight and tooltip
        setIsButtonReady(true);

        // Scroll it into view
        await scrollToElement(el, { behavior: 'smooth', block: 'center' });
    }, []);

    useEffect(() => {
        if (!isDashboardPhase) {
            hasSetup.current = false;
            setIsButtonReady(false);
            return;
        }
        setup();
    }, [isDashboardPhase, setup]);

    if (!isDashboardPhase || !isButtonReady) return null;

    return (
        <>
            <OnboardingSpotlight
                active={isDashboardPhase}
                targetSelector={dataTourSelector('create-blog-btn')}
                padding={10}
            />
            <OnboardingTooltip
                active={isDashboardPhase}
                targetSelector={dataTourSelector('create-blog-btn')}
                placement="auto"
                content={{
                    title: 'Create Your First Blog',
                    description:
                        'Click the button to create your first AI-powered blog. We\'ll walk you through the entire process.',
                    icon: 'sparkles',
                    showSkip: true,
                    onSkip: completeOnboarding,
                }}
            />
        </>
    );
}
