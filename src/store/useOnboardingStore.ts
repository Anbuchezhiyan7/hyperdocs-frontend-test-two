'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type OnboardingPhase =
    | 'idle'
    | 'dashboard'
    | 'editor-intro'
    | 'editor-content-inserted'
    | 'enhance-wait'
    | 'block-walkthrough'
    | 'publish-wait'
    | 'view-blog'
    | 'completed';

export interface OnboardingBlockStep {
    type: string;
    dataTour: string;
    label: string;
    done: boolean;
}

export interface OnboardingState {
    isActive: boolean;
    isCompleted: boolean;
    phase: OnboardingPhase;
    currentBlogId: string | null;
    blockSteps: OnboardingBlockStep[];
    currentBlockIndex: number;
    isInteractionLocked: boolean;
    isEnhancing: boolean;
    isPublishing: boolean;
    demoContent: any | null;

    // Actions
    startOnboarding: () => void;
    completeOnboarding: () => void;
    setPhase: (phase: OnboardingPhase) => void;
    setCurrentBlogId: (id: string | null) => void;
    setBlockSteps: (steps: OnboardingBlockStep[]) => void;
    advanceBlockStep: () => void;
    setInteractionLocked: (locked: boolean) => void;
    setIsEnhancing: (val: boolean) => void;
    setIsPublishing: (val: boolean) => void;
    resetOnboarding: () => void;
    setDemoContent: (content: any, enhancedContent: any | null) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set, get) => ({
            isActive: false,
            isCompleted: false,
            phase: 'idle',
            currentBlogId: null,
            blockSteps: [],
            currentBlockIndex: 0,
            isInteractionLocked: false,
            isEnhancing: false,
            isPublishing: false,
            demoContent: null,

            startOnboarding: () =>
                set({
                    isActive: true,
                    isCompleted: false,
                    phase: 'dashboard',
                    currentBlockIndex: 0,
                    blockSteps: [],
                }),

            completeOnboarding: () => {
                set({
                    isActive: false,
                    isCompleted: true,
                    phase: 'completed',
                    isInteractionLocked: false,
                });
                // Persist completion to localStorage
                try {
                    localStorage.setItem('onboarding_completed', 'true');
                } catch (_) {}
            },

            setPhase: (phase) => set({ phase }),

            setCurrentBlogId: (id) => set({ currentBlogId: id }),

            setBlockSteps: (steps) => set({ blockSteps: steps, currentBlockIndex: 0 }),

            advanceBlockStep: () => {
                const { currentBlockIndex, blockSteps } = get();
                const nextIndex = currentBlockIndex + 1;
                if (nextIndex >= blockSteps.length) {
                    // All blocks done → move to publish phase
                    set({ currentBlockIndex: nextIndex, phase: 'publish-wait' });
                } else {
                    set({ currentBlockIndex: nextIndex });
                }
            },

            setInteractionLocked: (locked) => set({ isInteractionLocked: locked }),

            setIsEnhancing: (val) => set({ isEnhancing: val }),

            setIsPublishing: (val) => set({ isPublishing: val }),
            setDemoContent: (content, enhancedContent) =>
                set({ demoContent: content }),

            resetOnboarding: () =>
                set({
                    isActive: false,
                    isCompleted: false,
                    phase: 'idle',
                    currentBlogId: null,
                    blockSteps: [],
                    currentBlockIndex: 0,
                    isInteractionLocked: false,
                    isEnhancing: false,
                    isPublishing: false,
                }),
        }),
        {
            name: 'hyperblog-onboarding',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                isCompleted: state.isCompleted,
                phase: state.phase,
                currentBlogId: state.currentBlogId,
                currentBlockIndex: state.currentBlockIndex,
                blockSteps: state.blockSteps,
                demoContent: state.demoContent,
            }),
        }
    )
);
