import Polls from './Polls';
import Faq from './Faq';
import Banner from './Banner';
import LeadMagnet from './Leadmagnet';
import InlineEquation from './InlineEquation';
import List from './List';
import Table from './Table';
import CodeBlock from './CodeBlock';
import ColumnGroup from './ColumnGroup';
import Equation from './Equation';
import Infograph from './Infograph';
import MediaEmbed from './MediaEmbed';
import TodoItem from './TodoItem';
import Toggle from './Toggle';
import NextImage from 'next/image';
import { formatSmartDate } from '@/utils/time';
import { optimizeCloudinaryImage } from '@/utils/cloudinary';
import RichText from './RichText';
import NewsletterBlock from './NewsletterBlock';
import PublicYoutubeFacade from './PublicYoutubeFacade';

interface Blog {
    blog_id: string;
    blog_title: string;
    author_details: {
        author_name: string;
    };
    created_at: string;
    content: any[];
    blog_info?: {
        featured_image?: {
            url?: string;
        }
    };
}

interface LeadMagnetData {
    lead_magnet_id: string;
    blog_id: string;
    template_type: string;
    lead_magnet_template_id: string | null;
    details: {
        pdf_url: string | null;
        image_url: string | null;
        title: string;
        description: string;
        cta_placement: string;
        cta_button: string;
        details_required: string[];
        lead_magnet_template_id: string;
        placeholder_text?: string;
        bg_color?: string;
        button_color?: string;
    };
    created_at: string;
    updated_at: string;
}

interface FaqData {
    faq_id: string;
    blog_id: string;
    faq_data: Array<{
        question: string;
        answer: string;
    }>;
    created_at: string;
    updated_at: string;
}

interface PollData {
    poll_id: string;
    blog_id: string;
    poll_title: string | null;
    poll_description: string | null;
    poll_question: string;
    show_results_after_voting: boolean | null;
    poll_options: Array<{
        option_id: string;
        option_title: string;
        option_votes: number;
    }>;
    created_at: string;
    updated_at: string;
    accepted: boolean;
    total_voters: number;
}

interface BannerData {
    banner_id: string;
    blog_id: string;
    banner_title: string;
    banner_url: string | null;
    banner_type: string;
    banner_template_id: string;
    alt_text: string;
    created_at: string;
    updated_at: string;
    accepted: boolean;
}

interface InfographData {
    infograph_id: string;
    blog_id: string;
    infograph_title: string;
    infograph_url: string | null;
    infograph_template_id: string;
    infograph_description: string;
    infograph_steps: Array<{
        step_number: number;
        step_content: string;
    }>;
    alt_text: string;
    infograph_type: string;
    created_at: string;
    updated_at: string;
    accepted: boolean;
}

interface NewsletterData {
    is_newsletter_configured: boolean;
    template: {
        template_id: string;
        template_name: string;
        title: string;
        button_text: string;
        description: string;
        right_panel_heading: string | null;
        right_panel_subtext: string | null;
        is_active: boolean;
    } | null;
}

import LeadMagnetSync from './LeadMagnetSync';

interface RenderServerElementProps {
    blog: Blog;
    leadMagnetData: LeadMagnetData[];
    faqData: FaqData | null;
    pollData: PollData | null;
    bannerData: BannerData | null;
    infographData: Record<string, InfographData> | null;
    newsletterData?: NewsletterData | null;
    visualMode?: boolean;
    omitFeaturedBanner?: boolean;
}

