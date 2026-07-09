'use client';

import { withProps } from '@udecode/cn';
import { BoldPlugin, ItalicPlugin, StrikethroughPlugin, UnderlinePlugin } from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin, CodeLinePlugin, CodeSyntaxPlugin } from '@udecode/plate-code-block/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import { TablePlugin, TableRowPlugin, TableCellPlugin, TableCellHeaderPlugin } from '@udecode/plate-table/react';
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { ColumnPlugin } from '@udecode/plate-layout/react';
import { ParagraphPlugin, PlateLeaf } from '@udecode/plate/react';

// Import your custom components
import { BannerElement } from '@/components/editor/Banner';
import { PollElement } from '@/components/editor/Poll';
import { InfographElement } from '@/components/editor/Infograph';
import LeadMagnetElement from '@/components/editor/LeadMagnet';
import { FAQElement } from '@/components/editor/FAQ';
import { YoutubeVideoElement } from '@/components/editor/YoutubeVideo';
import { ToggleElement } from '@/components/plate-ui/toggle-element';
import { ColumnGroupElement } from '@/components/plate-ui/column-group-element';
import { ColumnElement } from '@/components/plate-ui/column-element';
import { DateElement } from '@/components/plate-ui/date-element';
import { ImageElement } from '@/components/plate-ui/image-element';
import { MediaEmbedElement } from '@/components/plate-ui/media-embed-element';

// Import basic UI components
import { BlockquoteElement } from '@/components/plate-ui/blockquote-element';
import { CodeBlockElement } from '@/components/plate-ui/code-block-element';
import { CodeLineElement } from '@/components/plate-ui/code-line-element';
import { CodeSyntaxLeaf } from '@/components/plate-ui/code-syntax-leaf';
import { HeadingElement } from '@/components/plate-ui/heading-element';
import { HeadingElementH1AsDiv } from '@/components/plate-ui/heading-element-h1-as-div';
import { HrElement } from '@/components/plate-ui/hr-element';
import { LinkElement } from '@/components/plate-ui/link-element';
import { ParagraphElement } from '@/components/plate-ui/paragraph-element';
import { TableElement } from '@/components/plate-ui/table-element';
import { TableRowElement } from '@/components/plate-ui/table-row-element';
import { TableCellElement, TableCellHeaderElement } from '@/components/plate-ui/table-cell-element';

// Import plugin keys
import { bannerPlugin } from '../Banner/banner-plugin';
import { pollPlugin } from '../Poll/poll-plugin';
import { infographPlugin } from '../Infograph/infograph-plugin';
import { leadMagnetPlugin } from '../LeadMagnet/lead-magnet-plugin';
import { faqPlugin } from '../FAQ/faq-plugin';
import { youtubeVideoPlugin } from '@/components/editor/YoutubeVideo/youtube-video-plugin';

// Minimal view components - only what's needed for rendering
export const minimalViewComponents = {
  // Basic text elements
  [ParagraphPlugin.key]: ParagraphElement,
  [HEADING_KEYS.h1]: HeadingElementH1AsDiv,
  [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
  [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
  [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
  [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
  [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
  [BlockquotePlugin.key]: BlockquoteElement,
  
  // Text formatting
  [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
  [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
  [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
  [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
  
  // Code
  [CodeBlockPlugin.key]: CodeBlockElement,
  [CodeLinePlugin.key]: CodeLineElement,
  [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
  
  // Links
  [LinkPlugin.key]: LinkElement,
  
  // Horizontal rule
  [HorizontalRulePlugin.key]: HrElement,

  // Table
  [TablePlugin.key]: TableElement,
  [TableRowPlugin.key]: TableRowElement,
  [TableCellPlugin.key]: TableCellElement,
  [TableCellHeaderPlugin.key]: TableCellHeaderElement,
};

// Extended view components that include your custom content types
export const extendedViewComponents = {
  ...minimalViewComponents,
  [bannerPlugin.key]: BannerElement,
  [pollPlugin.key]: PollElement,
  [infographPlugin.key]: InfographElement,
  [leadMagnetPlugin.key]: LeadMagnetElement,
  [faqPlugin.key]: FAQElement,
  [youtubeVideoPlugin.key]: YoutubeVideoElement,
  [TogglePlugin.key]: ToggleElement,
  [ColumnPlugin.key]: ColumnGroupElement,
  [DatePlugin.key]: DateElement,
  [ImagePlugin.key]: ImageElement,
  [MediaEmbedPlugin.key]: MediaEmbedElement,
  column: ColumnElement,
};
