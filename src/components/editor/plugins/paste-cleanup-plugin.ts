'use client';

import { createPlatePlugin } from '@udecode/plate/react';

// Returns true when a Slate node is a paragraph that contains no visible
// content — only empty strings, whitespace, or non-breaking spaces (&nbsp;).
const isBlankParagraph = (node: any): boolean => {
    if (node.type !== 'p') return false;
    const children: any[] = node.children ?? [];
    if (children.length === 0) return true;
    if (children.some((leaf: any) => typeof leaf.text !== 'string')) return false;
    const allText = children.map((leaf: any) => leaf.text as string).join('');
    return allText.replace(/\s/g, '') === '';
};

// ─── insertData path (ChatGPT HTML) ──────────────────────────────────────────

// Walk a DOM node and collect Slate leaf objects, preserving bold/italic/code.
const extractLeaves = (node: Node, marks: Record<string, boolean> = {}): any[] => {
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? '';
        return text ? [{ text, ...marks }] : [];
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return [];

    const el = node as Element;
    const tag = el.tagName.toUpperCase();
    const next = { ...marks };

    switch (tag) {
        case 'STRONG': case 'B': next.bold = true; break;
        case 'EM': case 'I': next.italic = true; break;
        case 'CODE': next.code = true; break;
        case 'U': next.underline = true; break;
        case 'S': case 'STRIKE': case 'DEL': next.strikethrough = true; break;
    }

    return Array.from(el.childNodes).flatMap(c => extractLeaves(c, next));
};

// Process a <ul>/<ol> DOM element into IndentListPlugin-compatible paragraphs.
const processListEl = (listEl: Element, depth: number): any[] => {
    const nodes: any[] = [];
    const isOrdered = listEl.tagName.toUpperCase() === 'OL';
    const listStyleType = isOrdered ? 'decimal' : 'disc';

    for (const child of Array.from(listEl.children)) {
        if (child.tagName.toUpperCase() !== 'LI') continue;

        const leaves: any[] = [];
        for (const liChild of Array.from(child.childNodes)) {
            if (liChild.nodeType === Node.ELEMENT_NODE) {
                const t = (liChild as Element).tagName.toUpperCase();
                if (t === 'UL' || t === 'OL') continue;
            }
            leaves.push(...extractLeaves(liChild));
        }

        if (leaves.some((l: any) => l.text?.trim())) {
            nodes.push({ type: 'p', indent: depth, listStyleType, children: leaves });
        }

        for (const nested of Array.from(child.children)) {
            const t = nested.tagName.toUpperCase();
            if (t === 'UL' || t === 'OL') nodes.push(...processListEl(nested, depth + 1));
        }
    }

    return nodes;
};

// Convert an HTML body element to Slate nodes (paragraphs, headings, lists).
const domToSlate = (el: Element): any[] => {
    const nodes: any[] = [];

    for (const child of Array.from(el.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent?.trim();
            if (text) nodes.push({ type: 'p', children: [{ text }] });
            continue;
        }
        if (child.nodeType !== Node.ELEMENT_NODE) continue;

        const elem = child as Element;
        const tag = elem.tagName.toUpperCase();

        if (tag === 'UL' || tag === 'OL') {
            nodes.push(...processListEl(elem, 1));
        } else if (/^H[1-6]$/.test(tag)) {
            const leaves = extractLeaves(elem);
            if (leaves.length > 0) {
                nodes.push({ type: `h${tag[1]}`, children: leaves });
            }
        } else if (tag === 'P') {
            const leaves = extractLeaves(elem);
            if (leaves.length > 0) nodes.push({ type: 'p', children: leaves });
        } else if (['DIV', 'SECTION', 'ARTICLE', 'MAIN', 'BLOCKQUOTE'].includes(tag)) {
            nodes.push(...domToSlate(elem));
        } else if (tag !== 'BR') {
            const text = elem.textContent?.trim();
            if (text) nodes.push({ type: 'p', children: [{ text }] });
        }
    }

    return nodes;
};

// ─── insertFragment path (DocxPlugin / any ul-ol fragment) ───────────────────

// Recursively collect all Slate leaf nodes from any Slate node tree.
const extractSlateLeaves = (node: any): any[] => {
    if (typeof node.text === 'string') return [node];
    if (Array.isArray(node.children)) return node.children.flatMap(extractSlateLeaves);
    return [];
};

