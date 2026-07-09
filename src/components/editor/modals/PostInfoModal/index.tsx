import React, { useState, useCallback, useRef, useEffect } from 'react';
import RightPannel from '@/components/common/SidePanel';
import { useQueryState } from 'nuqs';
import BasicDetailsSection from './BasicDetailsSection';
import SectionWrapper from './SectionWrapper';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import InfoCard from './InfoCard';

import { useQueries, useQuery } from '@tanstack/react-query';
import pollsApi from '@/api/polls.api';
import Loader from '@/components/common/Loader';
import { useParams } from 'next/navigation';
import { tagsApi } from '@/api/tags.api';
import { categoriesApi } from '@/api/categories.api';
import { convertToSelectOptions } from '@/utils/format/string';
import useBlogService from '@/services/blog.service';
import authorApi from '@/api/authors.api';
import { Avatar } from 'antd';
import AddEditAuthorModal from '@/components/settings/tabs/Author/AddEditAuthorModal';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import blogApi from '@/api/blog.api';
import AddEditCategoryModal from '@/components/categories/modals';
import AddEditTagModal from '@/components/tags/modals';
import { toast } from 'sonner';
import ViewAuthorModal from '@/components/settings/tabs/Author/ViewAuthorModal';
import { Loader2 } from 'lucide-react';

const OtherInfoSection = [
    { title: 'Set Custom Metadata', id: 'custom_meta_data', required: false },
    { title: 'Set Custom Slug URL', id: 'slug_url', required: false },
    { title: 'Set Schema Markup', id: 'schema_markup', required: false },
    { title: 'Set Canonical Url', id: 'canonical_url', required: false },
    { title: 'Custom JS (Optional)', id: 'custom_script', required: false },
];

