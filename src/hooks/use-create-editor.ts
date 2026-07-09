'use client';

import type { Value } from '@udecode/plate';

import { withProps } from '@udecode/cn';
import { AIPlugin } from '@udecode/plate-ai/react';
import {
    BoldPlugin,
    CodePlugin,
    ItalicPlugin,
    StrikethroughPlugin,
    SubscriptPlugin,
    SuperscriptPlugin,
    UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin, CodeLinePlugin, CodeSyntaxPlugin } from '@udecode/plate-code-block/react';
import { CommentsPlugin } from '@udecode/plate-comments/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { EmojiInputPlugin } from '@udecode/plate-emoji/react';
import { ExcalidrawPlugin } from '@udecode/plate-excalidraw/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { ColumnItemPlugin, ColumnPlugin } from '@udecode/plate-layout/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import { EquationPlugin, InlineEquationPlugin } from '@udecode/plate-math/react';
import {
    AudioPlugin,
    FilePlugin,
    ImagePlugin,
    MediaEmbedPlugin,
    PlaceholderPlugin,
    VideoPlugin,
} from '@udecode/plate-media/react';
import { MentionInputPlugin, MentionPlugin } from '@udecode/plate-mention/react';
import { SlashInputPlugin } from '@udecode/plate-slash-command/react';
import { SuggestionPlugin } from '@udecode/plate-suggestion/react';
import {
    TableCellHeaderPlugin,
    TableCellPlugin,
    TablePlugin,
    TableRowPlugin,
} from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import {
    type CreatePlateEditorOptions,
    ParagraphPlugin,
    PlateLeaf,
    usePlateEditor,
} from '@udecode/plate/react';

import { AILeaf } from '@/components/plate-ui/ai-leaf';
import { BlockquoteElement } from '@/components/plate-ui/blockquote-element';
import { CodeBlockElement } from '@/components/plate-ui/code-block-element';
import { CodeLeaf } from '@/components/plate-ui/code-leaf';
import { CodeLineElement } from '@/components/plate-ui/code-line-element';
import { CodeSyntaxLeaf } from '@/components/plate-ui/code-syntax-leaf';
import { ColumnElement } from '@/components/plate-ui/column-element';
import { ColumnGroupElement } from '@/components/plate-ui/column-group-element';
import { DateElement } from '@/components/plate-ui/date-element';
import { EmojiInputElement } from '@/components/plate-ui/emoji-input-element';
import { EquationElement } from '@/components/plate-ui/equation-element';
import { HeadingElement } from '@/components/plate-ui/heading-element';
import { HrElement } from '@/components/plate-ui/hr-element';
import { InlineEquationElement } from '@/components/plate-ui/inline-equation-element';
import { LinkElement } from '@/components/plate-ui/link-element';
import { MentionInputElement } from '@/components/plate-ui/mention-input-element';
import { ParagraphElement } from '@/components/plate-ui/paragraph-element';
import { TocElement } from '@/components/plate-ui/toc-element';
import { ToggleElement } from '@/components/plate-ui/toggle-element';
import { MediaAudioElement } from '@/components/plate-ui/media-audio-element';
import { MediaEmbedElement } from '@/components/plate-ui/media-embed-element';
import { MediaPlaceholderElement } from '@/components/plate-ui/media-placeholder-element';
import { CommentLeaf } from '@/components/plate-ui/comment-leaf';
import { ExcalidrawElement } from '@/components/plate-ui/excalidraw-element';
import { TableRowElement } from '@/components/plate-ui/table-row-element';
import { MediaVideoElement } from '@/components/plate-ui/media-video-element';
import { TableCellElement } from '@/components/plate-ui/table-cell-element';
import { TableElement } from '@/components/plate-ui/table-element';
import { TableCellHeaderElement } from '@/components/plate-ui/table-cell-element';
import { MediaFileElement } from '@/components/plate-ui/media-file-element';
import { HighlightLeaf } from '@/components/plate-ui/highlight-leaf';
import { ImageElement } from '@/components/plate-ui/image-element';
import { KbdLeaf } from '@/components/plate-ui/kbd-leaf';
import { MentionElement } from '@/components/plate-ui/mention-element';
import { SuggestionLeaf } from '@/components/plate-ui/suggestion-leaf';
import { SlashInputElement } from '@/components/plate-ui/slash-input-element';
import { withPlaceholders } from '@/components/plate-ui/placeholder';
import { BannerElement } from '@/components/editor/Banner';
import { bannerPlugin } from '@/components/editor/Banner/banner-plugin';
import { pollPlugin } from '@/components/editor/Poll/poll-plugin';
import { PollElement } from '@/components/editor/Poll';
import { InfographElement } from '@/components/editor/Infograph';
import { infographPlugin } from '@/components/editor/Infograph/infograph-plugin';
import { FloatingToolbarPlugin } from '@/components/editor/plugins/floating-toolbar-plugin';
import { editorPlugins } from '@/components/editor/plugins/editor-plugins';

