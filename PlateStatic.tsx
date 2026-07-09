// 'use client';
import React from 'react';
import { PlateStatic } from '@udecode/plate';
import { createSlateEditor } from '@udecode/plate';
import '@/utils/fix-accessibility';
import { viewComponents } from '@/hooks/use-create-editor';

// Import all necessary plugins for your custom content types
import { basicNodesPlugins } from '@/components/editor/plugins/basic-nodes-plugins';
import { ParagraphPlugin } from '@udecode/plate/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { HeadingPlugin } from '@udecode/plate-heading/react';
import { ListPlugin } from '@udecode/plate-list/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import { ImagePlugin } from '@udecode/plate-media/react';
import { TablePlugin } from '@udecode/plate-table/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { ColumnItemPlugin, ColumnPlugin } from '@udecode/plate-layout/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { MentionPlugin } from '@udecode/plate-mention/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { TocPlugin } from '@udecode/plate-heading/react';

// Import your custom plugins
import { bannerPlugin } from '@/components/editor/Banner/banner-plugin';
import { pollPlugin } from '@/components/editor/Poll/poll-plugin';
import { infographPlugin } from '@/components/editor/Infograph/infograph-plugin';
import { leadMagnetPlugin } from '@/components/editor/LeadMagnet/lead-magnet-plugin';
import { faqPlugin } from '@/components/editor/FAQ/faq-plugin';

// Debug imports
console.log('viewComponents imported:', viewComponents);

interface BlogContentProps {
    content?: any[];
}

const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
    console.log('content in blog content', content);
    
    // Use the content prop with fallback
    const safeContent = content || [
        { type: 'p', children: [{ text: 'No content available.' }] }
    ];
    
    // Create a minimal plugins array for static rendering
    const minimalPlugins = [
        ...basicNodesPlugins,
        ParagraphPlugin,
        BlockquotePlugin,
        CodeBlockPlugin,
        HeadingPlugin,
        ListPlugin,
        LinkPlugin,
        ImagePlugin,
        TablePlugin,
    ];
    
    // Create a static editor instance for rendering
    const staticEditor = createSlateEditor({
        plugins: minimalPlugins,
        value: safeContent,
    });
    // Fallback components if viewComponents is undefined
    const safeComponents = viewComponents || {};
    
    return (
        <div className="w-full">
            <PlateStatic
                editor={staticEditor}
                components={safeComponents}
                value={safeContent}
            />
        </div>
    );
};

export default BlogContent;
