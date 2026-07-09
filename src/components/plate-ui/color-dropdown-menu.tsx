'use client';

import * as React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import type { BaseSelection } from 'slate';

import { useColorDropdownMenu, useColorDropdownMenuState } from '@udecode/plate-font/react';
import { useEditorRef } from '@udecode/plate/react';

import { DEFAULT_COLORS, DEFAULT_CUSTOM_COLORS } from './color-constants';
import { ColorPicker } from './color-picker';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';
import { ToolbarButton } from './toolbar';

type ColorDropdownMenuProps = {
    nodeType: string;
    tooltip?: string;
} & DropdownMenuProps;

export function ColorDropdownMenu ({ children, nodeType, tooltip }: ColorDropdownMenuProps) {
    const editor = useEditorRef();
    const selectionRef = React.useRef<BaseSelection>(null);

    const state = useColorDropdownMenuState({
        closeOnSelect: true,
        colors: DEFAULT_COLORS,
        customColors: DEFAULT_CUSTOM_COLORS,
        nodeType,
    });

    const { buttonProps, menuProps } = useColorDropdownMenu(state);
    const { onOpenChange: menuOnOpenChange, ...restMenuProps } = menuProps;

    const maintainFloatingToolbar = React.useCallback(() => {
        const pluginsByKey = editor.pluginsByKey as Record<
            string,
            {
                api?: {
                    setOpen?: (open: boolean) => void;
                };
            }
        >;

        pluginsByKey?.['floating-toolbar']?.api?.setOpen?.(true);
    }, [editor]);

    const restoreSelection = React.useCallback(() => {
        if (selectionRef.current) {
            editor.tf.select(selectionRef.current);
        }

        editor.tf.focus();
    }, [editor]);

    const handleOpenChange = React.useCallback(
        (open: boolean) => {
            menuOnOpenChange?.(open);

            if (!open) {
                selectionRef.current = null;
            } else {
                maintainFloatingToolbar();
            }
        },
        [editor, maintainFloatingToolbar, menuOnOpenChange]
    );

    const handleUpdateColor = React.useCallback(
        (value: string) => {
            restoreSelection();
            state.updateColorAndClose(value);
        },
        [editor.selection, nodeType, restoreSelection, state]
    );

    const handleUpdateCustomColor = React.useCallback(
        (value: string) => {
            restoreSelection();
            state.updateColor(value);
        },
        [editor.selection, nodeType, restoreSelection, state]
    );

    const handleClearColor = React.useCallback(() => {
        restoreSelection();
        state.clearColor();
    }, [restoreSelection, state]);

    const handleMouseDown = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();

            const currentSelection = editor.selection;
            selectionRef.current = currentSelection
                ? {
                      anchor: { ...currentSelection.anchor },
                      focus: { ...currentSelection.focus },
                  }
                : null;

            maintainFloatingToolbar();
        },
        [editor, maintainFloatingToolbar]
    );

    return (
        <DropdownMenu modal={false} {...restMenuProps} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <ToolbarButton tooltip={tooltip} onMouseDown={handleMouseDown} {...buttonProps}>
                    {children}
                </ToolbarButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align='start'
                onMouseDown={event => {
                    event.preventDefault();
                    restoreSelection();
                    maintainFloatingToolbar();
                }}
            >
                <ColorPicker
                    color={state.selectedColor || state.color}
                    clearColor={handleClearColor}
                    colors={state.colors}
                    customColors={state.customColors}
                    updateColor={handleUpdateColor}
                    updateCustomColor={handleUpdateCustomColor}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
