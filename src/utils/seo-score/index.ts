import { DOMAIN_URL } from '@/constants/definitions';
import { analyze } from './conditions';
import { extractContentMetrics } from './metrics';

export function analyzeSeoScore(blog: Blog, keywords: string[], domain: any): SeoAnalysisResult {
    const blog_title = blog?.blog_title || '';
    const content = typeof blog?.content === 'string' ? JSON.parse(blog?.content) : blog?.content;

    keywords = keywords.map(k => k.toLowerCase());

    const contentMetrics = extractContentMetrics(
        content,
        keywords,
        domain?.main_domain || DOMAIN_URL
    );
    const { totalWords, keywordCount } = contentMetrics;
    const keywordDensity = (keywordCount / totalWords) * 100;

    const infographs = content?.filter((item: any) => item?.type === 'infograph' && !item?.is_ai_suggested);
    const lead_magnet = content?.filter((item: any) => item?.type === 'lead_magnet' && !item?.is_ai_suggested);
    const polls = content?.filter((item: any) => item?.type === 'poll' && !item?.is_ai_suggested);
    const banners = content?.filter((item: any) => item?.type === 'banner' && !item?.is_ai_suggested);
    const toc = content?.filter((item: any) => item?.type === 'toc' && !item?.is_ai_suggested);
    const faq = content?.filter((item: any) => item?.type === 'faq' && !item?.is_ai_suggested);

    const breakdown: SeoBreakdown = {
        title: analyze.titleScore(blog_title, keywords),
        intro: analyze.introScore(contentMetrics.firstParagraph, keywords),
        // wordCount: analyze.wordCountScore(totalWords), // Commented out - 10 points redistributed to other metrics
        density: analyze.keywordDensityScore(keywordDensity),
        subheadings: analyze.subheadingsScore(contentMetrics.subheadingsWithKeyword),
        readability: analyze.readabilityScore(contentMetrics.readabilityMetrics),
        meta_title: analyze.metaTitleScore(
            blog?.blog_info?.custom_meta_data?.title || '',
            keywords
        ),
        meta_description: analyze.metaDescriptionScore(
            blog?.blog_info?.custom_meta_data?.description || '',
            keywords
        ),
        faq_schema: analyze.faqSchemaScore(faq || []),
        lead_magnet: analyze.leadMagnetScore(lead_magnet || []),
        info_graph: analyze.infoGraphScore(infographs || []),
        poll: analyze.pollScore(polls || []),
        toc: analyze.tocScore(toc || []),
        banner: analyze.bannerScore(banners || []),
    };

    const currentScore = Object.values(breakdown)
        .filter(item => item.isPassed)
        .reduce((sum, item) => sum + item.score, 0);
    const totalScore = Object.values(breakdown).reduce((sum, item) => sum + item.score, 0);

    const percentageScore =
        totalScore > 0 ? parseFloat(((currentScore / totalScore) * 100).toFixed(2)) : 0;

    return {
        totalScore,
        currentScore,
        percentageScore,
        breakdown,
        metrics: {
            totalWords,
            keywordCount,
            keywordDensity: `${keywordDensity.toFixed(2)}%`,
        },
    };
}

export function extractPercentageScore(seoScoreString: string | null | undefined): number {
    if (!seoScoreString) return 0;
    
    try {
        const seoScore = typeof seoScoreString === 'string' 
            ? JSON.parse(seoScoreString) 
            : seoScoreString;
        
        return seoScore?.percentageScore || 0;
    } catch (error) {
        console.error('Error parsing SEO score:', error);
        return 0;
    }
}