// Convert a Slate ul/ol node (from ListPlugin or DocxPlugin deserialization)
// into IndentListPlugin-compatible paragraph nodes.
const convertSlateListNode = (node: any, depth: number): any[] => {
    const result: any[] = [];
    const isOrdered = node.type === 'ol';
    const listStyleType = isOrdered ? 'decimal' : 'disc';

    for (const li of (node.children ?? [])) {
        if (li.type !== 'li') {
            // Defensive: treat non-li children as leaves if they have text.
            const leaves = extractSlateLeaves(li);
            if (leaves.some((l: any) => l.text?.trim())) {
                result.push({ type: 'p', indent: depth, listStyleType, children: leaves });
            }
            continue;
        }

        const liChildren: any[] = li.children ?? [];
        const nestedLists: any[] = [];
        const contentNodes: any[] = [];

        for (const child of liChildren) {
            if (child.type === 'ul' || child.type === 'ol') {
                nestedLists.push(child);
            } else {
                contentNodes.push(child);
            }
        }

        // Extract all leaf text nodes from content, regardless of wrapper type
        // (handles lic, p, span, or any intermediate element DocxPlugin uses).
        const leaves = contentNodes.flatMap(extractSlateLeaves);

        if (leaves.some((l: any) => l.text?.trim())) {
            result.push({ type: 'p', indent: depth, listStyleType, children: leaves });
        }

        for (const nested of nestedLists) {
            result.push(...convertSlateListNode(nested, depth + 1));
        }
    }

    return result;
};

// Replace top-level ul/ol Slate nodes with IndentListPlugin paragraphs.
const flattenSlateListNodes = (fragment: any[]): any[] => {
    const result: any[] = [];
    for (const node of fragment) {
        if (node.type === 'ul' || node.type === 'ol') {
            result.push(...convertSlateListNode(node, 1));
        } else {
            result.push(node);
        }
    }
    return result;
};

// ─── Plugin ──────────────────────────────────────────────────────────────────

/**
 * Two responsibilities:
 *
 * 1. insertData — intercepts HTML paste that contains <ul>/<ol> AND does NOT
 *    look like a rich-document source (Word, Google Docs, LibreOffice, etc.).
 *    Parses the raw clipboard HTML with DOMParser and builds
 *    IndentListPlugin-compatible Slate nodes directly, bypassing the conflict
 *    between ListPlugin's HTML deserializer and IndentListPlugin.
 *    Covers ChatGPT and other clean-HTML sources.
 *
 * 2. insertFragment — converts any ul/ol Slate nodes that arrive via
 *    DocxPlugin (Word) into IndentListPlugin-compatible paragraphs, then
 *    strips blank paragraph spacers injected by copy sources.
 */
export const pasteCleanupPlugin = createPlatePlugin({
    key: 'paste-cleanup',
    extendEditor: ({ editor }) => {
        const e = editor as any;
        const prevInsertData = e.insertData as (data: DataTransfer) => void;
        const prevInsertFragment = e.insertFragment as (fragment: any[]) => void;

        e.insertData = (data: DataTransfer) => {
            const html = data.getData('text/html');

            const hasLists = html && (html.includes('<ul') || html.includes('<ol'));

            // Rich-document sources already have working paste support via
            // DocxPlugin / JuicePlugin — leave them untouched so their list
            // nodes flow through the insertFragment converter below.
            const isRichDocument = html && (
                html.includes('urn:schemas-microsoft-com') ||
                html.includes('xmlns:w=')                  ||
                html.includes('MsoNormal')                 ||
                html.includes('mso-')                      ||
                html.includes('docs-internal-guid')        ||
                html.includes('id="docs-')                 ||
                html.includes('data-sheets-')              ||
                html.includes('xmlns:o=')
            );

            if (hasLists && !isRichDocument && typeof DOMParser !== 'undefined') {
                try {
                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    const nodes = domToSlate(doc.body);
                    if (nodes.length > 0) {
                        e.insertFragment(nodes);
                        return;
                    }
                } catch {
                    // fall through to normal paste handling
                }
            }

            return prevInsertData(data);
        };

        e.insertFragment = (fragment: any[]) => {
            if (fragment.length <= 1) {
                return prevInsertFragment(fragment);
            }

            // Convert ul/ol Slate nodes (from DocxPlugin or ListPlugin HTML
            // deserialization) into IndentListPlugin-compatible paragraphs.
            const hasListNodes = fragment.some(
                (n: any) => n.type === 'ul' || n.type === 'ol'
            );
            const converted = hasListNodes ? flattenSlateListNodes(fragment) : fragment;

            // Remove blank spacing paragraphs injected by copy sources.
            const cleaned = converted.filter((node: any) => !isBlankParagraph(node));
            return prevInsertFragment(cleaned.length > 0 ? cleaned : converted);
        };

        return editor;
    },
});
