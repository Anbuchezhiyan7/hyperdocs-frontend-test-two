'use client';

import { BasicMarksPlugin } from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { HeadingPlugin } from '@udecode/plate-heading/react';
import { common, createLowlight } from 'lowlight';

// Only import common languages instead of all languages
const lowlight = createLowlight(common);

export const basicNodesPlugins = [
  HeadingPlugin.configure({ options: { levels: 3 } }),
  BlockquotePlugin,
  CodeBlockPlugin.configure({ options: { lowlight } }),
  BasicMarksPlugin,
] as const;
