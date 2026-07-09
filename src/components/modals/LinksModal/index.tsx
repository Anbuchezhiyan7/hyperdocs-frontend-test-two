import { Input } from '@/components/common/Input';
import { DocumentIcon, TrashIcon } from '@/assets/icons';
import { Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';
import { FloatingLinkUrlInput } from '@udecode/plate-link/react';
import { useQuery } from '@tanstack/react-query';
import blogApi from '@/api/blog.api';
import { Spinner } from '@/components/plate-ui/spinner';
import { useAppStore } from '@/store/useAppStore';
import { DOMAIN_URL } from '@/constants/definitions';
import { CenteredModal } from '@/components/common/Modals';
import { useEditorRef } from '@udecode/plate/react';
import { linkPlugin } from '@/components/editor/plugins/link-plugin';

interface LinksModalProps {
    isOpen: boolean;
    defaultValue?: string;
    isEdit?: boolean;
    inputProps?: any;
}

const LinksModal: React.FC<LinksModalProps> = ({ isOpen, defaultValue, isEdit, inputProps }) => {
    const [type, setType] = useQueryState('type');
    const { settings } = useAppStore();

    const [searchLink, setSearchLink] = useState('');
    const [title, setTitle] = useState(defaultValue);

    const editor = useEditorRef();
    const linkPluginApi = editor.getApi(linkPlugin);

    const { data: blogs, isLoading } = useQuery({
        queryKey: ['blogs'],
        queryFn: () =>
            blogApi.handleGetAllBlogs({ blog_status: 'published' })?.then(res => res?.items),
    });

    const getBaseDomain = () => {
        if (settings?.domain?.main_domain && typeof settings.domain.main_domain === 'string' && settings.domain.main_domain.length > 0) {
            return `https://${settings?.domain?.main_domain}`;
        }

        if (settings?.domain?.sub_domain && typeof settings.domain.sub_domain === 'string' && settings.domain.sub_domain.length > 0) {
            return `https://${settings?.domain?.sub_domain}`;
        }

        if (settings?.domain?.sub_folder && typeof settings.domain.sub_folder === 'string' && settings.domain.sub_folder.length > 0) {
            return `https://${DOMAIN_URL}/blogs/${settings?.domain?.sub_folder}`;
        }

        return `https://${DOMAIN_URL}`;
    };

    const handleBlogClick = useCallback(
        (blog: Blog) => {
            const baseDomain = getBaseDomain();
            handleSearchLink(`${baseDomain}/${blog?.blog_info?.slug_url}`);
        },
        [getBaseDomain]
    );

    const handleInputChange = useCallback((value: string) => {
        console.log('value', value);
    }, []);

    const handleTitleChange = useCallback((value: string) => {
        setTitle(value);
    }, []);

    const handleRemoveLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();

        const { selection } = editor;
        if (!selection) return;

        // Find the link node at the current selection
        const [linkNode, linkPath] =
            Array.from(
                editor.api.nodes({
                    at: selection,
                    match: n => n.type === 'a',
                })
            )[0] || [];

        if (linkNode && linkPath) {
            // Unwrap the link to keep the text content
            editor.tf.unwrapNodes({
                at: linkPath,
                match: n => n.type === 'a',
            });

            // Close the modal
            handleClose();
        }
    };

    const handleSearchLink = useCallback((value: string) => {
        setSearchLink(value);
    }, []);

    const handleClose = () => {
        linkPluginApi.floatingLink.hide();
    };

    const handleSetSelectedUrl = () => {
        const { selection } = editor;
        if (!selection) return;

        // Find the link node at the current selection
        const [linkNode, linkPath] =
            Array.from(
                editor.api.nodes({
                    at: selection,
                    match: n => n.type === 'a',
                })
            )[0] || [];

        if (linkNode && linkPath) {
            setSearchLink(linkNode.url as string);
        }
    };

    useEffect(() => {
        handleSetSelectedUrl();
    }, [isOpen]);

    const handleSaveLink = () => {
        if (!searchLink) return;

        const fragment = linkPluginApi.getFragment(editor.selection?.anchor);
        const text = title || defaultValue || fragment?.[0]?.text || '';

        if (isEdit) {
            // Update existing link
            const { selection } = editor;
            if (!selection) return;

            // Find the link node at the current selection
            const [linkNode, linkPath] =
                Array.from(
                    editor.api.nodes({
                        at: selection,
                        match: n => n.type === 'a',
                    })
                )[0] || [];

            if (linkNode && linkPath) {
                // Update the link node with the new URL
                editor.tf.setNodes(
                    {
                        url: searchLink,
                    },
                    { at: linkPath }
                );
            }
        } else {
            // Create new link by wrapping selected text
            const { selection } = editor;
            if (!selection) return;

            // Get the selected text from the fragment
            const selectedText = fragment?.[0]?.text || text;

            // First, delete the selected text if it exists
            if (fragment?.[0]?.text) {
                editor.tf.deleteBackward('character');
            }

            // Then insert the link node
            editor.tf.insertNodes({
                type: 'a',
                url: searchLink,
                children: [{ text: selectedText as string }],
            });
        }

        handleClose();
    };

    return (
        <CenteredModal
            footerComponent={false}
            width={'60vw'}
            isOpen={isOpen}
            onClose={handleClose}
            title={isEdit ? 'Edit Link' : 'Add Link'}
            footerPriBtnProps={{
                onClick: handleSaveLink,
            }}
            headerComponent={
                isEdit ? (
                    <div className='flex flex-row items-center justify-between w-[100%] gap-2'>
                        <h2 className='font-medium'>Edit Link</h2>
                        <Button
                            icon={<TrashIcon />}
                            variant='outlined'
                            className='h-fit py-1 hover:!text-black hover:!border-stroke'
                            onClick={handleRemoveLink}
                        >
                            Remove Link
                        </Button>
                    </div>
                ) : null
            }
            headerClassName='flex-row w-[96%] pb-2'
        >
            <div {...inputProps} onMouseDown={e => e.stopPropagation()}>
                <FloatingLinkUrlInput
                    className='hover:border-stroke px-3 mb-4 rounded-lg h-[35px] border w-full text-xs focus:!border-b-[2px] !bg-background-input focus:border-r-[2px] focus:border-black focus:bg-input-background border-stroke placeholder:text-xs placeholder:text-gray-500'
                    placeholder='Paste link or select blog'
                    data-plate-focus
                    onChange={e => handleSearchLink(e.target.value)}
                    value={searchLink}
                />
            </div>
            {!isEdit && (
                <div onMouseDown={e => e.stopPropagation()}>
                    <Input
                        placeholder='Title'
                        name='link-title'
                        label='Link Title'
                        labelClassName='text-gray-500'
                        inputType='text'
                        value={defaultValue || ''}
                        onChange={value => handleTitleChange(value as string)}
                    />
                </div>
            )}
            <div
                onMouseDown={e => e.stopPropagation()}
                className='flex flex-col w-full h-full flex-1 mt-4'
            >
                <h2 className='font-medium mb-2 text-gray-500'>All Blogs</h2>
                <div className='flex flex-col px-1 p-2 gap-3 overflow-y-auto max-h-[40dvh] no-scrollbar'>
                    {isLoading ? (
                        <div className='flex h-[30dvh] items-center justify-center'>
                            <Spinner className='w-10 h-10' />
                        </div>
                    ) : (
                        blogs?.map((blog: Blog, index: number) => (
                            <div
                                key={index}
                                className='flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-md p-2'
                                onMouseDown={e => {
                                    e.stopPropagation();
                                    handleBlogClick(blog);
                                }}
                            >
                                <DocumentIcon className='text-gray-500' />
                                <span className='text-gray-700 text-xs'>{blog?.blog_title}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </CenteredModal>
    );
};

export default LinksModal;
