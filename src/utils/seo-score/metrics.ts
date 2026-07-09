function extractFullText(nodes: PlateNode[]): string {
    let text = '';

    function traverse(nodes: PlateNode[]) {
        if (!Array.isArray(nodes)) return;
        for (const node of nodes) {
            // Skip AI-suggested content
            if ((node as any).is_ai_suggested) {
                continue;
            }
            
            if (node.text) {
                text += ' ' + node.text;
            }
            if (Array.isArray(node.children)) {
                traverse(node.children);
            }
        }
    }

    traverse(nodes);
    return text.trim();
}

export function extractContentMetrics(
    nodes: PlateNode[],
    keywords: string[],
    activeDomain: string
): ContentMetrics {
    let metrics: ContentMetrics = {
        totalWords: 0,
        keywordCount: 0,
        firstParagraph: '',
        subheadingsWithKeyword: 0,
        internalLinksCount: 0,
        externalLinksCount: 0,
        imageAltTagsWithKeyword: 0,
        readabilityMetrics: {
            hasBulletPoints: false,
            hasBoldText: false,
            hasShortParagraphs: false,
            hasClearHeadings: false,
        },
    };

    console.log('activeDomain', activeDomain);

    function textIncludesAnyKeyword(text: string) {
        return keywords.some(k => text.includes(k));
    }

    function countKeywordMatches(text: string) {
        return keywords.reduce((count, keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            const matches = text.match(regex);
            return count + (matches ? matches.length : 0);
        }, 0);
    }

    function getFirstMeaningfulParagraph(nodes: PlateNode[]): string {
        if (!Array.isArray(nodes)) return '';
        for (const node of nodes) {
            // Skip AI-suggested content
            if ((node as any).is_ai_suggested) {
                continue;
            }
            
            if (node.type === 'p') {
                const text = node.children?.[0]?.text?.trim() || '';
                if (text.length >= 20) return text;
            }
            if (Array.isArray(node.children)) {
                const result = getFirstMeaningfulParagraph(node.children);
                if (result) return result;
            }
        }
        return '';
    }

    function traverseNodes(nodes: PlateNode[]) {
        if (!Array.isArray(nodes)) return;

        for (const node of nodes) {
            // Skip AI-suggested content
            if ((node as any).is_ai_suggested) {
                continue;
            }
            const nodeText = String(node?.children?.[0]?.text || '').toLowerCase();

            if (nodeText) {
                const words = nodeText.trim().split(/\s+/);
                metrics.totalWords += words.length;
            }

            if ((node.type === 'h2' || node.type === 'h3') && textIncludesAnyKeyword(nodeText)) {
                metrics.subheadingsWithKeyword++;
            }

            if (node.type === 'a' && node.url) {
                if (
                    String(node.url).startsWith('https') &&
                    !node.url?.includes(activeDomain || '')
                ) {
                    metrics.externalLinksCount = (metrics.externalLinksCount || 0) + 1;
                } else {
                    metrics.internalLinksCount = (metrics.internalLinksCount || 0) + 1;
                }
            }

            if (
                node.type === 'img' &&
                node.alt &&
                textIncludesAnyKeyword(String(node.alt).toLowerCase())
            ) {
                metrics.imageAltTagsWithKeyword = (metrics.imageAltTagsWithKeyword || 0) + 1;
            }

            if (node.type === 'ul' || node.type === 'ol') {
                metrics.readabilityMetrics.hasBulletPoints = true;
            }

            if (node.type === 'strong' || node.type === 'b') {
                metrics.readabilityMetrics.hasBoldText = true;
            }

            if (nodeText && nodeText.length <= 150) {
                metrics.readabilityMetrics.hasShortParagraphs = true;
            }

            if (node.type === 'h2' || node.type === 'h3') {
                metrics.readabilityMetrics.hasClearHeadings = true;
            }

            if (Array.isArray(node.children)) {
                traverseNodes(node.children);
            }
        }
    }

    traverseNodes(nodes);

    const fullText = extractFullText(nodes).toLowerCase();
    metrics.keywordCount = countKeywordMatches(fullText);
    metrics.firstParagraph = getFirstMeaningfulParagraph(nodes);

    return metrics;
}