const RenderServerElement = ({
    blog,
    leadMagnetData,
    faqData,
    pollData,
    bannerData,
    infographData,
    newsletterData,
    visualMode = false,
    omitFeaturedBanner = false,
}: RenderServerElementProps) => {
   
    // Add null checks for blog and its essential properties
    if (!blog || !blog.blog_title || !blog.content || !Array.isArray(blog.content)) return null;

    // Define styles based on visualMode
    const containerStyle = visualMode ? {} : {
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        visibility: 'hidden',
        height: '0',
        overflow: 'hidden',
        pointerEvents: 'none',
    } as React.CSSProperties;

    // Remove aria-hidden completely if in visual mode
    const accessibilityProps = visualMode ? {} : { "aria-hidden": true };

    return (
        <div className={visualMode ? "prose max-w-none w-full" : ""} style={containerStyle} {...accessibilityProps} suppressHydrationWarning>
                <LeadMagnetSync leadMagnetData={leadMagnetData} />
                {(() => {
                    const elements: JSX.Element[] = [];
                    const newsletterElements: JSX.Element[] = [];
                    let currentList: { items: JSX.Element[]; type: 'ul' | 'ol' } | null = null;
                    let currentToggle: { header: any; children: any[] } | null = null;

                    const closeGroups = () => {
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
                        if (currentToggle) {
                            elements.push(
                                <Toggle 
                                    key={`toggle-${elements.length}`} 
                                    header={currentToggle.header} 
                                    children={currentToggle.children} 
                                />
                            );
                            currentToggle = null;
                        }
                    };

                    // Process content efficiently
                    blog.content.forEach((block: any, index: number) => {
                        // Skip the first block if it's the main title (h1), templates render this natively
                        if (index === 0 && block.type === 'h1') return;

                        if (
                            !block ||
                            !block.children ||
                            !Array.isArray(block.children)
                        )
                            return;

                        // 1. Group indented content under the active toggle
                        if (currentToggle && block.indent && block.indent > 0) {
                            currentToggle.children.push(block);
                            return;
                        }

                        // 2. Handle List Grouping
                        if (block.type === 'p' && block.listStyleType) {
                            // Handle todo items separately
                            if (block.listStyleType === 'todo') {
                                closeGroups();
                                elements.push(<TodoItem key={index} block={block} index={index} />);
                                return;
                            }

                            const listType = block.listStyleType === 'decimal' ? 'ol' : 'ul';

                            if (!currentList || currentList.type !== listType) {
                                closeGroups();
                                currentList = { items: [], type: listType };
                            }

                            currentList.items.push(
                                <li key={index}>
                                    <RichText children={block.children} />
                                </li>
                            );
                            return;
                        }

                        // 3. Process Non-Grouped Items (Close active groups first)
                        closeGroups();

                        switch (block.type) {
                            case 'toggle':
                                currentToggle = { header: block, children: [] };
                                break;
                            case 'h1':
                                elements.push(<h2 key={index} className="mb-0" data-block-id={block.id}><RichText children={block.children} /></h2>);
                                break;
                            case 'h2':
                                elements.push(<h2 key={index} className="mb-0" data-block-id={block.id}><RichText children={block.children} /></h2>);
                                break;
                            case 'h3':
                                elements.push(<h3 key={index} className="mb-0" data-block-id={block.id}><RichText children={block.children} /></h3>);
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
                                    elements.push(
                                        <p 
                                            key={index} 
                                            className="my-0 py-0.5"
                                        style={{  marginLeft: block.indent ? `${block.indent * 24}px` : undefined,  lineHeight: 1.9,}}
                                            
                                        >
                                            <RichText children={block.children} />
                                        </p>
                                    );
                                }
                                break;
                            case 'faq':
                                elements.push(<Faq key={index} faqData={faqData} visualMode={visualMode} />);
                                break;
                            case 'poll':
                                elements.push(<Polls key={index} pollData={pollData} visualMode={visualMode} />);
                                break;
                            case 'banner': {
                                const fi = blog?.blog_info?.featured_image;
                                const featuredImageUrl: string | null =
                                    (typeof fi === 'string' ? fi : fi?.url) || null;

                                // Skip entirely if the active template already renders a native hero
                                if (omitFeaturedBanner && featuredImageUrl) break;

                                if (featuredImageUrl) {
                                    elements.push(
                                        <figure key={index} className="group relative m-0 my-3" contentEditable={false}>
                                            <div className="relative w-full rounded-lg overflow-hidden">
                                                <NextImage
                                                    draggable="true"
                                                    src={optimizeCloudinaryImage(featuredImageUrl, 1200)}
                                                    alt={blog?.blog_title || 'Blog Banner'}
                                                    className="block w-full max-w-full object-cover px-0 rounded-sm my-0"
                                                    width={1200}
                                                    height={630}
                                                    priority
                                                    fetchPriority="high"
                                                    sizes="(max-width: 768px) 100vw, 800px"
                                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                                />
                                            </div>
                                        </figure>
                                    );
                                } else {
                                    // No featured image anywhere — fall back to the banner plugin template
                                    elements.push(
                                        <Banner
                                            key={index}
                                            bannerData={bannerData}
                                            visualMode={visualMode}
                                            width={block.width}
                                            align={block.align}
                                            blog={blog}
                                        />
                                    );
                                }
                                break;
                            }
                            case 'lead_magnet': {
                                // Match only the specific lead magnet for this block
                                const matchedLm = leadMagnetData?.find(
                                    (lm: any) => lm.lead_magnet_id === block.plugin_data_id
                                );
                                if (!matchedLm) break;

                                const isNewsletterLm =
                                    matchedLm.template_type === 'newsletter' ||
                                    matchedLm.template_type === 'news-letter';

                                const lmElement = (
                                    <LeadMagnet
                                        key={index}
                                        leadMagnetData={[matchedLm]}
                                        visualMode={visualMode}
                                    />
                                );

                                if (isNewsletterLm) {
                                    // Defer newsletters to be rendered last
                                    newsletterElements.push(lmElement);
                                } else {
                                    elements.push(lmElement);
                                }
                                break;
                            }
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
                            case 'date':
                                elements.push(
                                    <div key={index} className="my-4 flex items-center">
                                        <span className="inline-flex items-center rounded-md bg-muted/50 px-2.5 py-1 text-sm font-medium text-muted-foreground border border-gray-100 shadow-sm transition-colors hover:bg-muted/80">
                                            {formatSmartDate(block.date)}
                                        </span>
                                    </div>
                                );
                                break;
                            case 'youtube_video':
                                // Only render if video_id is present and NOT an unaccepted AI suggestion
                                if (block.video_id && !block.is_ai_suggested) {
                                    elements.push(
                                        <PublicYoutubeFacade
                                            key={index}
                                            videoId={block.video_id}
                                            videoTitle={block.video_title}
                                            channelName={block.channel_name}
                                        />
                                    );
                                }
                                break;
                            case 'infograph':
                                const currentInfographData = infographData ? infographData[block.plugin_data_id] : null;
                                elements.push(
                                    <Infograph key={index} infographData={currentInfographData} visualMode={visualMode} width={block.width} />
                                );
                                break;
                            case 'media_embed':
                                elements.push(
                                    <MediaEmbed key={index} block={block} index={index} />
                                );
                                break;
                            case 'blockquote':
                                elements.push(
                                    <blockquote 
                                        key={index} 
                                        className="slate-blockquote my-1 border-l-2 pl-6 italic text-[#0A0A0A]"
                                        data-block-id={block.id}
                                        style={{ position: 'relative' }}
                                    >
                                        <RichText children={block.children} />
                                    </blockquote>
                                );
                                break;
                            case 'hr':
                            case 'divider':
                                elements.push(<hr key={index} className="my-8 border-t-2 border-gray-100" />);
                                break;
                            case 'image':
                            case 'img':
                                const imgWidth = block.width || 800;
                                elements.push(
                                    <div key={index} className="my-8 flex justify-center">
                                        <NextImage
                                            src={optimizeCloudinaryImage(block.url || block.src, 1000)}
                                            alt={block.alt || 'Blog Image'}
                                            width={Number(imgWidth)}
                                            height={0}
                                            sizes="(max-width: 768px) 100vw, 800px"
                                            className="rounded-xl shadow-md h-auto" 
                                            style={{ width: `${imgWidth}px` }}
                                        />
                                    </div>
                                );
                                break;
                            default:
                                elements.push(
                                    <div 
                                        key={index} 
                                        className="my-0 py-0.5"
                                        style={block.indent ? { marginLeft: `${block.indent * 24}px` } : {}}
                                    >
                                        <RichText children={block.children} />
                                    </div>
                                );
                                break;
                        }
                    });

                    closeGroups(); // Flush final active groups

                    // Newsletters (lead_magnet type) always render last
                    newsletterElements.forEach(el => elements.push(el));

                    // Global newsletter template renders as the very last element
                    if (newsletterData?.is_newsletter_configured && newsletterData.template?.is_active) {
                        const tpl = newsletterData.template;
                        elements.push(
                            <div key="global-newsletter">
                                <NewsletterBlock tpl={tpl} blogId={blog?.blog_id ?? ''} />
                            </div>
                        );
                    }

                    return elements;
                })()}
        </div>
    );
};
;

export default RenderServerElement;
