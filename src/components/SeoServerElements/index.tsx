/**
 * SeoServerElements — dedicated SEO hidden layer
 *
 * Copied as-is from old-code/src/components/RenderServerElements/index.tsx
 * which scored 90 on LLM visibility. Imports adjusted to point to the
 * existing sub-components in ../RenderServerElements/.
 *
 * Plugin props (faqData, pollData, etc.) are optional — passing null is fine.
 * The SEO value comes from h1-h6 and paragraph text content.
 *
 * RULES:
 *  - No 'use client' — this must stay a pure server component wrapper
 *  - Do NOT use for visual rendering
 *  - Do NOT touch RenderServerElements (the visual renderer)
 */

import Polls from '../RenderServerElements/Polls';
import Faq from '../RenderServerElements/Faq';
import Banner from '../RenderServerElements/Banner';
import LeadMagnet from '../RenderServerElements/Leadmagnet';
import InlineEquation from '../RenderServerElements/InlineEquation';
import List from '../RenderServerElements/List';
import Table from '../RenderServerElements/Table';
import CodeBlock from '../RenderServerElements/CodeBlock';
import ColumnGroup from '../RenderServerElements/ColumnGroup';
import Equation from '../RenderServerElements/Equation';
import Infograph from '../RenderServerElements/Infograph';
import MediaEmbed from '../RenderServerElements/MediaEmbed';
import TodoItem from '../RenderServerElements/TodoItem';
import RichText from '../RenderServerElements/RichText';

interface Blog {
    blog_title: string;
    author_details?: {
        author_name?: string;
    };
    created_at?: string;
    content: any[];
}

interface SeoServerElementsProps {
    blog: Blog;
    leadMagnetData?: any[] | null;
    faqData?: any | null;
    pollData?: any | null;
    bannerData?: any | null;
    infographData?: any | null;
}

export default function SeoServerElements({
    blog,
    leadMagnetData = null,
    faqData = null,
    pollData = null,
    bannerData = null,
    infographData = null,
}: SeoServerElementsProps) {
    // Add null checks for blog and its essential properties
    if (!blog || !blog.blog_title || !blog.content || !Array.isArray(blog.content)) return null;

    const elements: JSX.Element[] = [];
    let currentList: { items: JSX.Element[]; type: 'ul' | 'ol' } | null = null;

    // Process content efficiently without blocking
    blog.content.forEach((block: any, index: number) => {
        // Add null checks for block
        if (
            !block ||
            !block.children ||
            !Array.isArray(block.children) ||
            block.children.length === 0
        )
            return;

        const childrenText = block.children
            .map((child: any) => (child && child.text ? child.text : ''))
            .filter((text: string) => text !== '')
            .join('');

        // Check if this is a list item
        if (block.type === 'p' && block.listStyleType) {
            // Handle todo items separately
            if (block.listStyleType === 'todo') {
                // Close any open list before processing todo items
                if (currentList) {
                    elements.push(
                        <List
                            key={`list-${elements.length}`}
                            items={currentList.items}
                            type={currentList.type}
                            index={elements.length}
                        />
                    );
                    currentList = null;
                }
                elements.push(<TodoItem key={index} block={block} index={index} />);
                return;
            }

            const listType = block.listStyleType === 'decimal' ? 'ol' : 'ul';

            // If we don't have a current list or the list type changed, start a new list
            if (!currentList || currentList.type !== listType) {
                // Close previous list if exists
                if (currentList) {
                    elements.push(
                        <List
                            key={`list-${elements.length}`}
                            items={currentList.items}
                            type={currentList.type}
                            index={elements.length}
                        />
                    );
                }
                // Start new list
                currentList = { items: [], type: listType };
            }

            currentList.items.push(
                <li key={index}>
                    <RichText children={block.children} />
                </li>
            );
            return;
        }

        // Close any open list before processing non-list items
        if (currentList) {
            elements.push(
                <List
                    key={`list-${elements.length}`}
                    items={currentList.items}
                    type={currentList.type}
                    index={elements.length}
                />
            );
            currentList = null;
        }

        // Process non-list items efficiently
        switch (block.type) {
            case 'h1':
                elements.push(<h2 key={index}>{childrenText}</h2>);
                break;
            case 'h2':
                elements.push(<h2 key={index}>{childrenText}</h2>);
                break;
            case 'h3':
                elements.push(<h3 key={index}>{childrenText}</h3>);
                break;
            case 'p':
                // Check if paragraph contains inline equations
                const hasInlineEquations = block.children.some(
                    (child: any) => child && child.type === 'inline_equation'
                );

                if (hasInlineEquations) {
                    elements.push(
                        <InlineEquation key={index} block={block} index={index} />
                    );
                } else {
                    // Use RichText component to handle links, bold, italic, etc.
                    elements.push(
                        <p key={index}>
                            {childrenText}
                        </p>
                    );
                }
                break;
            case 'faq':
                elements.push(<Faq key={index} faqData={faqData} />);
                break;
            case 'poll':
                elements.push(<Polls key={index} pollData={pollData} />);
                break;
            case 'banner':
                elements.push(<Banner key={index} bannerData={bannerData} />);
                break;
            case 'lead_magnet':
                elements.push(
                    <LeadMagnet key={index} leadMagnetData={leadMagnetData || []} />
                );
                break;
            case 'code_block':
                elements.push(
                    <CodeBlock key={index} block={block} index={index} />
                );
                break;
            case 'table':
                elements.push(<Table key={index} block={block} index={index} />);
                break;
            case 'column_group':
                elements.push(
                    <ColumnGroup key={index} block={block} index={index} />
                );
                break;
            case 'equation':
                elements.push(<Equation key={index} block={block} index={index} />);
                break;
            case 'infograph':
                elements.push(
                    <Infograph key={index} infographData={infographData} />
                );
                break;
            case 'media_embed':
                elements.push(
                    <MediaEmbed key={index} block={block} index={index} />
                );
                break;
            default:
                elements.push(
                    <div key={index}>
                        <RichText children={block.children} />
                    </div>
                );
                break;
        }
    });

    // Close any remaining open list
    if (currentList) {
        const listToClose = currentList as { items: JSX.Element[]; type: 'ul' | 'ol' };
        elements.push(
            <List
                key={`list-${elements.length}`}
                items={listToClose.items}
                type={listToClose.type}
                index={elements.length}
            />
        );
    }

    return (
        // Hidden div for SEO and LLM visibility — not visible in UI
        // Mirrors the old-code pattern that scored 90 on LLM visibility tools
        <div
            style={{
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
                visibility: 'hidden',
                height: '0',
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
            aria-hidden="true"
            suppressHydrationWarning
        >
            <div className="flex items-center justify-between mb-8 text-sm">
                <div>
                    <span className="mr-2">Author:</span>
                    <span className="font-medium">
                        {blog?.author_details?.author_name || 'Unknown Author'}
                    </span>
                </div>
                <div>
                    <span className="mr-2">Date:</span>
                    <span>{blog?.created_at || 'Unknown Date'}</span>
                </div>
            </div>
            {elements}
        </div>
    );
}
