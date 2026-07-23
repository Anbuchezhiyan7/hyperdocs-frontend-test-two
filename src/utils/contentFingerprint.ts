/**
 * Content Fingerprinting — Phase 7: AI Performance Intelligence
 *
 * Analyses Plate editor content nodes to answer two questions:
 *   1. Which heavy plugins are actually used in this blog?
 *      → Drive Phase 3 intelligent plugin loading (don't load what's not used)
 *   2. Are heavy plugins loaded but producing no content?
 *      → Emit PostHog event so we can identify lazy-loading opportunities
 *
 * Zero dependencies beyond Plate's core types (already installed).
 */

export type ContentSignals = {
    /** True if the blog contains Excalidraw drawing nodes (~1.2 MB plugin) */
    hasExcalidraw: boolean;
    /** True if the blog contains block or inline equations (~380 KB KaTeX) */
    hasMath: boolean;
    /** True if the blog contains embedded video or media nodes */
    hasVideo: boolean;
    /** True if the blog contains table nodes */
    hasTable: boolean;
    /** True if the blog contains code blocks (highlight.js / lowlight) */
    hasCode: boolean;
    /** True if the blog contains image nodes */
    hasImage: boolean;
    /** True if the blog contains Lottie animation nodes (~800 KB) */
    hasLottie: boolean;
    /**
     * Composite heaviness score (0–100).
     * Higher = more heavy plugins are active in this content.
     * Use to decide whether to preload extra plugins on editor open.
     */
    pluginLoadScore: number;
    /** Set of all node types found in the content */
    nodeTypes: Set<string>;
    /** Total number of nodes (used as a rough content length proxy) */
    nodeCount: number;
};

/** Plate element node type strings for HyperBlog's plugin set */
const NODE_TYPES = {
    excalidraw:     'excalidraw',
    equation:       'equation',
    inlineEquation: 'inline_equation',
    mediaEmbed:     'media_embed',
    video:          'video',
    table:          'table',
    codeBlock:      'code_block',
    image:          'img',
    lottie:         'lottie',
} as const;

/** Weight each heavy node type contributes to the pluginLoadScore */
const SCORE_WEIGHTS: Record<string, number> = {
    [NODE_TYPES.excalidraw]:     40,
    [NODE_TYPES.equation]:       20,
    [NODE_TYPES.inlineEquation]: 15,
    [NODE_TYPES.mediaEmbed]:     15,
    [NODE_TYPES.video]:          15,
    [NODE_TYPES.table]:          10,
    [NODE_TYPES.codeBlock]:       5,
    [NODE_TYPES.lottie]:         30,
};

/**
 * Recursively collect all node types from a Plate content tree.
 * Handles nested children (tables, lists, etc.).
 */
function collectNodeTypes(nodes: any[], result: Set<string>): void {
    for (const node of nodes) {
        if (node.type) result.add(node.type);
        if (Array.isArray(node.children)) {
            collectNodeTypes(node.children, result);
        }
    }
}

/**
 * Produces a content fingerprint from the current Plate editor node tree.
 *
 * @param nodes - Top-level children from the Plate editor value
 *                (e.g. `editor.children` or the serialised blog JSON)
 * @returns ContentSignals describing what heavy features the blog uses
 *
 * @example
 * // In a blog save handler:
 * const fp = fingerprintContent(editor.children);
 * posthog?.capture('blog_content_saved', {
 *   ...fp,
 *   nodeTypes: [...fp.nodeTypes], // serialise Set for PostHog
 * });
 *
 * @example
 * // Drive plugin loading decisions:
 * const { hasExcalidraw, hasMath } = fingerprintContent(content);
 * const plugins = resolvePlugins(fp.nodeTypes);
 */
export function fingerprintContent(nodes: any[]): ContentSignals {
    const nodeTypes = new Set<string>();
    collectNodeTypes(nodes, nodeTypes);

    const has = (type: string) => nodeTypes.has(type);

    const hasExcalidraw  = has(NODE_TYPES.excalidraw);
    const hasMath        = has(NODE_TYPES.equation) || has(NODE_TYPES.inlineEquation);
    const hasVideo       = has(NODE_TYPES.mediaEmbed) || has(NODE_TYPES.video);
    const hasTable       = has(NODE_TYPES.table);
    const hasCode        = has(NODE_TYPES.codeBlock);
    const hasImage       = has(NODE_TYPES.image);
    const hasLottie      = has(NODE_TYPES.lottie);

    // Score capped at 100
    const pluginLoadScore = Math.min(
        100,
        [...nodeTypes].reduce((sum, type) => sum + (SCORE_WEIGHTS[type] ?? 0), 0)
    );

    return {
        hasExcalidraw,
        hasMath,
        hasVideo,
        hasTable,
        hasCode,
        hasImage,
        hasLottie,
        pluginLoadScore,
        nodeTypes,
        nodeCount: nodes.length,
    };
}

/**
 * Returns a serialisable (JSON-safe) version of ContentSignals
 * suitable for sending to PostHog or storing in localStorage.
 */
export function serializeFingerprint(signals: ContentSignals): Omit<ContentSignals, 'nodeTypes'> & { nodeTypes: string[] } {
    return {
        ...signals,
        nodeTypes: [...signals.nodeTypes],
    };
}
