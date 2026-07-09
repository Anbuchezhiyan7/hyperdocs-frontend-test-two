import { v4 as uuidv4 } from 'uuid';
const checkIncludesKeyword = (text: string, keywords: string[]) => {
    const lower = text.toLowerCase();
    return keywords.some(keyword => lower.includes(keyword.toLowerCase()));
};

const createScoreResult = (
    key: string,
    condition: string,
    score: number,
    isPassed: boolean,
    currentValue: number | string,
    showAIButton?: boolean
): SeoScoreResult => ({
    key,
    condition,
    score,
    isPassed,
    currentValue,
    id: uuidv4(),
    showAIButton,
});

export const analyze = {
    titleScore: (title: string, keywords: string[]) => {
        const length = title.length;
        console.log('title from titleScore', title.length);
        const hasKeyword = checkIncludesKeyword(title, keywords);
        return createScoreResult(
            'title',
            'Title should be 50 - 60 characters long',
            8, // Increased from 6 to 8 (redistributed 2 points from word count)
            hasKeyword && length >= 50 && length <= 60,
            length,
            true
        );
    },

    introScore: (firstParagraph: string, keywords: string[]) => {
        const hasKeyword = checkIncludesKeyword(firstParagraph, keywords);
        return createScoreResult(
            'introduction',
            'Keyword should appear in the first 100 words of introduction',
            8, // Increased from 6 to 8 (redistributed 2 points from word count)
            hasKeyword,
            Math.min(firstParagraph.length, 100),
            true
        );
    },

    // wordCountScore: (count: number) => {
    //     return createScoreResult(
    //         'word_count',
    //         'Total word count should be between 2000 - 5000 words',
    //         10,
    //         count >= 2000 && count <= 5000,
    //         count,
    //         true
    //     );
    // },

    metaTitleScore: (title: string, keywords: string[]) => {
        const length = title.length;

        return createScoreResult(
            'meta_title',
            'Meta title should be 40 - 60 characters long with the keyword',
            6,
             length >= 40 && length <= 60,
            length,
            true
        );
    },

    metaDescriptionScore: (desc: string, keywords: string[]) => {
        const length = desc.length;
        
        return createScoreResult(
            'meta_description',
            'Meta description should be 70 - 160 characters long with the keyword',
            6,
             length >= 70 && length <= 160,
            length,
            true
        );
    },

    keywordDensityScore: (density: number) => {
        return createScoreResult(
            'keyword_density',
            'Keyword density should be mininum 1% - 2%',
            8, // Increased from 6 to 8 (redistributed 2 points from word count)
            density >= 1,
            Number(density.toFixed(2)),
            true
        );
    },

    subheadingsScore: (count: number) => {
        return createScoreResult(
            'subheadings',
            'At least 2 subheadings should contain the keyword',
            8, // Increased from 6 to 8 (redistributed 2 points from word count)
            count >= 2,
            count,
            true
        );
    },

    readabilityScore: ({
        hasBulletPoints,
        hasBoldText,
        hasShortParagraphs,
        hasClearHeadings,
    }: {
        hasBulletPoints: boolean;
        hasBoldText: boolean;
        hasShortParagraphs: boolean;
        hasClearHeadings: boolean;
    }) => {
        const flagsCount = [
            hasBulletPoints,
            hasBoldText,
            hasShortParagraphs,
            hasClearHeadings,
        ].filter(Boolean).length;

        return createScoreResult(
            'readability',
            'Use bullet points, bold text, short paragraphs, and clear headings',
            10, // Increased from 8 to 10 (redistributed 2 points from word count)
            flagsCount > 0,
            flagsCount,
            false
        );
    },

    faqSchemaScore: (schema: any) => {
        return createScoreResult(
            'faq',
            'FAQ should be present',
            8,
            schema?.length > 0,
            schema?.length,
            true
        );
    },

    leadMagnetScore: (magnets: any[]) => {
        return createScoreResult(
            'lead_magnet',
            'Lead magnet should be present',
            6,
            magnets?.length > 0,
            magnets?.length,
            true
        );
    },

    infoGraphScore: (infographs: any[]) => {
        return createScoreResult(
            'infograph',
            'At least 1 info graph should be present',
            8,
            infographs?.length > 0,
            infographs?.length,
            true
        );
    },

    pollScore: (polls: any[]) => {
        return createScoreResult(
            'poll',
            'At least 1 poll should be present',
            8,
            polls?.length > 0,
            polls?.length,
            true
        );
    },
    tocScore: (toc: any[]) => {
        return createScoreResult(
            'toc',
            'Table of contents should be present',
            8,
            toc?.length > 0,
            toc?.length,
            true
        );
    },
    bannerScore: (banners: any[]) => {
        return createScoreResult(
            'banner',
            'At least 1 banner should be present',
            8,
            banners?.length > 0,
            banners?.length,
            true
        );
    },
};
