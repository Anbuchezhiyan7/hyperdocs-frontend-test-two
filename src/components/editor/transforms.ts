'use client';

import type { PlateEditor } from '@udecode/plate/react';

import {
  type NodeEntry,
  type Path,
  type TElement,
  PathApi,
} from '@udecode/plate';
import { insertCallout } from '@udecode/plate-callout';
import { CalloutPlugin } from '@udecode/plate-callout/react';
import { insertCodeBlock } from '@udecode/plate-code-block';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { insertDate } from '@udecode/plate-date';
import { DatePlugin } from '@udecode/plate-date/react';
import { insertToc } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { INDENT_LIST_KEYS, ListStyleType } from '@udecode/plate-indent-list';
import { IndentListPlugin } from '@udecode/plate-indent-list/react';
import { insertColumnGroup, toggleColumnGroup } from '@udecode/plate-layout';
import { ColumnItemPlugin, ColumnPlugin } from '@udecode/plate-layout/react';
import { LinkPlugin, triggerFloatingLink } from '@udecode/plate-link/react';
import { insertEquation, insertInlineEquation } from '@udecode/plate-math';
import {
  EquationPlugin,
  InlineEquationPlugin,
} from '@udecode/plate-math/react';
import {
  insertAudioPlaceholder,
  insertFilePlaceholder, insertVideoPlaceholder
} from '@udecode/plate-media';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  VideoPlugin,
} from '@udecode/plate-media/react';
import { SuggestionPlugin } from '@udecode/plate-suggestion/react';
import {
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from '@udecode/plate-table/react';
import { bannerPlugin } from '@/components/editor/Banner/banner-plugin';
import { pollPlugin } from '@/components/editor/Poll/poll-plugin';
import { infographPlugin } from '@/components/editor/Infograph/infograph-plugin';
import { toast } from 'sonner';
import { isUrl } from '@udecode/plate';
import { faqPlugin } from './FAQ/faq-plugin';

export const STRUCTURAL_TYPES: string[] = [
  ColumnPlugin.key,
  ColumnItemPlugin.key,
  TablePlugin.key,
  TableRowPlugin.key,
  TableCellPlugin.key,
];

const ACTION_THREE_COLUMNS = 'action_three_columns';

// Helper function to check if banner already exists in editor
const checkBannerExists = (editor: PlateEditor): boolean => {
  const bannerEntries = Array.from(editor.api.nodes({
    at: [],
    mode: 'all',
    match: (node) => node.type === bannerPlugin.key,
  }));
  
  return bannerEntries.length > 0;
};

const insertList = (editor: PlateEditor, type: string) => {
  editor.tf.insertNodes(
    editor.api.create.block({
      indent: 1,
      listStyleType: type,
    }),
    { select: true }
  );
};

const insertBlockMap: Record<
  string,
  (editor: PlateEditor, type: string, id?: string) => void
> = {
  [INDENT_LIST_KEYS.todo]: insertList,
  [ListStyleType.Decimal]: insertList,
  [ListStyleType.Disc]: insertList,
  [ACTION_THREE_COLUMNS]: (editor) =>
    insertColumnGroup(editor, { columns: 3, select: true }),
  [AudioPlugin.key]: (editor) =>
    insertAudioPlaceholder(editor, { select: true }),
  [CalloutPlugin.key]: (editor) => insertCallout(editor, { select: true }),
  [CodeBlockPlugin.key]: (editor) => insertCodeBlock(editor, { select: true }),
  [EquationPlugin.key]: (editor) => insertEquation(editor, { select: true }),
  [FilePlugin.key]: (editor) => insertFilePlaceholder(editor, { select: true }),
  [ImagePlugin.key]: (editor) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        (editor as any).tf.insert.media(files);
      }
    };
    input.click();
  },
  [MediaEmbedPlugin.key]: (editor) => {
    const url = window.prompt('Enter media URL:');
    if (!url) return;

    if (!isUrl(url)) {
      toast.error('Invalid URL');
      return;
    }

    editor.tf.insertNodes({
      children: [{ text: '' }],
      type: MediaEmbedPlugin.key,
      url,
    });
  },
  [TablePlugin.key]: (editor) =>
    editor.getTransforms(TablePlugin).insert.table({}, { select: true }),
  [TocPlugin.key]: (editor) => insertToc(editor, { select: true }),
  [VideoPlugin.key]: (editor) =>
    insertVideoPlaceholder(editor, { select: true }),
  [bannerPlugin.key]: (editor, value, id) => {
    // Check if banner already exists
    if (checkBannerExists(editor)) {
      toast.error('Only one banner is allowed per blog post');
      return;
    }
    insertCustomPlaceholder(editor, bannerPlugin.key, id);
  },
  [pollPlugin.key]: (editor, value, id) =>
    insertCustomPlaceholder(editor, pollPlugin.key, id),
  [infographPlugin.key]: (editor, value, id) =>
    insertCustomPlaceholder(editor, infographPlugin.key, id),
  [faqPlugin.key]: (editor, value, id) =>
    insertCustomPlaceholder(editor, faqPlugin.key, id),
};

