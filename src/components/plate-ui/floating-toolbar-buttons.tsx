'use client';

import {
    BoldPlugin,
    CodePlugin,
    ItalicPlugin,
    StrikethroughPlugin,
    UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { FontBackgroundColorPlugin, FontColorPlugin } from '@udecode/plate-font/react';
import { useEditorReadOnly } from '@udecode/plate/react';
import {
    BaselineIcon,
    BoldIcon,
    Code2Icon,
    ItalicIcon,
    PaintBucketIcon,
    StrikethroughIcon,
    UnderlineIcon,
} from 'lucide-react';

import { InlineEquationToolbarButton } from './inline-equation-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { MarkToolbarButton } from './mark-toolbar-button';

import { TurnIntoDropdownMenu } from './turn-into-dropdown-menu';
import { MoreDropdownMenu } from './more-dropdown-menu';
import { LinkToolbarButton } from './link-toolbar-button';
import { CommentToolbarButton } from './comment-toolbar-button';
import { Divider } from 'antd';
import { ColorDropdownMenu } from './color-dropdown-menu';

export function FloatingToolbarButtons () {
    const readOnly = useEditorReadOnly();

    return (
        <>
            {!readOnly && (
                <>
                    <Divider variant='solid' rootClassName='bg-gray-200 h-[25px]' type='vertical' />
                    <ToolbarGroup>
                        <TurnIntoDropdownMenu />
                        <Divider
                            variant='solid'
                            rootClassName='bg-gray-200 h-[25px]'
                            type='vertical'
                        />
                        <LinkToolbarButton />
                        <Divider
                            variant='solid'
                            rootClassName='bg-gray-200 h-[25px]'
                            type='vertical'
                        />
                        <MarkToolbarButton nodeType={BoldPlugin.key} tooltip='Bold (⌘+B)'>
                            <BoldIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton nodeType={ItalicPlugin.key} tooltip='Italic (⌘+I)'>
                            <ItalicIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton nodeType={UnderlinePlugin.key} tooltip='Underline (⌘+U)'>
                            <UnderlineIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton
                            nodeType={StrikethroughPlugin.key}
                            tooltip='Strikethrough (⌘+⇧+M)'
                        >
                            <StrikethroughIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton nodeType={CodePlugin.key} tooltip='Code (⌘+E)'>
                            <Code2Icon />
                        </MarkToolbarButton>

                        <Divider
                            variant='solid'
                            rootClassName='bg-gray-200 h-[25px]'
                            type='vertical'
                        />

                        <ColorDropdownMenu nodeType={FontColorPlugin.key} tooltip='Text color'>
                            <BaselineIcon />
                        </ColorDropdownMenu>

                        <ColorDropdownMenu
                            nodeType={FontBackgroundColorPlugin.key}
                            tooltip='Highlight color'
                        >
                            <PaintBucketIcon />
                        </ColorDropdownMenu>

                        <InlineEquationToolbarButton />
                    </ToolbarGroup>
                </>
            )}

            <ToolbarGroup>
                <CommentToolbarButton />
                {/* <SuggestionToolbarButton /> */}

                {!readOnly && <MoreDropdownMenu />}
            </ToolbarGroup>
        </>
    );
}
