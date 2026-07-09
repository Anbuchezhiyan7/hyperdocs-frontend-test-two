import { usePathname } from 'next/navigation';

import { generateAuthorSlug } from './string';



export const formatRes = {
    success: (status: number, defaultMessage = 'Success', data?: any) => ({
        status,
        message: data?.message || defaultMessage,
        data,
        type: 'success',
        success: true,
    }),

    error: (error: any, defaultMessage = 'Something went wrong') => {
        const status = error?.status ?? error?.response?.status ?? null;
        const data = error?.data ?? error?.response?.data ?? {};
        const message = data?.message || data?.detail || error?.message || defaultMessage;

        return {
            status,
            message,
            type: 'error',
            success: false,
            data: {},
        };
    },
};

export const getPath = (path: string) => {
    const pathname = usePathname();
    return getPathByPathname(path, pathname);
};


export const getPathByPathname = (path: string, pathname: string) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const parts = pathname.split('/');
    
    const isTemplate = parts.includes('template');
    const isBlogs = parts.includes('blogs');

    if (isTemplate) {
        const templateIndex = parts.indexOf('template');
        // Keep up to /template/[id]/[mode]
        const blogPath = parts.slice(0, templateIndex + 3).join('/');
        return `${blogPath}/${cleanPath}`;
    }

    if (isBlogs) {
        const blogsIndex = parts.indexOf('blogs');
        const blogPath = parts.slice(0, blogsIndex + 1).join('/');
        return `${blogPath}/${cleanPath}`;
    }

    // Handle custom subfolder integrations (e.g., /blogs-testing, /news, /articles)
    if (pathname !== '/' && pathname !== '') {
        const folderParts = pathname.split('/').filter(Boolean);
        if (folderParts.length > 0) {
            // Assume the first segment is the subfolder base
            return `/${folderParts[0]}/${cleanPath}`;
        }
    }

    // Default to root-relative path
    return `/${cleanPath}`;
};

export const getAuthorPathByPathname = (authorId: string, authorName: string, designation: string, pathname: string) => {
    const authorSlug = generateAuthorSlug(authorName, designation);
    const authorPath = `blogs/author/${authorSlug}/${authorId}`;
    return getPathByPathname(authorPath, pathname);
};