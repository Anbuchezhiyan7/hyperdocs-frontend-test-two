/**
 * Converts a blog's editor content to Markdown.
 *
 * Exporting gives writers a copy of their work that outlives the platform —
 * it can be committed to a repository, opened in any editor, or moved to
 * another publishing tool without retyping.
 *
 * Blocks the editor supports but Markdown has no syntax for (polls, lead
 * magnets, infographics, FAQs) are emitted as a short bracketed placeholder
 * rather than being silently dropped, so the author can see what needs
 * rebuilding by hand.
 */

import { nodeToPlainText } from './content-outline';

interface SerializeOptions {
    /** Prepend a YAML block with the post's metadata. */
    frontmatter?: Record<string, string | undefined>;
}

/** Escape characters that would otherwise be read as Markdown syntax. */
function escapeInline(text: string): string {
    return text.replace(/([\\`*_{}\[\]()#+\-.!])/g, '\\$1');
}

/** Apply bold/italic/code/strikethrough marks to a leaf's text. */
function serializeLeaf(leaf: any): string {
    let text = typeof leaf?.text === 'string' ? leaf.text : '';
    if (!text) return '';

    // Code is escaped by its own fences, so it must not be escaped twice.
    if (leaf.code) return `\`${text}\``;

    text = escapeInline(text);
    if (leaf.bold) text = `**${text}**`;
    if (leaf.italic) text = `_${text}_`;
    if (leaf.strikethrough) text = `~~${text}~~`;
    return text;
}

/** Serialize a node's children, handling links and nested marks. */
function serializeChildren(node: any): string {
    if (!node || !Array.isArray(node.children)) return '';
    return node.children
        .map((child: any) => {
            if (child?.type === 'a') {
                const label = serializeChildren(child) || child.url;
                return `[${label}](${child.url ?? ''})`;
            }
            if (Array.isArray(child?.children)) return serializeChildren(child);
            return serializeLeaf(child);
        })
        .join('');
}

/** A table row becomes a pipe-delimited line. */
function serializeTableRow(row: any): string {
    const cells = (row?.children ?? []).map((cell: any) => serializeChildren(cell).replace(/\|/g, '\\|').trim());
    return `| ${cells.join(' | ')} |`;
}

function serializeTable(node: any): string {
    const rows = node?.children ?? [];
    if (!rows.length) return '';

    const header = serializeTableRow(rows[0]);
    const columnCount = (rows[0]?.children ?? []).length;
    const divider = `| ${Array(columnCount).fill('---').join(' | ')} |`;
    const body = rows.slice(1).map(serializeTableRow);

    return [header, divider, ...body].join('\n');
}

/**
 * Ordered and unordered lists are stored as flat paragraphs carrying `indent`
 * and `listStyleType`, not as nested list nodes, so indentation is rebuilt from
 * the indent level and the counter is tracked per depth.
 */
function serializeListItem(node: any, counters: Map<number, number>): string {
    const indent = Math.max(0, (node.indent ?? 1) - 1);
    const pad = '  '.repeat(indent);
    const body = serializeChildren(node);

    if (node.listStyleType === 'decimal') {
        const next = (counters.get(indent) ?? 0) + 1;
        counters.set(indent, next);
        // A deeper level restarts when we come back out to it.
        for (const depth of Array.from(counters.keys())) {
            if (depth > indent) counters.delete(depth);
        }
        return `${pad}${next}. ${body}`;
    }

    counters.clear();
    return `${pad}- ${body}`;
}

const PLACEHOLDER_LABELS: Record<string, string> = {
    poll: 'Poll',
    lead_magnet: 'Lead magnet',
    infograph: 'Infographic',
    faq: 'FAQ',
    banner: 'Banner',
};

/** Convert a single top-level block. Returns null for blocks that emit nothing. */
function serializeBlock(node: any, counters: Map<number, number>): string | null {
    if (!node) return null;

    const type = node.type;

    if (type === 'h1') return `# ${serializeChildren(node)}`;
    if (type === 'h2') return `## ${serializeChildren(node)}`;
    if (type === 'h3') return `### ${serializeChildren(node)}`;
    if (type === 'h4') return `#### ${serializeChildren(node)}`;
    if (type === 'blockquote') return `> ${serializeChildren(node)}`;
    if (type === 'hr') return '---';
    if (type === 'table') return serializeTable(node);

    if (type === 'img' || type === 'image') {
        const url = node.url ?? node.src ?? '';
        const caption = nodeToPlainText(node).trim() || 'image';
        return url ? `![${caption}](${url})` : null;
    }

    if (type === 'code_block') {
        const lang = node.lang ?? '';
        const code = (node.children ?? []).map((line: any) => nodeToPlainText(line)).join('\n');
        return `\`\`\`${lang}\n${code}\n\`\`\``;
    }

    if (type === 'callout') {
        // Markdown has no callout; a blockquote is the closest faithful shape.
        return `> ${serializeChildren(node)}`;
    }

    const placeholder = PLACEHOLDER_LABELS[type];
    if (placeholder) return `_[${placeholder} — rebuild this block after importing]_`;

    if (type === 'p') {
        if (node.listStyleType) return serializeListItem(node, counters);
        const body = serializeChildren(node);
        return body.trim() ? body : null;
    }

    const fallback = serializeChildren(node);
    return fallback.trim() ? fallback : null;
}

/** Build the optional YAML frontmatter block. */
function serializeFrontmatter(fields: Record<string, string | undefined>): string {
    const lines = Object.entries(fields)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
    return lines.length ? `---\n${lines.join('\n')}\n---\n` : '';
}

/** Serialize a full post to a Markdown document. */
export function serializeBlogToMarkdown(content: any[] | null | undefined, options: SerializeOptions = {}): string {
    const counters = new Map<number, number>();
    const blocks = Array.isArray(content) ? content : [];

    const body = blocks
        .map(node => serializeBlock(node, counters))
        .filter((line): line is string => line !== null)
        .join('\n\n');

    const front = options.frontmatter ? serializeFrontmatter(options.frontmatter) : '';
    return `${front}${front ? '\n' : ''}${body}\n`;
}

/** A filesystem-safe filename for the exported post. */
export function markdownFilename(title: string | undefined): string {
    const base = (title ?? 'untitled')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);
    return `${base || 'untitled'}.md`;
}

/**
 * Trigger a download of the Markdown in the browser.
 *
 * The object URL is revoked afterwards; without that, the whole document stays
 * in memory for the life of the tab, which adds up when exporting in bulk.
 */
export function downloadMarkdown(markdown: string, filename: string): void {
    if (typeof window === 'undefined') return;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}
