
// For Email
export const isValidEmail = (email: string) => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// For Links
export const isValidLink = (urlLink: string) => {
    if (!urlLink) return false;
    const urlPattern = /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}([\/?#].*)?$/i;
    return urlPattern.test(urlLink.trim());
};

// For Js Snippet
export const isValidJsSnippet = (snippet: string): boolean => {
    const scriptRegex = /^\s*<script\b[^>]*>([\s\S]*?)<\/script>\s*$/i;
    const match = snippet.match(scriptRegex);
    if (!match) return false;

    const jsCode = match[1].trim();
    if (!jsCode) return false;

    try {
        new Function(jsCode);
        return true;
    } catch {
        return false;
    }
};

// For FAQ Schema MarkUp
export const isValidFAQSchema = (snippet: string): boolean => {
    try {
        const data = JSON.parse(snippet);

        if (
            data?.['@context'] !== 'https://schema.org' ||
            data?.['@type'] !== 'FAQPage' ||
            !Array.isArray(data?.mainEntity)
        ) return false;

        return data.mainEntity.every((item: any) =>
            item?.['@type'] === 'Question' &&
            typeof item?.name === 'string' &&
            item?.acceptedAnswer?.['@type'] === 'Answer' &&
            typeof item?.acceptedAnswer?.text === 'string'
        );
    } catch {
        return false;
    }
};

