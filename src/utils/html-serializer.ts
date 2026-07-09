import { serializeHtml, createSlateEditor } from '@udecode/plate';

// Custom plugin keys
const CUSTOM_PLUGIN_KEYS = {
    BANNER: 'banner',
    POLL: 'poll',
    INFOGRAPH: 'infograph',
    LEAD_MAGNET: 'lead_magnet',
    FAQ: 'faq'
} as const;

/**
 * Serializes blog content to HTML with comprehensive plugin support
 * @param content - The blog content array from Slate editor
 * @returns Promise<string> - The serialized HTML content
 */
export const serializeBlogToHTML = async (content: any[]): Promise<string> => {
    try {
        // Import all the plugins that the editor uses
        const { BaseParagraphPlugin } = await import('@udecode/plate');
        const { BaseHeadingPlugin } = await import('@udecode/plate-heading');
        const { 
            BaseBoldPlugin, 
            BaseItalicPlugin, 
            BaseCodePlugin, 
            BaseStrikethroughPlugin, 
            BaseSubscriptPlugin, 
            BaseSuperscriptPlugin, 
            BaseUnderlinePlugin 
        } = await import('@udecode/plate-basic-marks');
        const { BaseLinkPlugin } = await import('@udecode/plate-link');
        const { 
            BaseImagePlugin, 
            BaseAudioPlugin, 
            BaseVideoPlugin, 
            BaseMediaEmbedPlugin, 
            BaseFilePlugin 
        } = await import('@udecode/plate-media');
        const { BaseListPlugin } = await import('@udecode/plate-list');
        const { BaseBlockquotePlugin } = await import('@udecode/plate-block-quote');
        const { 
            BaseCodeBlockPlugin, 
            BaseCodeLinePlugin, 
            BaseCodeSyntaxPlugin 
        } = await import('@udecode/plate-code-block');
        const { 
            BaseTablePlugin, 
            BaseTableRowPlugin, 
            BaseTableCellPlugin, 
            BaseTableCellHeaderPlugin 
        } = await import('@udecode/plate-table');
        const { BaseHorizontalRulePlugin } = await import('@udecode/plate-horizontal-rule');
        const { BaseTogglePlugin } = await import('@udecode/plate-toggle');
        const { BaseTocPlugin } = await import('@udecode/plate-heading');
        const { BaseHighlightPlugin } = await import('@udecode/plate-highlight');
        const { BaseKbdPlugin } = await import('@udecode/plate-kbd');
        const { 
            BaseFontColorPlugin, 
            BaseFontBackgroundColorPlugin, 
            BaseFontSizePlugin 
        } = await import('@udecode/plate-font');
        const { BaseAlignPlugin } = await import('@udecode/plate-alignment');
        const { BaseLineHeightPlugin } = await import('@udecode/plate-line-height');
        const { BaseIndentPlugin } = await import('@udecode/plate-indent');
        const { BaseIndentListPlugin } = await import('@udecode/plate-indent-list');
        const { BaseMentionPlugin } = await import('@udecode/plate-mention');
        const { BaseDatePlugin } = await import('@udecode/plate-date');
        const { BaseCalloutPlugin } = await import('@udecode/plate-callout');
        const { BaseColumnPlugin, BaseColumnItemPlugin } = await import('@udecode/plate-layout');
        const { BaseEquationPlugin, BaseInlineEquationPlugin } = await import('@udecode/plate-math');
        const { BaseExcalidrawPlugin } = await import('@udecode/plate-excalidraw');
        const { BaseEmojiPlugin } = await import('@udecode/plate-emoji');
        const { BaseCommentsPlugin } = await import('@udecode/plate-comments');
        const { BaseSuggestionPlugin } = await import('@udecode/plate-suggestion');
        const { BaseSlashPlugin } = await import('@udecode/plate-slash-command');

        // Create a comprehensive static editor with all plugins
        const staticEditor = createSlateEditor({
            plugins: [
                // Basic elements
                BaseParagraphPlugin,
                BaseHeadingPlugin,
                BaseBlockquotePlugin,
                BaseCodeBlockPlugin,
                BaseCodeLinePlugin,
                BaseCodeSyntaxPlugin,
                BaseHorizontalRulePlugin,
                BaseCalloutPlugin,
                BaseColumnPlugin,
                BaseColumnItemPlugin,
                
                // Basic marks
                BaseBoldPlugin,
                BaseItalicPlugin,
                BaseCodePlugin,
                BaseStrikethroughPlugin,
                BaseSubscriptPlugin,
                BaseSuperscriptPlugin,
                BaseUnderlinePlugin,
                BaseHighlightPlugin,
                BaseKbdPlugin,
                
                // Media
                BaseImagePlugin,
                BaseAudioPlugin,
                BaseVideoPlugin,
                BaseMediaEmbedPlugin,
                BaseFilePlugin,
                
                // Lists and indentation
                BaseListPlugin,
                BaseIndentPlugin,
                BaseIndentListPlugin,
                
                // Tables
                BaseTablePlugin,
                BaseTableRowPlugin,
                BaseTableCellPlugin,
                BaseTableCellHeaderPlugin,
                
                // Interactive elements
                BaseLinkPlugin,
                BaseMentionPlugin,
                BaseTogglePlugin,
                BaseTocPlugin,
                BaseDatePlugin,
                BaseEquationPlugin,
                BaseInlineEquationPlugin,
                BaseExcalidrawPlugin,
                BaseEmojiPlugin,
                BaseCommentsPlugin,
                BaseSuggestionPlugin,
                BaseSlashPlugin,
                
                // Styling
                BaseFontColorPlugin,
                BaseFontBackgroundColorPlugin,
                BaseFontSizePlugin,
                BaseAlignPlugin,
                BaseLineHeightPlugin,
            ],
            value: content || [],
        });

        // Serialize the blog content to HTML with all plugins
        const html = await serializeHtml(staticEditor, {
            components: {}, // Use default components for now
        });

        // Apply custom serialization for custom plugins
        const customSerializedHtml = await serializeCustomPlugins(html, content);

        return customSerializedHtml;
    } catch (error) {
        console.error('Error serializing HTML:', error);
        return '';
    }
};

