'use client';

import React from 'react';

import { withRef } from '@udecode/cn';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { INDENT_LIST_KEYS, ListStyleType } from '@udecode/plate-indent-list';
import { EquationPlugin, InlineEquationPlugin } from '@udecode/plate-math/react';
import { TablePlugin } from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { type PlateEditor, ParagraphPlugin } from '@udecode/plate/react';
import { PlateElement } from '@udecode/plate/react';
import {
    CalendarIcon,
    ChevronRightIcon,
    Code2,
    Columns3Icon,
    FilmIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    ListIcon,
    ListOrdered,
    PilcrowIcon,
    Quote,
    RadicalIcon,
    Square,
    Table,
    TableOfContentsIcon,
    MagnetIcon,
    FileTextIcon
} from 'lucide-react';

import { useQueryState } from 'nuqs';

import { insertBlock, insertInlineElement } from '@/components/editor/transforms';

import {
    InlineCombobox,
    InlineComboboxContent,
    InlineComboboxEmpty,
    InlineComboboxGroup,
    InlineComboboxGroupLabel,
    InlineComboboxInput,
    InlineComboboxItem,
} from './inline-combobox';
import { bannerPlugin } from '../editor/Banner/banner-plugin';
import { pollPlugin } from '../editor/Poll/poll-plugin';
import { ImageIcon, StatIcon, InfographicIcon } from '@/assets/icons';
import { MediaEmbedPlugin } from '@udecode/plate-media/react';
import { infographPlugin } from '../editor/Infograph/infograph-plugin';
import { ImagePlugin } from '@udecode/plate-media/react';
import { leadMagnetPlugin } from '../editor/LeadMagnet/lead-magnet-plugin';
import FAQIcon from '@/assets/icons/FAQIcon';
import { faqPlugin } from '../editor/FAQ/faq-plugin';

type Group = {
    group: string;
    items: Item[];
};

interface Item {
    icon: React.ReactNode;
    value: string;
    onSelect: (editor: PlateEditor, value: string, id?: string) => void;
    className?: string;
    focusEditor?: boolean;
    keywords?: string[];
    label?: string;
}