const insertCustomPlaceholder = (editor: PlateEditor, key: string, id?: string, ) => {
  console.log('ID', id);

  editor.tf.insertNodes(
    editor.api.create.block({
      type: key,
      children: [{ text: '' }],
      plugin_data_id: "new",
      isEditing: true,
    }),
    { select: true }
  );
};

const insertInlineMap: Record<
  string,
  (editor: PlateEditor, type: string) => void
> = {
  [DatePlugin.key]: (editor) => insertDate(editor, { select: true }),
  [InlineEquationPlugin.key]: (editor) =>
    insertInlineEquation(editor, '', { select: true }),
  [LinkPlugin.key]: (editor) => triggerFloatingLink(editor, { focused: true }),
};

export const insertBlock = (editor: PlateEditor, type: string, id?: string) => {
  console.log('ID INSERT BLOCK', id);
  editor.tf.withoutNormalizing(() => {
    const block = editor.api.block();

    if (!block) return;
    if (type in insertBlockMap) {
      insertBlockMap[type](editor, type, id);
    } else {
      editor.tf.insertNodes(editor.api.create.block({ type }), {
        at: PathApi.next(block[1]),
        select: true,
      });
    }
    if (getBlockType(block[0]) !== type) {
      editor.getApi(SuggestionPlugin).suggestion.withoutSuggestions(() => {
        editor.tf.removeNodes({ previousEmptyBlock: true });
      });
    }
  });
};

export const insertInlineElement = (editor: PlateEditor, type: string) => {
  if (insertInlineMap[type]) {
    insertInlineMap[type](editor, type);
  }
};

const setList = (
  editor: PlateEditor,
  type: string,
  entry: NodeEntry<TElement>
) => {
  editor.tf.setNodes(
    editor.api.create.block({
      indent: 1,
      listStyleType: type,
    }),
    {
      at: entry[1],
    }
  );
};

const setBlockMap: Record<
  string,
  (editor: PlateEditor, type: string, entry: NodeEntry<TElement>) => void
> = {
  [INDENT_LIST_KEYS.todo]: setList,
  [ListStyleType.Decimal]: setList,
  [ListStyleType.Disc]: setList,
  [ACTION_THREE_COLUMNS]: (editor) => toggleColumnGroup(editor, { columns: 3 }),
};

export const setBlockType = (
  editor: PlateEditor,
  type: string,
  { at }: { at?: Path } = {}
) => {
  editor.tf.withoutNormalizing(() => {
    const setEntry = (entry: NodeEntry<TElement>) => {
      const [node, path] = entry;

      if (node[IndentListPlugin.key]) {
        editor.tf.unsetNodes([IndentListPlugin.key, 'indent'], { at: path });
      }
      if (type in setBlockMap) {
        return setBlockMap[type](editor, type, entry);
      }
      if (node.type !== type) {
        editor.tf.setNodes({ type }, { at: path });
      }
    };

    if (at) {
      const entry = editor.api.node<TElement>(at);

      if (entry) {
        setEntry(entry);

        return;
      }
    }

    const entries = editor.api.blocks({ mode: 'lowest' });

    entries.forEach((entry) => setEntry(entry));
  });
};

export const getBlockType = (block: TElement) => {
  if (block[IndentListPlugin.key]) {
    if (block[IndentListPlugin.key] === ListStyleType.Decimal) {
      return ListStyleType.Decimal;
    } else if (block[IndentListPlugin.key] === INDENT_LIST_KEYS.todo) {
      return INDENT_LIST_KEYS.todo;
    } else {
      return ListStyleType.Disc;
    }
  }

  return block.type;
};
