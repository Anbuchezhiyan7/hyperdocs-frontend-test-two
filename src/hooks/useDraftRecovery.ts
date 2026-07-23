import { useEffect, useState } from 'react';
import { showToast } from '@/components/common/Toast';

type DraftState = 'idle' | 'found' | 'restored' | 'not-found';

type DraftRecoveryResult = {
    /** Current recovery state */
    state: DraftState;
    /** The recovered draft content (null if not found or not yet checked) */
    recoveredDraft: Record<string, unknown> | null;
    /** Call this to dismiss the recovery and delete the cached draft */
    dismissRecovery: () => Promise<void>;
    /** Call this to manually trigger re-check (e.g. after blog ID changes) */
    recheck: () => void;
};

const DRAFT_CACHE_NAME = 'hyperblog-drafts-v1';

/**
 * Checks whether a draft was cached offline for a given blog and surfaces
 * a recovery prompt to the user.
 *
 * Flow:
 *  1. On mount, opens the Service Worker cache and looks for `draft-{blogId}`
 *  2. If found, shows a toast and sets `state = 'found'`
 *  3. The editor can read `recoveredDraft` and offer to restore the content
 *  4. `dismissRecovery()` deletes the cache entry
 *
 * @param blogId - The blog ID to look up in the draft cache
 * @returns DraftRecoveryResult
 *
 * @example
 * function BlogEditor({ blogId }: { blogId: string }) {
 *   const { state, recoveredDraft, dismissRecovery } = useDraftRecovery(blogId);
 *
 *   if (state === 'found') {
 *     return (
 *       <RecoveryBanner
 *         savedAt={recoveredDraft?.savedAt}
 *         onRestore={() => loadDraft(recoveredDraft)}
 *         onDismiss={dismissRecovery}
 *       />
 *     );
 *   }
 *   return <PlateEditor />;
 * }
 */
export function useDraftRecovery(blogId: string | undefined): DraftRecoveryResult {
    const [state, setState] = useState<DraftState>('idle');
    const [recoveredDraft, setRecoveredDraft] = useState<Record<string, unknown> | null>(null);
    const [recheckToken, setRecheckToken] = useState(0);

    useEffect(() => {
        if (!blogId || typeof window === 'undefined' || !('caches' in window)) {
            setState('not-found');
            return;
        }

        let cancelled = false;

        async function checkCache() {
            try {
                const cache = await caches.open(DRAFT_CACHE_NAME);
                const response = await cache.match(`draft-${blogId}`);

                if (cancelled) return;

                if (!response) {
                    setState('not-found');
                    return;
                }

                const draft = await response.json();

                if (cancelled) return;

                // Only surface drafts that were saved while offline (syncPending = true)
                if (draft?.syncPending === true) {
                    setRecoveredDraft(draft);
                    setState('found');

                    const savedAt = draft.savedAt
                        ? new Date(draft.savedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                          })
                        : 'recently';

                    showToast(
                        `Unsaved draft recovered from ${savedAt} — offline save`,
                        'info'
                    );
                } else {
                    setState('not-found');
                }
            } catch {
                // Cache API unavailable (private browsing, etc.) — fail silently
                setState('not-found');
            }
        }

        checkCache();
        return () => { cancelled = true; };
    }, [blogId, recheckToken]);

    const dismissRecovery = async () => {
        if (!blogId) return;
        try {
            const cache = await caches.open(DRAFT_CACHE_NAME);
            await cache.delete(`draft-${blogId}`);
        } catch {
            // Ignore cache errors
        }
        setRecoveredDraft(null);
        setState('idle');
    };

    const recheck = () => setRecheckToken(t => t + 1);

    return { state, recoveredDraft, dismissRecovery, recheck };
}
