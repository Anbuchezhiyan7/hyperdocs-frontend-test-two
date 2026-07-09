// Shared grid template so the table header row and data rows stay perfectly aligned.
export const BLOG_GRID =
    'grid grid-cols-[minmax(240px,1fr)_120px_90px_110px_130px_120px] items-center';

export const BLOG_PAGE_SIZE_OPTIONS = [10, 25, 50];

export type BlogTabKey = 'all' | 'published' | 'draft' | 'scheduled';