const PostInfo: React.FC = () => {
    const [mode, setMode] = useQueryState('mode', { defaultValue: 'editor' });
    const [type, setType] = useQueryState('type');
    const [openAuthorModal, setOpenAuthorModal] = useState(false);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [openTagModal, setOpenTagModal] = useState(false);
    const { handleBlogFieldChange, blog, setBlog } = useAppStore();
    const blogId = useParams().id;
    const { updateBlog, isUpdatingBlog, isPublishable, isValidInfo } = useBlogService();
    const [authorId, setAuthorId] = useQueryState('authorId');
    const [section, setSection] = useQueryState('section');
    const [isSubmittingKeyword, setIsSubmittingKeyword] = useState(false);

        // Always fetch blog info to ensure author details are available
        const { data: blogInfo } = useQuery({
            queryKey: ['blog_info', blogId],
            queryFn: () =>
                blogApi.handleGetBlogInfo(blogId as string).then(res => {
                    setBlog({ ...blog, ...res });
                    return res;
                }),
            enabled: !!blogId && mode === 'post_info',
        });

    // Create a stable debounced update function
    const debouncedUpdateRef = useRef(
        debounce(async (data: any) => {
            await updateBlog(data);
            // Get the field name for a more specific message
            const fieldName = Object.keys(data)[0];
            const fieldDisplayNames: { [key: string]: string } = {
                seo_focus_keyword: 'SEO Focus Keyword',
                author_id: 'Author',
                category: 'Category',
                tags: 'Tags',
            };
            const displayName = fieldDisplayNames[fieldName] || 'Blog';
            toast.success(`${displayName} updated successfully!`);
        }, 500)
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            debouncedUpdateRef.current.cancel();
        };
    }, []);

    const handleUpdateBlog = useCallback(
        (key: string, value: any) => {
            // Update local state immediately for UI feedback
            handleBlogFieldChange(key, value);
            // Debounce the API call
            debouncedUpdateRef.current({ [key]: value });
        },
        [handleBlogFieldChange, debouncedUpdateRef]
    );

    // Callback handlers for newly created items
    const handleCategoryCreated = useCallback(
        (newCategory: any) => {
            // Auto-apply the newly created category
            handleUpdateBlog('category', newCategory.category_id);
        },
        [handleUpdateBlog]
    );

    const handleAuthorCreated = useCallback(
        (newAuthor: any) => {
            // Auto-apply the newly created author
            handleUpdateBlog('author_id', newAuthor.author_id);
        },
        [handleUpdateBlog]
    );

    const handleTagCreated = useCallback(
        (newTag: any) => {
            // Auto-apply the newly created tag
            const currentTags = blog?.tags?.map((tag: any) => tag?.tag_id) || [];
            const updatedTags = [...currentTags, newTag.tag_id];
            handleUpdateBlog('tags', updatedTags);
        },
        [handleUpdateBlog, blog?.tags]
    );

    // Blog info is now fetched at the EditorComponent level
    const isGettingBlogInfo = false; // No longer needed since query is moved to parent

    const { isValid, errors } = isPublishable();

    const {
        '0': { data: polls, isLoading: isGettingAllPolls },
        '1': { data: tags, isLoading: isGettingAllTags },
        '2': { data: categories, isLoading: isGettingAllCategories },
        '3': { data: authors, isLoading: isGettingAuthors },
    } = useQueries({
        queries: [
            {
                queryKey: ['polls'],
                queryFn: () => pollsApi.handleGetAllPolls(blogId as string),
                enabled: !!blogId,
            },
            {
                queryKey: ['tags'],
                queryFn: () => tagsApi.handleGetAllTags(),
            },
            {
                queryKey: ['categories'],
                queryFn: () => categoriesApi.handleGetAllCategories(),
            },
            {
                queryKey: ['authors'],
                queryFn: () => authorApi.handleGetAuthors(),
            },
        ],
    });

    if (isGettingAllPolls || isGettingAllTags || isGettingAllCategories) return <Loader />;

    const categoriesOptions = convertToSelectOptions(
        categories || [],
        'category_id',
        'category_name'
    );
    const tagsOptions = convertToSelectOptions(tags || [], 'tag_id', 'tag_name');
    const authorOptions = convertToSelectOptions(
        authors?.sort(
            (a: any, b: any) =>
                dayjs().millisecond(a.created_at) > dayjs().millisecond(b.created_at)
        ) || [],
        'author_id',
        'author_name',
        {
            key: 'avatar',
            value: 'author_image',
        }
    );

    const handleSetType = (type: string) => {
        setMode(null);
        setType(type);
    };

    const handleCreateNewCategory = () => {
        setOpenCategoryModal(!openCategoryModal);
    };

    const handleCreateNewAuthor = () => {
        setOpenAuthorModal(!openAuthorModal);
    };

    const handleCreateNewTag = () => {
        setOpenTagModal(!openTagModal);
    };

    const handleViewAuthor = (authorId: string) => {
        setAuthorId(authorId);
        setSection('author-details');
    };

    console.log('AUTH OPTIONS', authorOptions);

    return (
        <RightPannel header="Post Info" open={mode === 'post_info'} onClose={() => setMode(null)}>
            <ViewAuthorModal/>
            {/* <BlurLoader loading={isUpdatingBlog} /> */}
            <SectionWrapper title="Basic Details">
                <BasicDetailsSection
                    status={blog?.blog_status || 'Draft'}
                    date={blog?.created_at || ''}
                    lastUpdated={blog?.updated_at || ''}
                />
                <AddEditAuthorModal
                    open={openAuthorModal}
                    close={handleCreateNewAuthor}
                    onAuthorCreated={handleAuthorCreated}
                />
                <AddEditCategoryModal
                    openModal={openCategoryModal}
                    handleModalClose={handleCreateNewCategory}
                    onCategoryCreated={handleCategoryCreated}
                />
                <AddEditTagModal
                    openModal={openTagModal}
                    handleModalClose={handleCreateNewTag}
                    onTagCreated={handleTagCreated}
                />
            </SectionWrapper>
            <SectionWrapper title="SEO Focus Keyword">
                <div className="flex gap-2 items-center">
                    <Input
                        placeholder="Enter SEO Focus Keyword"
                        inputType="text"
                        value={blog?.seo_focus_keyword}
                        name="seo_focus_keyword"
                        inputClassName="mb-0 border border-black"
                        className="!mb-0 flex-1"
                        onChange={value => handleBlogFieldChange('seo_focus_keyword', value)}
                        disabled={isGettingBlogInfo || isUpdatingBlog}
                    />
                    <Button 
                        className='h-[34px] w-[80px]'
                        onClick={async () => {
                            setIsSubmittingKeyword(true);
                            try {
                                await updateBlog({ seo_focus_keyword: blog?.seo_focus_keyword });
                                toast.success('SEO Focus Keyword updated successfully!');
                            } finally {
                                setIsSubmittingKeyword(false);
                            }
                        }}
                        disabled={isGettingBlogInfo || isUpdatingBlog || isSubmittingKeyword || !blog?.seo_focus_keyword?.trim()}
                    >
                        {isSubmittingKeyword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                    </Button>
                </div>
            </SectionWrapper>
            <SectionWrapper title="Author" isRequired={true}>
                <Input
                    placeholder="Search and select author"
                    options={authorOptions as any}
                    inputType="select"
                    value={blog?.author_details?.author_id || ''}
                    name="author_id"
                    inputClassName="mb-0 border border-black"
                    className="!mb-0"
                    onChange={value => handleUpdateBlog('author_id', value)}
                    isLoading={isGettingBlogInfo}
                    isCreatable
                    buttonLabel="Add new author"
                    onOptionButtonClick={handleCreateNewAuthor}
                    required={true}
                    optionRender={(option: any) => (
                        <div className='flex items-center justify-between w-full'>
                            <div className='flex items-center'>
                                {option?.data.avatar && (
                                    <Avatar src={option.data?.avatar} style={{ marginRight: 8 }} />
                                )}
                                {option.label}
                            </div>
                            <div
                                className="text-primary text-sm cursor-pointer hover:underline hover:opacity-80 transition-all duration-300 mr-2"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleViewAuthor(option.value);
                                }}
                            >
                                View
                            </div>
                        </div>
                    )}
                />
            </SectionWrapper>
            <SectionWrapper title="Category" isRequired={false}>
                <Input
                    placeholder="Search and select category"
                    options={categoriesOptions as any}
                    inputType="select"
                    value={blog?.category?.category_name}
                    name="category"
                    inputClassName="mb-0 border border-black"
                    className="!mb-0"
                    onChange={value => handleUpdateBlog('category', value)}
                    isLoading={isGettingBlogInfo}
                    isCreatable
                    buttonLabel="Add new category"
                    onOptionButtonClick={handleCreateNewCategory}
                    disabled={isGettingBlogInfo || isUpdatingBlog}
                    required={false}
                />
            </SectionWrapper>
            <SectionWrapper title="Tags" isRequired={false}>
                <Input
                    placeholder="Search and select tags"
                    options={tagsOptions as any}
                    inputType="select"
                    value={blog?.tags?.map((tag: any) => tag?.tag_id) || []}
                    variant="multi"
                    name="tags"
                    inputClassName="mb-0 border border-black"
                    className="!mb-0"
                    onChange={value => handleUpdateBlog('tags', value)}
                    isLoading={isGettingBlogInfo || isUpdatingBlog}
                    disabled={isGettingBlogInfo || isUpdatingBlog}
                    required={false}
                    isCreatable
                    buttonLabel="Add new tag"
                    onOptionButtonClick={handleCreateNewTag}
                />
            </SectionWrapper>
            {/* {polls?.length > 0 && (
                <SectionWrapper title='Poll Response'>
                    {polls?.map((response: Poll) => (
                        <InfoCard title={`Poll: ${response.poll_title}`} key={response.poll_id} />
                    ))}
                </SectionWrapper>
            )} */}
            <SectionWrapper title="Other Info">
                {OtherInfoSection.map(section => (
                    <InfoCard
                        title={section.title}
                        key={section.id}
                        onClick={() => handleSetType(section.id)}
                        isChecked={isValidInfo(section.id as keyof BlogInfo)}
                        required={section.required}
                    />
                ))}
            </SectionWrapper>
        </RightPannel>
    );
};

export default PostInfo;
