'use client';

import dynamic from 'next/dynamic';
import { BasicMarksPlugin } from '@udecode/plate-basic-marks/react';  
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { HeadingPlugin } from '@udecode/plate-heading/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import { TablePlugin } from '@udecode/plate-table/react';
import { ParagraphPlugin } from '@udecode/plate/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { ColumnPlugin } from '@udecode/plate-layout/react';
import { mediaPlugins } from './media-plugins';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  FontSizePlugin,
} from '@udecode/plate-font/react';
import { common, createLowlight } from 'lowlight';

// Only import common languages instead of all languages
const lowlight = createLowlight(common);

// Minimal plugins for view-only mode - only what's needed for rendering
export const minimalViewPlugins = [
  // Core text elements
  ParagraphPlugin,
  HeadingPlugin.configure({ options: { levels: 6 } }),
  BlockquotePlugin,
  
  // Text formatting
  BasicMarksPlugin, // Bold, italic, underline, strikethrough, etc.
  
  // Code
  CodeBlockPlugin.configure({ options: { lowlight } }),
  
  // Links
  LinkPlugin,
  
  // Horizontal rule
  HorizontalRulePlugin,

  // Table
  TablePlugin,
];

// Custom plugins for your specific content types
import { bannerPlugin } from '../Banner/banner-plugin';
import { pollPlugin } from '../Poll/poll-plugin';
import { infographPlugin } from '../Infograph/infograph-plugin';
import { leadMagnetPlugin } from '../LeadMagnet/lead-magnet-plugin';
import { faqPlugin } from '../FAQ/faq-plugin';
import { youtubeVideoPlugin } from '@/components/editor/YoutubeVideo/youtube-video-plugin';
import { indentListPlugins } from './indent-list-plugins';
import { lineHeightPlugin } from './line-height-plugin';
import { alignPlugin } from './align-plugin';

// Extended view plugins that include your custom content types
export const extendedViewPlugins = [
  ...minimalViewPlugins,
  ...indentListPlugins,
  lineHeightPlugin,
  alignPlugin,
  FontColorPlugin,
  FontBackgroundColorPlugin,
  FontSizePlugin,
  TogglePlugin,
  ColumnPlugin,
  DatePlugin,
  ...mediaPlugins,
  bannerPlugin,
  pollPlugin,
  infographPlugin,
  leadMagnetPlugin,
  faqPlugin,
  youtubeVideoPlugin,
];
