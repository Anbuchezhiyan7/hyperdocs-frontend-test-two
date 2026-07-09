export default function extractKeywords(title: string, minLength = 3): string[] {
    if (!title) return [];

    const stopWords = new Set([
        'the',
        'and',
        'for',
        'with',
        'that',
        'from',
        'this',
        'you',
        'your',
        'are',
        'was',
        'but',
        'not',
        'all',
        'any',
        'can',
        'had',
        'has',
        'have',
        'his',
        'her',
        'its',
        'our',
        'their',
        'they',
        'them',
        'who',
        'how',
        'what',
        'when',
        'where',
        'which',
        'will',
        'would',
        'could',
        'should',
        'about',
        'into',
        'over',
        'under',
        'out',
        'more',
        'some',
        'just',
        'than',
        'then',
        'now',
        'only',
        'very',
        'like',
    ]);

    const words = title
        ?.toLowerCase()
        ?.replace(/[^\w\s]/g, '')
        ?.split(/\s+/)
        ?.filter(word => word.length >= minLength && !stopWords.has(word));

    return Array.from(new Set(words));
}
