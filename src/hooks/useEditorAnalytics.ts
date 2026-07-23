import { useCallback } from 'react';

/**
 * Typed PostHog events for the Plate editor.
 * Add new event names here to keep tracking consistent across components.
 */
export type EditorEvent =
    | 'editor_plugin_loaded'
    | 'editor_excalidraw_opened'
    | 'editor_math_used'
    | 'editor_ai_triggered'
    | 'editor_export_clicked'
    | 'editor_image_uploaded'
    | 'editor_table_inserted'
    | 'editor_code_block_inserted'
    | 'editor_blog_published'
    | 'editor_blog_saved';

/**
 * Hook that returns a stable `track` function for editor-level PostHog events.
 *
 * PostHog is always accessed via (window as any).posthog so this hook works
 * safely even before PostHog has been initialised — events are silently no-ops
 * until the library loads.
 *
 * @example
 * const { track } = useEditorAnalytics();
 * track('editor_excalidraw_opened', { blogId: blog.id });
 */
export function useEditorAnalytics() {
    const track = useCallback(
        (event: EditorEvent, props?: Record<string, unknown>) => {
            try {
                const ph = (window as any).posthog;
                ph?.capture(event, {
                    timestamp: Date.now(),
                    ...props,
                });
            } catch {
                // Never let analytics crash the editor
            }
        },
        []
    );

    return { track };
}
