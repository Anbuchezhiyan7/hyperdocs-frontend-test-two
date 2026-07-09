'use client';

import React, { memo, Suspense, lazy, useMemo, useEffect } from 'react';
import type { Value } from '@udecode/plate';
import { useCreateViewEditor } from '@/hooks/use-create-view-editor';
import { sanitizeSlateValue } from '@/utils/editor';

interface BlogContentProps {
  value: Value;
}

// Lazy load Plate components
const LazyPlate = lazy(() =>
  import('@udecode/plate/react').then((mod) => ({ default: mod.Plate }))
);
const LazyPlateContent = lazy(() =>
  import('@udecode/plate/react').then((mod) => ({ default: mod.PlateContent }))
);

const BlogContent: React.FC<BlogContentProps> = memo(({ value }) => {
  // --- UI Painting (Client-side) ---
  const renderStartTime = useMemo(() => performance.now(), []);
  
  useEffect(() => {
    const renderEndTime = performance.now();
    console.log(`%c[UI Paint] BlogContent mounted/rendered in ${(renderEndTime - renderStartTime).toFixed(2)}ms`, 'color: #00ff00; font-weight: bold;');
  }, [renderStartTime]);

  const safeValue = useMemo(() => sanitizeSlateValue(value ?? []), [value]);
  const editor = useCreateViewEditor({
    value: safeValue,
    includeCustomPlugins: true,
    readOnly: true,
  });  

  return (
    <div className="prose max-w-none">
      <Suspense fallback={<div></div>}>
        <LazyPlate editor={editor} readOnly>
          <LazyPlateContent />
        </LazyPlate>
      </Suspense>
    </div>
  );
});

BlogContent.displayName = 'BlogContent';
export default BlogContent;
