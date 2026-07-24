'use client';

import { useState, useCallback } from 'react';
import { useEditorAnalytics } from './useEditorAnalytics';

export interface ContentSuggestions {
    keywords: string[];
    internalLinks: { title: string; reason: string }[];
    contentGaps: { prompt: string; section: string }[];
}

interface UseContentSuggestionsOptions {
    title: string;
    excerpt: string;
    blogs: any[];
}

export function useContentSuggestions() {
    const [suggestions, setSuggestions] = useState<ContentSuggestions | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { track } = useEditorAnalytics();

    const fetchSuggestions = useCallback(
        async ({ title, excerpt, blogs }: UseContentSuggestionsOptions) => {
            setIsLoading(true);
            setError(null);

            try {
                const res = await fetch('/api/content-suggestions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, excerpt, blogs }),
                });

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData?.error || `HTTP ${res.status}`);
                }

                const data: ContentSuggestions = await res.json();
                setSuggestions(data);
                track('editor_ai_triggered', {
                    keywordsCount: data.keywords?.length,
                    internalLinksCount: data.internalLinks?.length,
                    gapsCount: data.contentGaps?.length,
                });
            } catch (e: any) {
                setError(e?.message || 'Failed to load suggestions');
            } finally {
                setIsLoading(false);
            }
        },
        [track]
    );

    const reset = useCallback(() => {
        setSuggestions(null);
        setError(null);
    }, []);

    return { suggestions, isLoading, error, fetchSuggestions, reset };
}
