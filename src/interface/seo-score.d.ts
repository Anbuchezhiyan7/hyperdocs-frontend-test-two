type PlateNode = {
    type?: string;
    text?: string;
    children?: PlateNode[];
    href?: string;
    alt?: string;
    url?: string;
};

interface SeoScoreResult {
    key: string;
    id: string;
    condition: string;
    score: number;
    currentValue: number | string;
    isPassed: boolean;
    showAIButton?: boolean;
}

interface SeoBreakdown {
    meta_title: SeoScoreResult;
    meta_description: SeoScoreResult;
    title: SeoScoreResult;
    intro: SeoScoreResult;
    subheadings: SeoScoreResult;
    density: SeoScoreResult;
    // wordCount: SeoScoreResult;
    readability: SeoScoreResult;
    faq_schema: SeoScoreResult;
    lead_magnet: SeoScoreResult;
    info_graph: SeoScoreResult;
    poll: SeoScoreResult;
    toc: SeoScoreResult;
    banner: SeoScoreResult;
}

interface SeoAnalysisResult {
    currentScore: number;
    totalScore: number;
    percentageScore: number;
    breakdown: SeoBreakdown;
    metrics: {
        totalWords: number;
        keywordCount: number;
        keywordDensity: string;
    };
}

interface ContentMetrics {
    totalWords: number;
    keywordCount: number;
    firstParagraph: string;
    subheadingsWithKeyword: number;
    internalLinksCount?: number;
    externalLinksCount?: number;
    imageAltTagsWithKeyword?: number;
    readabilityMetrics: {
        hasBulletPoints: boolean;
        hasBoldText: boolean;
        hasShortParagraphs: boolean;
        hasClearHeadings: boolean;
    };
}
