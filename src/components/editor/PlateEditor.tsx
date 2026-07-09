'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCreateEditor } from '@/hooks/use-create-editor';
import { Plate, PlateCorePlugin, TPlateEditor, ParagraphPlugin } from '@udecode/plate/react';
import { Value } from '@udecode/plate';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import { useAppStore } from '@/store/useAppStore';
import { useParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import useBlogService from '@/services/blog.service';
import blogApi from '@/api/blog.api';
import { useQueries } from '@tanstack/react-query';
import EditorSkeleton from './EditorSkeleton';
import { apiGetSettings } from '@/api/settings';
import { transformBlogContent } from '@/utils/editor';
import { useEffect, useState, useRef } from 'react';
import { extractPercentageScore } from '@/utils/seo-score';
import authorApi from '@/api/authors.api';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { useOnboardingStore } from '@/store/useOnboardingStore';

interface PlateEditorProps {
    content?: any[];
    isSingleBlogPage?: boolean;
}

export function PlateEditor({ content, isSingleBlogPage = false }: PlateEditorProps) {
    const params = useParams();
    const blogId = params.id as string;
    const { handleBlogFieldChange, setBlog, resetBlog, setSettings, blog, setHasContentChanged } =
        useAppStore();
    const { updateBlog, handleGetSeoScore } = useBlogService(blogId as string);
    const editor = useCreateEditor({
        value: [
            { type: HEADING_KEYS.h1, children: [{ text: '' }] },
            { type: ParagraphPlugin.key, children: [{ text: '' }] }
        ],
    });
   
    const [originalBlogContent, setOriginalBlogContent] = useState(blog?.content);
    const hasAutoAssignedAuthor = useRef(false);

    // ── Onboarding: listen for demo content insertion + signal editor-intro loaded
    const { isActive: isOnboarding, phase: onboardingPhase, setPhase: setOnboardingPhase } = useOnboardingStore();

    // Clear blog from store when leaving the editor so the next visit
    // starts from a clean slate and PUTs can't be built from stale fields.
    useEffect(() => {
        return () => {
            resetBlog();
        };
    }, [resetBlog]);

    useEffect(() => {
        if (!isOnboarding) return;
        // Handle demo content insertion event from EditorOnboarding
        const handleInsert = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail?.content && Array.isArray(detail.content)) {
                editor?.tf?.setValue(detail.content as any);
                handleBlogFieldChange('content', detail.content as any);
            }
        };
        window.addEventListener('onboarding:insert-content', handleInsert);
        return () => window.removeEventListener('onboarding:insert-content', handleInsert);
    }, [isOnboarding, editor, handleBlogFieldChange]);

    const fetchBlog = async () => {
        const response = await blogApi.handleGetBlog(blogId as string);
        return response?.data;
    };

    const {
        '0': { data: authors, isLoading: isGettingAuthors },
    } = useQueries({
        queries: [
            {
                queryKey: ['authors'],
                queryFn: () => authorApi.handleGetAuthors(),
            },
        ],
    });

    useEffect(() => {
        if (isSingleBlogPage && Array.isArray(content) && content.length > 0) {
            editor?.tf?.setValue(content);
        }
    }, [isSingleBlogPage, content, editor]);

    const {
        '0': { isLoading: settingsLoading, data: settingsData },
        '1': { data: blogData, isLoading: blogLoading },
    } = useQueries({
        queries: [
            {
                queryKey: ['settings'],
                queryFn: () => apiGetSettings(),
            },
            {
                queryKey: ['blog', blogId],
                queryFn: () => fetchBlog(),
                enabled: !!blogId && !isSingleBlogPage,
                // The global default is 5 min staleTime, which would serve
                // the cached blog on back-nav and skip the GET. The editor
                // needs the latest server state every time it mounts.
                staleTime: 0,
                refetchOnMount: 'always',
            },
        ],
    });

    // Synchronously update settings when loaded
    useEffect(() => {
        if (settingsData) {
            setSettings(settingsData);
        }
    }, [settingsData, setSettings]);

    // Initialize editor and store when blog data loads.
    // Depends on blogLoading/settingsLoading so setValue runs AFTER the editor
    // is visible (not while the Loader overlay is still showing).
    useEffect(() => {
        if (!blogLoading && !settingsLoading && blogData && !isSingleBlogPage) {
            const rawContent = Array.isArray(blogData?.content) ? blogData.content : [];
            const contentToUse = rawContent.filter(
                (node: any) => node && typeof node === 'object' && Array.isArray(node.children)
            );
            if (contentToUse.length > 0) {
                editor?.tf?.setValue(contentToUse as any);
            }
            // Empty blog: editor already defaults to h1 (set in useCreateEditor), no setValue needed
            setBlog({ ...blogData, content: contentToUse as any });
            setOriginalBlogContent(contentToUse as any);
            setHasContentChanged(false);
        }
    }, [blogData, blogLoading, settingsLoading, isSingleBlogPage, editor, setBlog, setHasContentChanged]);

    // Auto-select first author when blog has no author
    useEffect(() => {
        // Reset the ref when blogId changes (new blog loaded)
        if (blogId) {
            hasAutoAssignedAuthor.current = false;
        }
    }, [blogId]);

    useEffect(() => {
        // Only proceed if blog data and authors are loaded, and we haven't already auto-assigned
        if (
            isGettingAuthors ||
            !authors ||
            !Array.isArray(authors) ||
            authors.length === 0 ||
            hasAutoAssignedAuthor.current
        ) {
            return;
        }

        // Check if blog has no author (check both author_id and author_details)
        const hasNoAuthor = !blogData?.author_id && !blogData?.author_details;

        if (hasNoAuthor && blogData) {
            // Get the first author's ID from the response (no sorting needed)
            const firstAuthorId = authors?.[0]?.author_id;

            if (firstAuthorId) {
                // Mark as auto-assigned to prevent multiple calls
                hasAutoAssignedAuthor.current = true;

                // Update local state immediately for UI feedback
                handleBlogFieldChange('author_id', firstAuthorId);
                handleBlogFieldChange('author_details', authors?.[0]);

                // Update via API
                updateBlog({ author_id: firstAuthorId });
            }
        }
    }, [blogData, authors, isGettingAuthors, handleBlogFieldChange, updateBlog]);

    // if (isError) {
    //     return <div>There was an error fetching the blog. Please try again later.</div>;
    // }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check for CMD/CTRL + Z (undo)
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
                e.stopPropagation();
                e.preventDefault();
                editor.undo();
            }
            // Check for CMD/CTRL + SHIFT + Z or CMD/CTRL + Y (redo)
            if ((e.metaKey || e.ctrlKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
                e.preventDefault();
                e.stopPropagation();
                editor.redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [editor]);

    const handleChange = (options: {
        editor: TPlateEditor<Value, PlateCorePlugin>;
        value: Value;
    }) => {
        handleBlogFieldChange('content', options.value);
        // Only save when content actually differs from the loaded blog.
        // Prevents a PUT firing on initial mount / programmatic setValue,
        // which would overwrite the server with the editor's default state.
        if (!originalBlogContent) return;
        const changed =
            JSON.stringify(originalBlogContent) !== JSON.stringify(options.value);
        if (changed) {
            setHasContentChanged(true);
            debouncedUpdate(options.value);
        } else {
            setHasContentChanged(false);
        }
    };

    const debouncedUpdate = useDebouncedCallback((value: Value) => {
        if (blogId && value) {
            // Derive the title from the current H1 so the PUT body always
            // matches what the user sees — never trust the store, which may
            // be momentarily stale during navigation.
            const titleFromH1 =
                typeof value?.[0]?.children?.[0]?.text === 'string'
                    ? (value[0].children[0].text as string)
                    : '';
            updateBlog({
                blog_title: titleFromH1,
                content: value,
            });
        }
    }, 1000);

    const isLoading = settingsLoading || blogLoading;

    return (
        <div className="w-full h-full flex flex-col min-h-0 z-10" data-registry="plate" data-tour="editor">
            {isLoading && <EditorSkeleton />}
            <div className={`h-full flex flex-col pt-20${isLoading ? ' hidden' : ''}`}>
                <DndProvider backend={HTML5Backend}>
                    <Plate editor={editor} onChange={handleChange}>
                        <EditorContainer className="flex-1 mt-0 h-auto">
                            <Editor variant="fullWidth" />
                        </EditorContainer>
                    </Plate>
                </DndProvider>
            </div>
        </div>
    );
}