/**
 * Custom serialization for custom plugins
 * @param html - The base HTML from serializeHtml
 * @param content - The original Slate content
 * @returns Promise<string> - HTML with custom plugins serialized
 */
const serializeCustomPlugins = async (html: string, content: any[]): Promise<string> => {
    try {
        let serializedHtml = html;
        
        // Process each custom plugin type
        for (const element of content) {
            if (element.type === CUSTOM_PLUGIN_KEYS.BANNER) {
                serializedHtml = await serializeBannerPlugin(serializedHtml, element);
            } else if (element.type === CUSTOM_PLUGIN_KEYS.POLL) {
                serializedHtml = await serializePollPlugin(serializedHtml, element);
            } else if (element.type === CUSTOM_PLUGIN_KEYS.INFOGRAPH) {
                serializedHtml = await serializeInfographPlugin(serializedHtml, element);
            } else if (element.type === CUSTOM_PLUGIN_KEYS.LEAD_MAGNET) {
                serializedHtml = await serializeLeadMagnetPlugin(serializedHtml, element);
            } else if (element.type === CUSTOM_PLUGIN_KEYS.FAQ) {
                serializedHtml = await serializeFAQPlugin(serializedHtml, element);
            }
        }
        
        return serializedHtml;
    } catch (error) {
        console.error('Error serializing custom plugins:', error);
        return html; // Return original HTML if custom serialization fails
    }
};

/**
 * Serialize Banner plugin to HTML
 */
const serializeBannerPlugin = async (html: string, element: any): Promise<string> => {
    try {
        // Create a placeholder for banner content
        const bannerHtml = `
            <div class="slate-banner" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2rem;
                border-radius: 0.75rem;
                margin: 1.5rem 0;
                text-align: center;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            ">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.5rem; font-weight: 600;">
                    🖼️ Banner Content
                </h3>
                <p style="margin: 0; opacity: 0.9;">
                    Banner ID: ${element.plugin_data_id || 'N/A'}
                </p>
            </div>
        `;
        
        // Replace the banner element in the HTML
        return html.replace(
            /<div[^>]*data-slate-type="banner"[^>]*>[\s\S]*?<\/div>/g,
            bannerHtml
        );
    } catch (error) {
        console.error('Error serializing banner plugin:', error);
        return html;
    }
};

/**
 * Serialize Poll plugin to HTML
 */
const serializePollPlugin = async (html: string, element: any): Promise<string> => {
    try {
        const pollHtml = `
            <div class="slate-poll" style="
                background: #f8fafc;
                border: 2px solid #e2e8f0;
                border-radius: 0.75rem;
                padding: 1.5rem;
                margin: 1.5rem 0;
            ">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.25rem; font-weight: 600; color: #1e293b;">
                    📊 Poll
                </h3>
                <p style="margin: 0; color: #64748b;">
                    Poll ID: ${element.plugin_data_id || 'N/A'}
                </p>
                <div style="margin-top: 1rem; padding: 1rem; background: white; border-radius: 0.5rem;">
                    <p style="margin: 0; font-style: italic; color: #94a3b8;">
                        Poll content would be displayed here
                    </p>
                </div>
            </div>
        `;
        
        return html.replace(
            /<div[^>]*data-slate-type="poll"[^>]*>[\s\S]*?<\/div>/g,
            pollHtml
        );
    } catch (error) {
        console.error('Error serializing poll plugin:', error);
        return html;
    }
};

