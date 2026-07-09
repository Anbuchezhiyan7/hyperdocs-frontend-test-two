'use client';

import React, { useState } from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { INDENT_LIST_KEYS, ListStyleType } from '@udecode/plate-indent-list';
import { LinkPlugin } from '@udecode/plate-link/react';
import { EquationPlugin, InlineEquationPlugin } from '@udecode/plate-math/react';
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react';
import { TablePlugin } from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { type PlateEditor, ParagraphPlugin, useEditorRef } from '@udecode/plate/react';
import {
    CalendarIcon,
    ChevronRightIcon,
    Columns3Icon,
    FileCodeIcon,
    FilmIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ImageIcon,
    Link2Icon,
    ListIcon,
    ListOrderedIcon,
    MinusIcon,
    PilcrowIcon,
    PlusIcon,
    QuoteIcon,
    RadicalIcon,
    SquareIcon,
    TableIcon,
    TableOfContentsIcon,
    MagnetIcon,
    FileTextIcon,
    MailIcon,
} from 'lucide-react';

import { insertBlock, insertInlineElement } from '@/components/editor/transforms';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
    useOpenState,
} from './dropdown-menu';
import { ToolbarButton } from './toolbar';
import { bannerPlugin } from '../editor/Banner/banner-plugin';
import { infographPlugin } from '../editor/Infograph/infograph-plugin';
import { pollPlugin } from '../editor/Poll/poll-plugin';
import { faqPlugin } from '../editor/FAQ/faq-plugin';
import { leadMagnetPlugin } from '../editor/LeadMagnet/lead-magnet-plugin';
import { InfographicIcon, StatIcon } from '@/assets/icons';
import FAQIcon from '@/assets/icons/FAQIcon';
import { MediaInsertDialog } from './media-insert-dialog';
import { useQueryState } from 'nuqs';

type Group = {
    group: string;
    items: Item[];
};

interface Item {
    icon: React.ReactNode;
    value: string;
    onSelect: (editor: PlateEditor, value: string) => void;
    focusEditor?: boolean;
    label?: string;
}

const groups: Group[] = [
    {
        group: 'Basic blocks',
        items: [
            {
                icon: <PilcrowIcon />,
                label: 'Paragraph',
                value: ParagraphPlugin.key,
            },
            // {
            //     icon: <Heading1Icon />,
            //     label: 'Heading 1',
            //     value: HEADING_KEYS.h1,
            // },
            {
                icon: <Heading2Icon />,
                label: 'Heading 2',
                value: HEADING_KEYS.h2,
            },
            {
                icon: <Heading3Icon />,
                label: 'Heading 3',
                value: HEADING_KEYS.h3,
            },
            {
                icon: <TableIcon />,
                label: 'Table',
                value: TablePlugin.key,
            },
            {
                icon: <FileCodeIcon />,
                label: 'Code',
                value: CodeBlockPlugin.key,
            },
            {
                icon: <QuoteIcon />,
                label: 'Quote',
                value: BlockquotePlugin.key,
            },
            {
                icon: <MinusIcon />,
                label: 'Divider',
                value: HorizontalRulePlugin.key,
            },
        ].map(item => ({
            ...item,
            onSelect: (editor, value) => {
                insertBlock(editor, value);
            },
        })),
    },
    {
        group: 'Lists',
        items: [
            {
                icon: <ListIcon />,
                label: 'Bulleted list',
                value: ListStyleType.Disc,
            },
            {
                icon: <ListOrderedIcon />,
                label: 'Numbered list',
                value: ListStyleType.Decimal,
            },
            {
                icon: <SquareIcon />,
                label: 'To-do list',
                value: INDENT_LIST_KEYS.todo,
            },
            {
                icon: <ChevronRightIcon />,
                label: 'Toggle list',
                value: TogglePlugin.key,
            },
        ].map(item => ({
            ...item,
            onSelect: (editor, value) => {
                insertBlock(editor, value);
            },
        })),
    },
    {
        group: 'Media',
        items: [
            {
                icon: <ImageIcon />,
                label: 'Image',
                value: ImagePlugin.key,
            },
            {
                icon: <FilmIcon />,
                label: 'Embed',
                value: MediaEmbedPlugin.key,
            },
            // {
            //     icon: <PenToolIcon />,
            //     label: 'Excalidraw',
            //     value: ExcalidrawPlugin.key,
            // },
        ].map(item => ({
            ...item,
            onSelect: (editor, value) => {
                insertBlock(editor, value);
            },
        })),
    },
    {
        group: 'Advanced blocks',
        items: [
            {
                icon: <TableOfContentsIcon />,
                label: 'Table of contents',
                value: TocPlugin.key,
            },
            {
                icon: <Columns3Icon />,
                label: '3 columns',
                value: 'action_three_columns',
            },
            {
                focusEditor: false,
                icon: <RadicalIcon />,
                label: 'Equation',
                value: EquationPlugin.key,
            },
            {
                icon: <ImageIcon className='text-[#5D5D5D]' />,
                keywords: ['banner', 'image', 'header'],
                label: 'Image Banner',
                value: bannerPlugin.key,
            },
            {
                icon: <StatIcon />,
                keywords: ['poll', 'question', 'answer'],
                label: 'Poll',
                value: pollPlugin.key,
            },
            {
                icon: <InfographicIcon />,
                keywords: ['infograph', 'image', 'info', 'graph'],
                label: 'Infograph',
                value: infographPlugin.key,
            },
            {
                icon: <FAQIcon />,
                keywords: ['faq', 'question', 'answer', 'frequently'],
                label: 'Frequently asked questions',
                value: faqPlugin.key,
            },
        ].map(item => ({
            ...item,
            onSelect: (editor, value) => {
                insertBlock(editor, value);
            },
        })),
    },
    {
        group: 'Inline',
        items: [
            {
                icon: <Link2Icon />,
                label: 'Link',
                value: LinkPlugin.key,
            },
            {
                focusEditor: true,
                icon: <CalendarIcon />,
                label: 'Date',
                value: DatePlugin.key,
            },
            {
                focusEditor: false,
                icon: <RadicalIcon />,
                label: 'Inline Equation',
                value: InlineEquationPlugin.key,
            },
        ].map(item => ({
            ...item,
            onSelect: (editor, value) => {
                insertInlineElement(editor, value);
            },
        })),
    },
    {
        group: 'Lead generation',
        items: [
            {
                icon: <MagnetIcon />,
                label: 'Lead Magnet',
                value: 'lead-magnet',
            },
            {
                icon: <FileTextIcon />,
                label: 'LeadForm',
                value: 'lead-form',
            },
            // {
            //     icon: <MailIcon />,
            //     label: 'News Letter',
            //     value: 'news-letter',
            // },
        ].map(item => ({
            ...item,
            onSelect: () => {},
        })),
    },
];

