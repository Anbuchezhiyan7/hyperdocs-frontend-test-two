/**
 * readability.ts
 * Pure utility — converts Plate editor JSON content into human-readable
 * reading-time and a Flesch–Kincaid readability grade label.
 *
 * No external deps — works in browser and Node.
 */

export interface ReadabilityResult {
    /** Estimated reading time in minutes (min 1) */
    readingTime: number;
    /** Flesch Reading Ease score (0–100) */
    fleschScore: number;
    /** Human-friendly grade label derived from the score */
    gradeLabel: GradeLabel;
    /** Raw word count */
    wordCount: number;
}

export type GradeLabel =
    | 'Very Easy'
    | 'Easy'
    | 'Fairly Easy'
    | 'Standard'
    | 'Fairly Difficult'
    | 'Difficult'
    | 'Very Difficult';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Recursively extract all text from a Plate node tree. */
function extractText(nodes: any[]): string {
    if (!Array.isArray(nodes)) return '';
    return nodes
        .map(node => {
            if (typeof node.text === 'string') return node.text;
            if (Array.isArray(node.children)) return extractText(node.children);
            return '';
        })
        .join(' ');
}

/** Count syllables in an English word (rough heuristic). */
function countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}

/** Map a Flesch Reading Ease score to a human-friendly label. */
function scoreToLabel(score: number): GradeLabel {
    if (score >= 90) return 'Very Easy';
    if (score >= 80) return 'Easy';
    if (score >= 70) return 'Fairly Easy';
    if (score >= 60) return 'Standard';
    if (score >= 50) return 'Fairly Difficult';
    if (score >= 30) return 'Difficult';
    return 'Very Difficult';
}

// ── Main export ─────────────────────────────────────────────────────────────

/**
 * Analyse a Plate editor content array and return readability metrics.
 *
 * @param nodes - The `editor.children` / `blog.content` array from Plate
 */
export function analyseReadability(nodes: any[]): ReadabilityResult {
    const raw = extractText(nodes).trim();

    if (!raw) {
        return { readingTime: 1, fleschScore: 100, gradeLabel: 'Very Easy', wordCount: 0 };
    }

    // Words
    const words = raw.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Sentences (split on . ! ?)
    const sentences = raw.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = Math.max(1, sentences.length);

    // Syllables
    const syllableCount = words.reduce((acc, w) => acc + countSyllables(w), 0);

    // Flesch Reading Ease = 206.835 – 1.015 × (words/sentences) – 84.6 × (syllables/words)
    const avgWordsPerSentence = wordCount / sentenceCount;
    const avgSyllablesPerWord = syllableCount / Math.max(1, wordCount);
    const fleschRaw = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
    const fleschScore = Math.min(100, Math.max(0, Math.round(fleschRaw)));

    // Reading time: average adult reads ~238 words/min
    const readingTime = Math.max(1, Math.round(wordCount / 238));

    return {
        readingTime,
        fleschScore,
        gradeLabel: scoreToLabel(fleschScore),
        wordCount,
    };
}