/**
 * Serialize Infograph plugin to HTML
 */
const serializeInfographPlugin = async (html: string, element: any): Promise<string> => {
    try {
        const infographHtml = `
            <div class="slate-infograph" style="
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                padding: 2rem;
                border-radius: 0.75rem;
                margin: 1.5rem 0;
                text-align: center;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            ">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.5rem; font-weight: 600;">
                    📈 Infographic
                </h3>
                <p style="margin: 0; opacity: 0.9;">
                    Infograph ID: ${element.plugin_data_id || 'N/A'}
                </p>
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.1); border-radius: 0.5rem;">
                    <p style="margin: 0; font-style: italic;">
                        Infographic content would be displayed here
                    </p>
                </div>
            </div>
        `;
        
        return html.replace(
            /<div[^>]*data-slate-type="infograph"[^>]*>[\s\S]*?<\/div>/g,
            infographHtml
        );
    } catch (error) {
        console.error('Error serializing infograph plugin:', error);
        return html;
    }
};

/**
 * Serialize Lead Magnet plugin to HTML
 */
const serializeLeadMagnetPlugin = async (html: string, element: any): Promise<string> => {
    try {
        const leadMagnetHtml = `
            <div class="slate-lead-magnet" style="
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                color: white;
                padding: 2rem;
                border-radius: 0.75rem;
                margin: 1.5rem 0;
                text-align: center;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            ">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.5rem; font-weight: 600;">
                    🎯 Lead Magnet
                </h3>
                <p style="margin: 0; opacity: 0.9;">
                    Lead Magnet ID: ${element.plugin_data_id || 'N/A'}
                </p>
                <div style="margin-top: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.1); border-radius: 0.5rem;">
                    <p style="margin: 0; font-style: italic;">
                        Lead magnet content would be displayed here
                    </p>
                </div>
            </div>
        `;
        
        return html.replace(
            /<div[^>]*data-slate-type="lead_magnet"[^>]*>[\s\S]*?<\/div>/g,
            leadMagnetHtml
        );
    } catch (error) {
        console.error('Error serializing lead magnet plugin:', error);
        return html;
    }
};

/**
 * Serialize FAQ plugin to HTML
 */
const serializeFAQPlugin = async (html: string, element: any): Promise<string> => {
    try {
        const faqHtml = `
            <div class="slate-faq" style="
                background: #fefefe;
                border: 2px solid #e5e7eb;
                border-radius: 0.75rem;
                padding: 1.5rem;
                margin: 1.5rem 0;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            ">
                <h3 style="margin: 0 0 1rem 0; font-size: 1.25rem; font-weight: 600; color: #1e293b;">
                    ❓ FAQ
                </h3>
                <p style="margin: 0; color: #64748b;">
                    FAQ ID: ${element.plugin_data_id || 'N/A'}
                </p>
                <div style="margin-top: 1rem; padding: 1rem; background: #f9fafb; border-radius: 0.5rem;">
                    <p style="margin: 0; font-style: italic; color: #6b7280;">
                        FAQ content would be displayed here
                    </p>
                </div>
            </div>
        `;
        
        return html.replace(
            /<div[^>]*data-slate-type="faq"[^>]*>[\s\S]*?<\/div>/g,
            faqHtml
        );
    } catch (error) {
        console.error('Error serializing FAQ plugin:', error);
        return html;
    }
};

/**
 * Creates styled HTML for publishing (with inline styles)
 * @param content - The blog content array
 * @returns Promise<string> - Styled HTML content
 */
export const createStyledHTMLForPublish = async (content: any[]): Promise<string> => {
    const html = await serializeBlogToHTML(content);
    
    // Return styled HTML for publishing with basic inline styles
    return `<div class="slate-editor" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
        ${html}
    </div>`;
};

/**
 * Creates a complete HTML document with full CSS styling for export
 * @param content - The blog content array
 * @param title - The blog title
 * @returns Promise<string> - Complete HTML document
 */
export const createCompleteHTMLDocument = async (content: any[], title: string = 'Blog'): Promise<string> => {
    const html = await serializeBlogToHTML(content);
    
    // Create a complete HTML document with comprehensive CSS styles
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
     
    </style>
</head>
<body>
    <div class="slate-editor">
        ${html}
    </div>
</body>
</html>`;
};

/**
 * Downloads HTML content as a file
 * @param html - The HTML content to download
 * @param filename - The filename for the download
 */
export const downloadHTMLFile = (html: string, filename: string): void => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
