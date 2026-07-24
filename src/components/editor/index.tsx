'use client';

import { useQuery } from '@tanstack/react-query';
import { subscriptionApi } from '@/api/subscription.api';
import { PlateEditor } from './PlateEditor';
import { useParams } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

import {
    PostInfoModal,
    SEOScoreModal,
    CanonicalModal,
    CustomSlugModal,
    FeaturedImageModal,
    JSModal,
    LeadMagnetModal,
    MetaDataModal,
    SchemaMarkupModal,
    ScheduleBlogModal,
    LeadMagnetAIModal,
} from './modals';
import CreditsIndicator from '../common/CreditsIndicator';
import SettingsModal from '../settings';
import { useQueryState } from 'nuqs';
import { MediaInsertDialog } from '../plate-ui/media-insert-dialog';
import { EditorOnboarding } from '@/components/onboarding';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useEffect } from 'react';
import SuggestionsPanel from './SuggestionsPanel';

export default function EditorComponent () {
    const { data: activeSubscription } = useQuery({
        queryKey: ['active_subscription'],
        queryFn: () => subscriptionApi.handleGetActiveSubscription(),
    });

    const [modelType, setModelType] = useQueryState('model-type');
    const blogId = useParams().id;
    const { blog, setBlog } = useAppStore();

    // ── Onboarding: transition to editor-intro when we land on this page ──────
    const { isActive, phase, setPhase, setCurrentBlogId } = useOnboardingStore();
    useEffect(() => {
        if (isActive && phase === 'dashboard') {
            // We've navigated from blogs to editor — advance phase
            setPhase('editor-intro');
            if (blogId) setCurrentBlogId(blogId as string);
        }
    }, [isActive, phase, blogId, setPhase, setCurrentBlogId]);
    // ───────────────────────────────────────────────────────────

    const [mediaType, setMediaType] = useQueryState('media-type');

    return (
        <div className="relative">
            <div className="h-screen overflow-hidden flex flex-col">
                <PlateEditor />
            </div>
            
            <PostInfoModal />
            <SEOScoreModal />
            <ScheduleBlogModal />
            <LeadMagnetModal />
            <LeadMagnetAIModal />
            <SettingsModal isOpen={modelType === 'settings'} onClose={() => setModelType(null)} />
            <MediaInsertDialog
                open={modelType === 'media-insert'}
                onOpenChange={open => {
                    if (!open) {
                        setModelType(null);
                        setMediaType(null);
                    }
                }}
                type={(mediaType as 'image' | 'embed') || 'image'}
            />

            {/* Post Info Modals */}
            <MetaDataModal />
            <CustomSlugModal />
            <FeaturedImageModal />
            <SchemaMarkupModal />
            <CanonicalModal />
            <JSModal />
            <CreditsIndicator
                className='absolute bottom-0 flex items-center gap-1 right-0 bg-[#FFEEE5] p-4 rounded-tl-2xl '
                activeSubscription={activeSubscription}
            />

            {/* ── AI Content Suggestions Panel (Feature 4) ── */}
            <SuggestionsPanel />

            {/* ── Onboarding Layer (isolated, renders on top) ── */}
            <EditorOnboarding />
        </div>
    );
}
