/**
 * Pre-publish checks for a post.
 *
 * These are the problems that are cheap to fix before publishing and expensive
 * afterwards: an image with no alt text is invisible to screen readers and to
 * image search, a heading level that skips breaks document outline navigation,
 * and placeholder text that ships is embarrassing in a way readers remember.
 *
 * Everything here is derived from content the editor already holds — no request,
 * no scoring service — so it can run on every keystroke without cost.
 */

import { nodeToPlainText, buildOutline } from './content-outline';

export type HealthSeverity = 'error' | 'warning' | 'suggestion';

export interface HealthIssue {
    id: string;
    severity: HealthSeverity;
    /** Short label shown in the list. */
    title: string;
    /** What to do about it, in the author's terms. */
    detail: string;
    /** How many places in the post have this problem. */
    count: number;
}

export interface HealthReport {
    issues: HealthIssue[];
    errors: number;
    warnings: number;
    suggestions: number;
    /** 0-100. Errors cost more than warnings, warnings more than suggestions. */
    score: number;
    /** True when nothing at all was found. */
    clean: boolean;
}

interface HealthInput {
    content: any[] | null | undefined;
    title?: string;
    metaDescription?: string;
    featuredImage?: string;
}

/** Placeholder text that should never survive to a published post. */
const PLACEHOLDER_PATTERNS = [/lorem ipsum/i, /\bTODO\b/, /\bTBD\b/, /\bFIXME\b/, /xxxx+/i];

/** Link text that tells the reader nothing about the destination. */
const VAGUE_LINK_TEXT = new Set(['click here', 'here', 'read more', 'link', 'this', 'more']);

const IMAGE_TYPES = new Set(['img', 'image']);

/** Walk every node in the tree, including nested children. */
function walk(nodes: any[], visit: (node: any) => void): void {
    for (const node of nodes ?? []) {
        if (!node || typeof node !== 'object') continue;
        visit(node);
        if (Array.isArray(node.children)) walk(node.children, visit);
    }
}

