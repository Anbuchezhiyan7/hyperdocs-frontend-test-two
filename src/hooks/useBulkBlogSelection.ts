'use client';

import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * useBulkBlogSelection
 * Manages the set of selected blog IDs across the blog list.
 * Designed to be used in the `Blogs` component and passed down
 * as props to BlogItem and BlogTableHeader.
 */
export function useBulkBlogSelection(allBlogIds: string[]) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const isSelected = useCallback(
        (id: string) => selectedIds.has(id),
        [selectedIds]
    );

    const toggleOne = useCallback((id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const selectAll = useCallback(() => {
        setSelectedIds(new Set(allBlogIds));
    }, [allBlogIds]);

    const clearAll = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    const toggleAll = useCallback(() => {
        if (selectedIds.size === allBlogIds.length && allBlogIds.length > 0) {
            clearAll();
        } else {
            selectAll();
        }
    }, [selectedIds.size, allBlogIds.length, clearAll, selectAll]);

    const count = selectedIds.size;
    const isAllSelected = count > 0 && count === allBlogIds.length;
    const isPartiallySelected = count > 0 && count < allBlogIds.length;
    const hasSelection = count > 0;

    return {
        selectedIds,
        isSelected,
        toggleOne,
        toggleAll,
        clearAll,
        count,
        isAllSelected,
        isPartiallySelected,
        hasSelection,
    };
}
