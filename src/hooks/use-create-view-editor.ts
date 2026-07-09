'use client';

import type { Value } from '@udecode/plate';
import { usePlateEditor } from '@udecode/plate/react';
import { extendedViewComponents, minimalViewComponents } from '@/components/editor/plugins/view-components';
import { extendedViewPlugins, minimalViewPlugins } from '@/components/editor/plugins/view-plugins';

interface CreateViewEditorOptions {
  value: Value;
  components?: Record<string, any>;
  includeCustomPlugins?: boolean; // Whether to include Banner, Poll, etc.
  readOnly?: boolean;
}

/**
 * Lightweight hook for creating a view-only editor with minimal plugins
 * This is much more performant than the full editor setup for read-only content
 */
export const useCreateViewEditor = ({
  value,
  components,
  includeCustomPlugins = true,
  readOnly = true,
}: CreateViewEditorOptions) => {
  const plugins = includeCustomPlugins ? extendedViewPlugins : minimalViewPlugins;
  const viewComponents = includeCustomPlugins ? extendedViewComponents : minimalViewComponents;

  return usePlateEditor<Value>({
    value,
    plugins: plugins as any,
    override: {
      components: {
        ...viewComponents,
        ...components,
      },
    },
  });
};
