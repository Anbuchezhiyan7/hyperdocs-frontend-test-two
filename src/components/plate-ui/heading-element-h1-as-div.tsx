'use client';

import type { SlateElementProps } from '@udecode/plate';
import { cn } from '@udecode/cn';
import { SlateElement } from '@udecode/plate';

/**
 * Renders the first-level heading (H1) as a div in read-only view.
 * Used so only the server-injected SEO block has a real <h1>; the visible Plate content uses a div to avoid duplicate H1s.
 */
export function HeadingElementH1AsDiv({
    children,
    className,
    ...props
}: SlateElementProps) {
    return (
        <SlateElement
            as="div"
            className={cn(
                'relative mb-1 mt-[1.6em] pb-1 font-heading text-4xl font-bold',
                className
            )}
            {...props}
        >
            {children}
        </SlateElement>
    );
}
