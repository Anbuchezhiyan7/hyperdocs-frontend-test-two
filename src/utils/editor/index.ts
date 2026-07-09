import { Value } from '@udecode/plate';
import { PlateCorePlugin } from '@udecode/plate/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TPlateEditor } from '@udecode/plate/react';
import { BlockSelectionPlugin } from '@udecode/plate-selection/react';

/**
 * Ensures value is a valid Slate value: array of block elements only.
 * Removes primitives (e.g. stray 0) and invalid entries that cause "[Slate] initialValue is invalid".
 */
export const sanitizeSlateValue = (value: Value): Value => {
    if (!value || !Array.isArray(value)) return [];
    const filtered = value.filter(
        (item: any) => item != null && typeof item === 'object' && !Array.isArray(item) && 'type' in item
    );
    return filtered.map((item: any) => ({
        ...item,
        children: item?.children?.length > 0 ? item.children : [{ text: '' }],
    }));
};

export const transformBlogContent = (blog: any) => {
    if (!blog?.content) {
        // Return a default structure with h1 when no content exists
        return [
            {
                type: HEADING_KEYS.h1,
                children: [{ text: blog?.blog_title || 'Untitled' }],
                id: 'h1',
            },
        ];
    }

    let transformedContent = [];

    if (typeof blog?.content === 'string') {
        try {
            transformedContent = JSON.parse(blog?.content);
        } catch (e) {
            console.error('Failed to parse blog content:', e);
            transformedContent = [];
        }
    } else {
        transformedContent = blog?.content;
    }

    transformedContent = sanitizeSlateValue(transformedContent as Value);

    if (!Array.isArray(transformedContent) || transformedContent.length === 0) {
        return [
            {
                type: HEADING_KEYS.h1,
                children: [{ text: blog?.blog_title || 'Untitled' }],
                id: 'h1',
            },
        ];
    }

    // Only add h1 if there's no content at all
    if (transformedContent.length === 0) {
        transformedContent = [
            {
                type: HEADING_KEYS.h1,
                children: [{ text: blog?.blog_title || 'Untitled' }],
                id: 'h1',
            },
        ];
    }

    if (transformedContent.length > 0 && transformedContent[0].type !== HEADING_KEYS.h1) {
        transformedContent.unshift({
            type: HEADING_KEYS.h1,
            children: [{ text: blog?.blog_title || 'Untitled' }],
            id: 'h1',
        });
    }

    return transformedContent.map((item: any) => ({
        ...item,
        children: item?.children?.length > 0 ? item.children : [{ text: '' }],
    }));
};

export const hexToRgba = (hex: string, alpha: number): string => {
    // Remove the hash if it exists
    const hexValue = hex.startsWith('#') ? hex.slice(1) : hex;
    // Ensure we have a 6-digit hex code
    const fullHex =
        hexValue.length === 3
            ? hexValue
                  .split('')
                  .map(char => char + char)
                  .join('')
            : hexValue;
    if (fullHex.length !== 6) {
        console.warn(`Invalid hex color: ${hex}. Using default shadow.`);
        return 'rgba(0, 0, 0, 0.1)'; // Fallback shadow
    }
    try {
        const bigint = parseInt(fullHex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch (error) {
        console.error(`Error converting hex ${hex} to RGBA:`, error);
        return 'rgba(0, 0, 0, 0.1)'; // Fallback shadow on error
    }
};

export const defaultColors = [
    '#FF5758', // Red
    '#FF924D', // Orange
    '#FDBD5A', // Yellow
    '#7EDA58', // Green
    '#5371FF', // Blue
];

const insertSuggestionForLink = (
    editor: TPlateEditor<Value, PlateCorePlugin>,
    suggestion: any,
    suggestion_type: string
) => {
    const { id, anchor_word, url, parent_id } = suggestion;
    console.log('SUGGESTION', suggestion);

    // Find the node containing the anchor word
    const nodeEntry = Array.from(
        editor.api.nodes({
            at: [],
            match: (n: any) => {
                return n.type === 'p' && n.id === parent_id;
            },
        })
    )[0];

    if (!nodeEntry) return;

    const [node, path] = nodeEntry;
    const text = (node.children as any)[0].text;
    const startIndex = text.toLowerCase().indexOf(anchor_word.toLowerCase());

    if (startIndex === -1) return;

    // Create selection for the anchor word
    editor.selection = {
        anchor: { path: [...path, 0], offset: startIndex },
        focus: { path: [...path, 0], offset: startIndex + anchor_word.length },
    };

    // Insert the link
    editor.tf.insertNode({
        type: 'a',
        url,
        children: [{ text: anchor_word }],
        element_id: id,
        suggestion_type,
    });

    // Show floating link toolbar
    const linkPlugin = editor.plugins.find((p: any) => p.key === 'link');
    if (linkPlugin?.api?.floatingLink) {
        linkPlugin.api.floatingLink.show('edit', id);
    }
};

export const insertSuggestion = (
    editor: TPlateEditor<Value, PlateCorePlugin>,
    suggestion: Array<any>,
    suggestion_type: string
) => {
    console.log('SUGGESTION', suggestion);
    // When suggestion_type is 'all', set is_ai_suggested to false (applying all suggestions)
    const isApplyAll = suggestion_type === 'all';
    Promise.all(
        suggestion.map(async item => {
            const { id, content, after_line, type, data_plugin_id, parent_id } = item;
            editor.getApi(BlockSelectionPlugin).blockSelection.set(id);
            const parentId = parent_id ? parent_id : id;
            const index = editor.children?.findIndex(
                child => child.id === parentId && child.id !== undefined
            );
            const path = editor.api.findPath(editor?.children?.[index]);
            console.log('PATH', path);
            if (path) {
                if (type === 'a') {
                    insertSuggestionForLink(editor, item, suggestion_type);
                } else {
                    editor.tf.setNodes(
                        {
                            is_ai_suggested: isApplyAll ? false : true,
                            suggested_content: content,
                            element_id: id,
                            suggestion_type,
                        },
                        { at: path }
                    );
                }
            } else {
                const data = {
                    type: type,
                    is_ai_suggested: isApplyAll ? false : true,
                    suggested_content: content || '',
                    children: [{ text: content || '' }],
                    is_new_line: true,
                    plugin_data_id: data_plugin_id || null,
                    element_id: id,
                    suggestion_type,
                };
                if (Array.isArray(after_line)) {
                    after_line.forEach(line => {
                        editor.tf.insertNodes(data, { at: [line] });
                    });
                } else {
                    console.log('AFTER LINE', after_line);
                    editor.tf.insertNodes(data, { at: [after_line] });
                }
            }
        })
    );
};

export const generateBlogSlug = (title: string) => {
    if (title === 'Untitled') return `untitled-${Date.now()}`;

    return title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
};
