'use client';

import React from 'react';

import { cn } from '@udecode/cn';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { ParagraphPlugin } from '@udecode/plate/react';
import {
    type PlaceholderProps,
    createNodeHOC,
    createNodesHOC,
    usePlaceholderState,
} from '@udecode/plate/react';
import { NodeEntry } from '@udecode/plate';

export const Placeholder = (props: PlaceholderProps) => {
    const { children, nodeProps, placeholder } = props;

    const { enabled } = usePlaceholderState(props);
    const isParagraph = placeholder?.includes('/');

    return React.Children.map(children, child => {
        return React.cloneElement(child, {
            className: child.props.className,
            nodeProps: {
                ...nodeProps,
                className: cn(
                    enabled && 'before:absolute before:cursor-text before:content-[attr(placeholder)]',
                    enabled && (isParagraph 
                        ? 'before:opacity-35 before:text-[17px] before:font-normal' 
                        : 'before:opacity-25 before:font-semibold')
                ),
                placeholder,
            },
        });
    });
};

export const withPlaceholder = createNodeHOC(Placeholder);

export const withPlaceholdersPrimitive = createNodesHOC(Placeholder);

export const withPlaceholders = (components: any) =>
    withPlaceholdersPrimitive(components, [
        {
            key: HEADING_KEYS.h1,
            hideOnBlur: false,
            placeholder: 'Enter your blog post title here <H1>',
            query: {
                filter: ([node, path]: NodeEntry) => path.length === 1 && path[0] === 0,
            },
        },
        {
            key: ParagraphPlugin.key,
            hideOnBlur: false,
            placeholder: 'Start Writing or Type / for widgets.',
            query: {
                maxLevel: 1,
            },
        },
    ]);