export function analyseContentHealth({
    content,
    title,
    metaDescription,
    featuredImage,
}: HealthInput): HealthReport {
    const blocks = Array.isArray(content) ? content : [];
    const issues: HealthIssue[] = [];

    const add = (issue: Omit<HealthIssue, 'count'> & { count?: number }) => {
        if ((issue.count ?? 1) > 0) issues.push({ count: 1, ...issue });
    };

    // ── Images ──────────────────────────────────────────────────────────────
    let imagesMissingAlt = 0;
    walk(blocks, node => {
        if (!IMAGE_TYPES.has(node.type)) return;
        const alt = node.alt ?? node.caption ?? nodeToPlainText(node);
        if (!String(alt ?? '').trim()) imagesMissingAlt += 1;
    });
    add({
        id: 'image-alt',
        severity: 'error',
        title: 'Images without alt text',
        detail: 'Describe each image so screen readers can announce it and image search can index it.',
        count: imagesMissingAlt,
    });

    // ── Headings ────────────────────────────────────────────────────────────
    const outline = buildOutline(blocks);
    let emptyHeadings = 0;
    let levelSkips = 0;
    let previousLevel = 0;

    walk(blocks, node => {
        if (!['h1', 'h2', 'h3', 'h4'].includes(node.type)) return;
        if (!nodeToPlainText(node).trim()) emptyHeadings += 1;
    });

    for (const entry of outline) {
        // A jump of more than one level leaves a gap in the document outline,
        // which assistive tech reads as a missing section.
        if (previousLevel && entry.level > previousLevel + 1) levelSkips += 1;
        previousLevel = entry.level;
    }

    add({
        id: 'heading-empty',
        severity: 'error',
        title: 'Empty headings',
        detail: 'A heading with no text creates a blank entry in the page outline. Add text or remove it.',
        count: emptyHeadings,
    });
    add({
        id: 'heading-skip',
        severity: 'warning',
        title: 'Skipped heading levels',
        detail: 'Going straight from one heading level to a deeper one breaks the outline. Step down one level at a time.',
        count: levelSkips,
    });

    const wordCount = blocks.map(nodeToPlainText).join(' ').trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 600 && outline.length === 0) {
        add({
            id: 'heading-none',
            severity: 'warning',
            title: 'No headings in a long post',
            detail: 'Readers scan before they read. Break this up with section headings.',
        });
    }

    // ── Links ───────────────────────────────────────────────────────────────
    let vagueLinks = 0;
    let emptyLinks = 0;
    walk(blocks, node => {
        if (node.type !== 'a') return;
        const text = nodeToPlainText(node).trim().toLowerCase();
        if (!node.url) emptyLinks += 1;
        else if (VAGUE_LINK_TEXT.has(text)) vagueLinks += 1;
    });
    add({
        id: 'link-empty',
        severity: 'error',
        title: 'Links with no destination',
        detail: 'These look clickable but go nowhere. Add a URL or remove the link.',
        count: emptyLinks,
    });
    add({
        id: 'link-vague',
        severity: 'suggestion',
        title: '"Click here" style links',
        detail: 'Link the words that describe the destination — it reads better and helps search engines.',
        count: vagueLinks,
    });

    // ── Placeholder text ────────────────────────────────────────────────────
    const fullText = blocks.map(nodeToPlainText).join('\n');
    const placeholders = PLACEHOLDER_PATTERNS.filter(re => re.test(fullText)).length;
    add({
        id: 'placeholder',
        severity: 'error',
        title: 'Placeholder text left in',
        detail: 'Draft markers like TODO or lorem ipsum are still in the post.',
        count: placeholders,
    });

    // ── Very long paragraphs ────────────────────────────────────────────────
    const longParagraphs = blocks.filter(
        node => node?.type === 'p' && !node.listStyleType && nodeToPlainText(node).split(/\s+/).length > 150,
    ).length;
    add({
        id: 'paragraph-long',
        severity: 'suggestion',
        title: 'Very long paragraphs',
        detail: 'Paragraphs over about 150 words are hard to read on a phone. Consider splitting them.',
        count: longParagraphs,
    });

    // ── Metadata ────────────────────────────────────────────────────────────
    const meta = String(metaDescription ?? '').trim();
    if (!meta) {
        add({
            id: 'meta-missing',
            severity: 'warning',
            title: 'No meta description',
            detail: 'Search results will show an arbitrary snippet from the post instead of your summary.',
        });
    } else if (meta.length > 160) {
        add({
            id: 'meta-long',
            severity: 'suggestion',
            title: 'Meta description is long',
            detail: `At ${meta.length} characters it will be cut off in search results. Aim for under 160.`,
        });
    }

    if (!String(title ?? '').trim()) {
        add({
            id: 'title-missing',
            severity: 'error',
            title: 'No title',
            detail: 'The post needs a title before it can be published.',
        });
    }

    if (!String(featuredImage ?? '').trim()) {
        add({
            id: 'featured-missing',
            severity: 'suggestion',
            title: 'No featured image',
            detail: 'Posts shared without an image get noticeably less attention on social networks.',
        });
    }

    const errors = issues.filter(i => i.severity === 'error').reduce((n, i) => n + i.count, 0);
    const warnings = issues.filter(i => i.severity === 'warning').reduce((n, i) => n + i.count, 0);
    const suggestions = issues.filter(i => i.severity === 'suggestion').reduce((n, i) => n + i.count, 0);

    // Weighted so a single error outranks several suggestions; floored at 0 so a
    // very rough draft still reports a number rather than going negative.
    const score = Math.max(0, 100 - errors * 15 - warnings * 7 - suggestions * 3);

    return {
        issues,
        errors,
        warnings,
        suggestions,
        score,
        clean: issues.length === 0,
    };
}

/** Traffic-light bucket for the badge colour. */
export function healthBand(report: HealthReport): 'good' | 'fair' | 'poor' {
    if (report.errors > 0) return 'poor';
    if (report.score >= 85) return 'good';
    return 'fair';
}

/** One-line summary for a tooltip or a compact badge. */
export function healthSummary(report: HealthReport): string {
    if (report.clean) return 'No issues found';
    const parts: string[] = [];
    if (report.errors) parts.push(`${report.errors} to fix`);
    if (report.warnings) parts.push(`${report.warnings} warning${report.warnings === 1 ? '' : 's'}`);
    if (report.suggestions) parts.push(`${report.suggestions} suggestion${report.suggestions === 1 ? '' : 's'}`);
    return parts.join(', ');
}