export function InsertDropdownMenu (props: DropdownMenuProps) {
    const editor = useEditorRef();
    const openState = useOpenState();
    const [, setModelType] = useQueryState('model-type');
    const [, setMediaType] = useQueryState('media-type');
    const [, setMode] = useQueryState('mode');
    const [, setLeadType] = useQueryState('leadType');
    const [, setId] = useQueryState('id');

    // Helper function to check if banner already exists
    const checkBannerExists = () => {
        const bannerEntries = Array.from(editor.api.nodes({
            at: [],
            mode: 'all',
            match: (node) => node.type === bannerPlugin.key && node.plugin_data_id !== 'new',
        }));
        return bannerEntries.length > 0;
    };

    // Helper function to check if FAQ already exists
    const checkFAQExists = () => {
        const faqEntries = Array.from(editor.api.nodes({
            at: [],
            mode: 'all',
            match: (node) => node.type === faqPlugin.key && node.plugin_data_id !== 'new',
        }));
        return faqEntries.length > 0;
    };

    // Helper function to check if Newsletter already exists
    const checkNewsletterExists = () => {
        const newsletterEntries = Array.from(editor.api.nodes({
            at: [],
            mode: 'all',
            match: (node) => 
                node.type === leadMagnetPlugin.key && 
                (node.lead_magnet_type === 'newsletter' || node.lead_magnet_type === 'news-letter'),
        }));
        return newsletterEntries.length > 0;
    };

    const handleMediaSelect = (type: 'image' | 'embed') => {
        setModelType('media-insert');
        setMediaType(type);
    };

    // Filter groups to conditionally show banner and FAQ options
    const filteredGroups = groups.map(group => ({
        ...group,
        items: group.items.filter(item => {
            // Hide banner option if banner already exists
            if (item.value === bannerPlugin.key && checkBannerExists()) {
                return false;
            }
            // Hide FAQ option if FAQ already exists
            if (item.value === faqPlugin.key && checkFAQExists()) {
                return false;
            }
            if (item.value === 'news-letter' && checkNewsletterExists()) {
                return false;
            }
            return true;
        })
    }));

    return (
        <>
            <DropdownMenu modal={false} {...openState} {...props}>
                <DropdownMenuTrigger asChild>
                    <ToolbarButton pressed={openState.open} tooltip='Insert'>
                        <PlusIcon />
                    </ToolbarButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className='flex max-h-[300px] min-w-0 flex-col overflow-y-auto'
                    align='center'
                >
                    {filteredGroups.map(({ group, items: nestedItems }) => (
                        <DropdownMenuGroup key={group} label={group}>
                            {nestedItems.map(({ icon, label, value, onSelect }) => (
                                <DropdownMenuItem
                                    key={value}
                                    className='min-w-[180px]'
                                    onSelect={() => {
                                        if (value === ImagePlugin.key) {
                                            onSelect(editor, value);
                                        } else if (value === MediaEmbedPlugin.key) {
                                            handleMediaSelect('embed');
                                        } else if (value === 'lead-magnet' || value === 'lead-form' || value === 'news-letter') {
                                            setMode('lead-magnet');
                                            setLeadType(value);
                                            setId('new');
                                        } else {
                                            onSelect(editor, value);
                                            editor.tf.focus();
                                        }
                                    }}
                                >
                                    {icon}
                                    {label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