export const viewComponents = {
    [AudioPlugin.key]: MediaAudioElement,
    [BlockquotePlugin.key]: BlockquoteElement,
    [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
    [CodeBlockPlugin.key]: CodeBlockElement,
    [CodeLinePlugin.key]: CodeLineElement,
    [CodePlugin.key]: CodeLeaf,
    [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
    [ColumnItemPlugin.key]: ColumnElement,
    [ColumnPlugin.key]: ColumnGroupElement,
    [CommentsPlugin.key]: CommentLeaf,
    [DatePlugin.key]: DateElement,
    [EquationPlugin.key]: EquationElement,
    [ExcalidrawPlugin.key]: ExcalidrawElement,
    [FilePlugin.key]: MediaFileElement,
    [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h2' }),
    [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
    [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
    [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
    [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
    [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
    [HighlightPlugin.key]: HighlightLeaf,
    [HorizontalRulePlugin.key]: HrElement,
    [ImagePlugin.key]: ImageElement,
    [InlineEquationPlugin.key]: InlineEquationElement,
    [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
    [KbdPlugin.key]: KbdLeaf,
    [LinkPlugin.key]: LinkElement,
    [MediaEmbedPlugin.key]: MediaEmbedElement,
    [MentionPlugin.key]: MentionElement,
    [ParagraphPlugin.key]: ParagraphElement,
    [PlaceholderPlugin.key]: MediaPlaceholderElement,
    [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
    [SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
    [SuggestionPlugin.key]: SuggestionLeaf,
    [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
    [TableCellHeaderPlugin.key]: TableCellHeaderElement,
    [TableCellPlugin.key]: TableCellElement,
    [TablePlugin.key]: TableElement,
    [TableRowPlugin.key]: TableRowElement,
    [TocPlugin.key]: TocElement,
    [TogglePlugin.key]: ToggleElement,
    [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
    [VideoPlugin.key]: MediaVideoElement,
};

export const editorComponents = {
    ...viewComponents,
    [AIPlugin.key]: AILeaf,
    [EmojiInputPlugin.key]: EmojiInputElement,
    [MentionInputPlugin.key]: MentionInputElement,
    [SlashInputPlugin.key]: SlashInputElement,
    [bannerPlugin.key]: BannerElement,
    [pollPlugin.key]: PollElement,
    [infographPlugin.key]: InfographElement,
};



export const useCreateEditor = (
    {
        components,
        override,
        readOnly,
        ...options
    }: {
        components?: Record<string, any>;
        plugins?: any[];
        readOnly?: boolean;
    } & Omit<CreatePlateEditorOptions, 'plugins'> = {},
    deps: any[] = []
) => {
    // Call usePlateEditor at the top level of the hook (Rules of Hooks compliance)
    return usePlateEditor<Value>(
        {
            override: {
                components: {
                    ...(readOnly ? viewComponents : withPlaceholders(editorComponents)),
                    ...components,
                },
                ...override,
            },
            plugins: [
                // ...copilotPlugins,
                ...editorPlugins(readOnly),
                FloatingToolbarPlugin,
            ],

            ...options,
        },
        deps
    );
};
