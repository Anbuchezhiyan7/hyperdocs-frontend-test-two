'use server';

import { revalidateTag } from 'next/cache';

/**
 * Server Action to manually clear the Next.js cache for a specific tag.
 * Can be called directly from Client Components (like buttons or form handlers).
 */
export async function clearCacheByTag(tag: string) {
    revalidateTag(tag);
}
