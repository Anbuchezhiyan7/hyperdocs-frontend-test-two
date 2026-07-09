export const formatString = (str: string): string => {
    if (!str || typeof str !== 'string') return '';
    return str
        .replace(/[_-]/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
};

export const convertToSelectOptions = (
    data: any[],
    valueKey: string,
    labelKey: string,
    custom?: any
) => {
    return data.map(item =>
        custom
            ? {
                  label: item[labelKey],
                  value: item[valueKey],
                  [custom?.key]: item?.[custom.value]?.url,
              }
            : {
                  label: item[labelKey],
                  value: item[valueKey],
              }
    );
};

export const isValidUrl = (url: string) => {
    try {
        if (!url) return false;
        if (url.startsWith('http://') || url.startsWith('https://')) {
            new URL(url);
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const cleanUpPath = (path: string) => {
    return path.replace(/^\/+/, '').replace('blogs', '').replace('/', '').trim();
};

export const cleanSpecialCharacters = (str: string): string => {
    if (!str || typeof str !== 'string') return '';
    return str
        .replace(/[^\w\s]/g, ' ') // Replace any non-word, non-space characters with spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim(); // Remove leading/trailing spaces
};

export const convertToUrlFriendly = (siteName: string): string => {
    return siteName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

export const generateAuthorSlug = (authorName: string, designation: string): string => {
    const name = authorName || '';
    const desig = designation || '';
    
    // Combine name and designation, then convert to URL-friendly format
    const combined = `${name} ${desig}`.trim();
    return convertToUrlFriendly(combined);
};