const groups: Group[] = [
    // {
    //     group: 'AI',
    //     items: [
    //         {
    //             focusEditor: false,
    //             icon: <SparklesIcon />,
    //             value: 'AI',
    //             onSelect: editor => {
    //                 editor.getApi(AIChatPlugin).aiChat.show();
    //             },
    //         },
    //     ],
    // },
    {
        group: 'Basic blocks',
        items: [
            {
                icon: <PilcrowIcon />,
                keywords: ['paragraph'],
                label: 'Text',
                value: ParagraphPlugin.key,
            },
            // {
            //     icon: <Heading1Icon />,
            //     keywords: ['title', 'h1'],
            //     label: 'Heading 1',
            //     value: HEADING_KEYS.h1,
            // },
            {
                icon: <Heading2Icon />,
                keywords: ['subtitle', 'h2'],
                label: 'Heading 2',
                value: HEADING_KEYS.h2,
            },
            {
                icon: <Heading3Icon />,
                keywords: ['subtitle', 'h3'],
                label: 'Heading 3',
                value: HEADING_KEYS.h3,
            },
            {
                icon: <ListIcon />,
                keywords: ['unordered', 'ul', '-'],
                label: 'Bulleted list',
                value: ListStyleType.Disc,
            },
            {
                icon: <ListOrdered />,
                keywords: ['ordered', 'ol', '1'],
                label: 'Numbered list',
                value: ListStyleType.Decimal,
            },
            {
                icon: <Square />,
                keywords: ['checklist', 'task', 'checkbox', '[]'],
                label: 'To-do list',
                value: INDENT_LIST_KEYS.todo,
            },
            {
                icon: <ChevronRightIcon />,
                keywords: ['collapsible', 'expandable'],
                label: 'Toggle',
                value: TogglePlugin.key,
            },
            {
                icon: <Code2 />,
                keywords: ['```'],
                label: 'Code Block',
                value: CodeBlockPlugin.key,
            },
            {
                icon: <Table />,
                label: 'Table',
                value: TablePlugin.key,
            },
            {
                icon: <Quote />,
                keywords: ['citation', 'blockquote', 'quote', '>'],
                label: 'Blockquote',
                value: BlockquotePlugin.key,
            },
        ].map(item => ({
            ...item,
            onSelect: (editor, value, id) => {
                insertBlock(editor, value, id);
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
                keywords: ['toc'],
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
            onSelect: (editor, value, id) => {
                insertBlock(editor, value, id);
            },
        })),
    },
    {
        group: 'Inline',
        items: [
            {
                focusEditor: true,
                icon: <CalendarIcon />,
                keywords: ['time'],
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
        ].map(item => ({
            ...item,
            onSelect: () => {},
        })),
    },
];

export const CUSTOM_BLOCKS = [
    pollPlugin.key,
    bannerPlugin.key,
    infographPlugin.key,
    leadMagnetPlugin.key,
    faqPlugin.key,
    'youtube_video',
];

export const SlashInputElement = withRef<typeof PlateElement>(({ className, ...props }, ref) => {
    const { children, editor, element } = props;
    const [, setMode] = useQueryState('mode');
    const [, setModelType] = useQueryState('model-type');
    const [, setMediaType] = useQueryState('media-type');
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            editor.tf.removeNodes({ at: editor.api.findPath(element) });
        }
        if (e.key === 'Backspace' && element.value === '/') {
            e.preventDefault();
            editor.tf.removeNodes({ at: editor.api.findPath(element) });
        }
    };

    // Filter groups to conditionally show banner and FAQ options
    const filteredGroups = groups.map(group => ({
        ...group,
        items: group.items.filter(item => {
            console.log(item.value, checkFAQExists(), 'CHECK FAQ EXISTS');
            // Hide banner option if banner already exists
            if (item.value === bannerPlugin.key && checkBannerExists()) {
                return false;
            }
            // Hide FAQ option if FAQ already exists
            if (item.value === faqPlugin.key && checkFAQExists()) {
                return false;
            }
          
            return true;
        })
    }));

    return (
        <PlateElement
            ref={ref}
            as='span'
            className={className}
            data-slate-value={element.value}
            {...props}
        >
            <InlineCombobox element={element} trigger='/'>
                <InlineComboboxInput
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                        editor.tf.removeNodes({ at: editor.api.findPath(element) });
                    }}
                />

                <InlineComboboxContent className='z-10'>
                    <InlineComboboxEmpty>No results</InlineComboboxEmpty>

                    {filteredGroups.map(({ group, items }) => (
                        <InlineComboboxGroup key={group}>
                            <InlineComboboxGroupLabel>{group}</InlineComboboxGroupLabel>

                            {items.map(
                                ({ focusEditor, icon, keywords, label, value, onSelect }) => (
                                    <InlineComboboxItem
                                        key={value}
                                        value={value}
                                        onClick={() => {
                                            if (value === 'lead-magnet' || value === 'lead-form' || value === 'news-letter') {
                                                setMode('lead-magnet');
                                                setLeadType(value);
                                                setId('new');
                                            } else if (value === ImagePlugin.key || value === MediaEmbedPlugin.key) {
                                                setModelType('media-insert');
                                                setMediaType(value === ImagePlugin.key ? 'image' : 'embed');
                                            } else {
                                                onSelect(editor, value);
                                            }
                                        }}
                                        label={label}
                                        focusEditor={focusEditor}
                                        group={group}
                                        keywords={keywords}
                                    >
                                        <div className='mr-2 text-muted-foreground'>{icon}</div>
                                        {label ?? value}
                                    </InlineComboboxItem>
                                )
                            )}
                        </InlineComboboxGroup>
                    ))}
                </InlineComboboxContent>
            </InlineCombobox>

            {children}
        </PlateElement>
    );
});
