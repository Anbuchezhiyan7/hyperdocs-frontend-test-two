'use client';

import emojiMartData from '@emoji-mart/data';
import { CalloutPlugin } from '@udecode/plate-callout/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { DocxPlugin } from '@udecode/plate-docx';
import { EmojiPlugin } from '@udecode/plate-emoji/react';
import {
    FontBackgroundColorPlugin,
    FontColorPlugin,
    FontSizePlugin,
} from '@udecode/plate-font/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { JuicePlugin } from '@udecode/plate-juice';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { ColumnPlugin } from '@udecode/plate-layout/react';
import { SlashPlugin } from '@udecode/plate-slash-command/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';
import { ListPlugin, TodoListPlugin } from '@udecode/plate-list/react';

import { FloatingToolbarPlugin } from '@/components/editor/plugins/floating-toolbar-plugin';
import { BlockDiscussion } from '@/components/plate-ui/block-discussion';
import { SuggestionBelowNodes } from '@/components/plate-ui/suggestion-line-break';

import { alignPlugin } from './align-plugin';
import { autoformatPlugin } from './autoformat-plugin';
import { basicNodesPlugins } from './basic-nodes-plugins';
import { commentsPlugin } from './comments-plugin';
import { cursorOverlayPlugin } from './cursor-overlay-plugin';
import { deletePlugins } from './delete-plugins';
import { dndPlugins } from './dnd-plugins';
import { equationPlugins } from './equation-plugins';
import { exitBreakPlugin } from './exit-break-plugin';
import { indentListPlugins } from './indent-list-plugins';
import { lineHeightPlugin } from './line-height-plugin';
import { linkPlugin } from './link-plugin';
import { markdownPlugin } from './markdown-plugin';
import { mediaPlugins } from './media-plugins';
import { mentionPlugin } from './mention-plugin';
import { resetBlockTypePlugin } from './reset-block-type-plugin';
import { skipMarkPlugin } from './skip-mark-plugin';
import { softBreakPlugin } from './soft-break-plugin';
import { suggestionPlugin } from './suggestion-plugin';
import { tablePlugin } from './table-plugin';
import { tocPlugin } from './toc-plugin';
import { bannerPlugin } from '../Banner/banner-plugin';
import { pollPlugin } from '../Poll/poll-plugin';
import { infographPlugin } from '../Infograph/infograph-plugin';
import { NormalizeTypesPlugin } from '@udecode/plate-normalizers';
import { useAppStore } from '@/store/useAppStore';
import { blockMenuPlugins } from './block-menu-plugins';
import { leadMagnetPlugin } from '../LeadMagnet/lead-magnet-plugin';
import { faqPlugin } from '../FAQ/faq-plugin';
import { youtubeVideoPlugin } from '@/components/editor/YoutubeVideo/youtube-video-plugin';
import { pasteCleanupPlugin } from './paste-cleanup-plugin';
export const viewPlugins = [
    ...basicNodesPlugins,
    HorizontalRulePlugin,
    linkPlugin,
    DatePlugin,
    mentionPlugin,
    tablePlugin,
    ListPlugin,
    TodoListPlugin,
    TogglePlugin,
    tocPlugin,
    ...mediaPlugins,
    ...equationPlugins,
    CalloutPlugin,
    ColumnPlugin,

    // Marks
    FontColorPlugin,
    FontBackgroundColorPlugin,
    FontSizePlugin,
    HighlightPlugin,
    KbdPlugin,
    skipMarkPlugin,

    // Block Style
    alignPlugin,
    ...indentListPlugins,
    lineHeightPlugin,

    // Collaboration
    commentsPlugin.configure({
        render: { aboveNodes: BlockDiscussion as any },
    }),
    suggestionPlugin.configure({
        render: { belowNodes: SuggestionBelowNodes as any },
    }),
] as const;

export const editorPlugins = (isReadonly?: boolean) => [
    // AI
    NormalizeTypesPlugin.configure({
        options: isReadonly
            ? undefined
            : {
                  rules: [{ path: [0], strictType: 'h1' }],
              },
        handlers: {
            onChange: (editor: any) => {
                useAppStore
                    .getState()
                    .handleBlogFieldChange('blog_title', editor.value[0].children[0].text);
            },
        },
    }),
    // ...aiPlugins,

    // Nodes
    ...viewPlugins,

    // Functionality
    SlashPlugin.extend({
        options: {
            triggerQuery (editor) {
                return !editor.api.some({
                    match: { type: editor.getType(CodeBlockPlugin) },
                });
            },
        },
    }),
    autoformatPlugin,
    cursorOverlayPlugin,
    ...blockMenuPlugins,
    // Only include DnD plugins when not in read-only mode
    ...(isReadonly ? [] : dndPlugins),
    EmojiPlugin.configure({ options: { data: emojiMartData as any } }),
    exitBreakPlugin,
    resetBlockTypePlugin,
    ...deletePlugins,
    softBreakPlugin,
    TrailingBlockPlugin,

    // Deserialization
    DocxPlugin,
    markdownPlugin,
    JuicePlugin,

    // UI
    FloatingToolbarPlugin,
    // Custom
    bannerPlugin,
    pollPlugin,
    infographPlugin,
    leadMagnetPlugin,
    faqPlugin,
    youtubeVideoPlugin,

    // Must be last so it is the outermost insertData wrapper and intercepts
    // Word paste before any other deserialization plugin sees it.
    pasteCleanupPlugin,
];
