/**
 * Builds a table of contents from a blog's editor content.
 *
 * Headings are the only thing a reader can navigate by, so the outline is
 * derived from them rather than stored separately — a post's contents can never
 * drift out of sync with the post itself.
 */

export interface OutlineEntry {
    /** Anchor id used in the URL fragment and on the rendered heading. */
    id: string;
    /** Visible heading text, with formatting marks flattened away. */
    text: string;
    /** 1 for h1, 2 for h2, 3 for h3. */
    level: number;
    /** The source block's own id, used to match this entry to the rendered heading. */
    blockId?: string;
}

const HEADING_LEVELS: Record<string, number> = { h1: 1, h2: 2, h3: 3 };

/**
 * Flatten a Slate node's descendants down to plain text.
 *
 * Headings frequently carry marks (bold, links, highlights), each of which nests
 * the text one level deeper. Reading `children[0].text` therefore drops half of
 * a formatted heading, so the whole subtree is walked instead.
 */
export function nodeToPlainText(node: any): string {
    if (!node) return '';
    if (typeof node.text === 'string') return node.text;
    if (!Array.isArray(node.children)) return '';
    return node.children.map(nodeToPlainText).join('');
}

/**
 * Turn heading text into a URL-safe anchor.
 *
 * Diacritics are stripped so "Café Guide" and "Cafe Guide" produce the same
 * anchor, and punctuation collapses to single hyphens.
 */
export function slugifyHeading(text: string): string {
    return text
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
}

/**
 * Extract the outline from blog content.
 *
 * Two headings with the same words are common ("Overview" under several
 * sections), and duplicate anchors would make every link jump to the first one,
 * so repeats are suffixed: `overview`, `overview-2`, `overview-3`.
 */
export function buildOutline(content: any[] | null | undefined): OutlineEntry[] {
    if (!Array.isArray(content)) return [];

    const seen = new Map<string, number>();
    const entries: OutlineEntry[] = [];

    for (const node of content) {
        const level = HEADING_LEVELS[node?.type];
        if (!level) continue;

        const text = nodeToPlainText(node).trim();
        if (!text) continue; // an empty heading has nothing to link to

        const base = slugifyHeading(text) || `section-${entries.length + 1}`;
        const count = (seen.get(base) ?? 0) + 1;
        seen.set(base, count);

        entries.push({
            id: count === 1 ? base : `${base}-${count}`,
            text,
            level,
            blockId: typeof node?.id === 'string' ? node.id : undefined,
        });
    }

    return entries;
}

/**
 * Map each heading block's own id to its anchor id.
 *
 * The renderer and the contents panel must agree on anchors exactly, or every
 * link scrolls nowhere. Deriving both from buildOutline() means the duplicate
 * handling ("overview-2") can only ever be computed in one place.
 */
export function buildHeadingAnchors(content: any[] | null | undefined): Record<string, string> {
    const anchors: Record<string, string> = {};
    for (const entry of buildOutline(content)) {
        if (entry.blockId) anchors[entry.blockId] = entry.id;
    }
    return anchors;
}

/**
 * Whether a post has enough structure for a contents list to be useful.
 *
 * One or two headings are faster to scan than a navigation panel, so the panel
 * only earns its space past a threshold.
 */
export function hasUsefulOutline(entries: OutlineEntry[], minimum = 3): boolean {
    return entries.length >= minimum;
}

/**
 * Re-nest a flat outline so each heading sits under the nearest shallower one.
 *
 * The editor stores headings as siblings; rendering an indented list needs the
 * hierarchy back. Levels that skip a step (h1 straight to h3) attach to whatever
 * is currently open rather than being dropped.
 */
export interface NestedOutlineEntry extends OutlineEntry {
    children: NestedOutlineEntry[];
}

export function nestOutline(entries: OutlineEntry[]): NestedOutlineEntry[] {
    const roots: NestedOutlineEntry[] = [];
    const stack: NestedOutlineEntry[] = [];

    for (const entry of entries) {
        const node: NestedOutlineEntry = { ...entry, children: [] };

        while (stack.length && stack[stack.length - 1].level >= node.level) {
            stack.pop();
        }

        if (stack.length) {
            stack[stack.length - 1].children.push(node);
        } else {
            roots.push(node);
        }

        stack.push(node);
    }

    return roots;
}

/** Estimated minutes to read, used next to the contents panel. */
export function estimateReadingMinutes(content: any[] | null | undefined, wordsPerMinute = 220): number {
    if (!Array.isArray(content)) return 0;
    const words = content
        .map(nodeToPlainText)
        .join(' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
    return Math.max(1, Math.round(words / wordsPerMinute));
}
