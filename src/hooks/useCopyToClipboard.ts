'use client';

import { useCallback, useRef, useState } from 'react';

interface UseCopyToClipboardResult {
    copied: boolean;
    copy: (value: string) => Promise<boolean>;
    error: string | null;
}

/**
 * Copy text to the clipboard and expose a short-lived `copied` flag so callers
 * can show a "Copied!" confirmation. The flag auto-resets after `resetMs`.
 */
export function useCopyToClipboard(resetMs = 1500): UseCopyToClipboardResult {
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const copy = useCallback(
        async (value: string): Promise<boolean> => {
            if (timer.current) clearTimeout(timer.current);
            try {
                if (navigator?.clipboard?.writeText) {
                    await navigator.clipboard.writeText(value);
                } else {
                    // Fallback for browsers/contexts without the async clipboard API.
                    const el = document.createElement('textarea');
                    el.value = value;
                    el.style.position = 'fixed';
                    el.style.opacity = '0';
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                }
                setError(null);
                setCopied(true);
                timer.current = setTimeout(() => setCopied(false), resetMs);
                return true;
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Copy failed');
                setCopied(false);
                return false;
            }
        },
        [resetMs]
    );

    return { copied, copy, error };
}
