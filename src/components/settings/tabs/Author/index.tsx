import { useState } from 'react';
import { Modal } from 'antd';
import AddAuthorCard from './AddAuthorCard';
import AuthorCard from './AuthorCard';
import SettingsHeader from '../partials/SettingsHeader';
import { useQueryState } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import authorApi from '@/api/authors.api';
import { useSendData } from '@/config/query.config';
import { showToast } from '@/components/common/Toast';
import AuthorCardSkeleton from './AuthorCardSkeleton';

const Author = () => {
    const [mode, setMode] = useQueryState('mode');
    const [id, setId] = useQueryState('id');
    const [authorToDelete, setAuthorToDelete] = useState<{ id: string; name: string } | null>(null);

    const handleAddAuthor = () => {
        setMode('author');
    };

    const { data: authors, isLoading } = useQuery({
        queryKey: ['authors'],
        queryFn: () => authorApi.handleGetAuthors(),
    });

    const handleEditAuthor = (authorId: string) => {
        setMode('author');
        setId(authorId);
    };

    const { mutate: removeAuthor, isPending: isDeleting } = useSendData<string>({
        fn: (authorId: string) => authorApi.handleDeleteAuthor(authorId),
        success: () => {
            showToast('Author removed successfully', 'success');
            setAuthorToDelete(null);
        },
        error: (err: any) => {
            showToast(err?.message || 'Failed to remove author', 'error');
        },
        invalidateKey: ['authors'],
    });

    const confirmDelete = () => {
        if (authorToDelete) removeAuthor(authorToDelete.id);
    };

    return (
        <div className='w-full max-w-[1200px] mx-auto'>
            <SettingsHeader title='Authors' description='Manage your authors and their roles' />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5'>
                <AddAuthorCard onClick={handleAddAuthor} />
                {isLoading ? (
                    <AuthorCardSkeleton count={3} />
                ) : (
                    authors?.map((author: any) => (
                        <AuthorCard
                            key={author.author_id}
                            name={author.author_name}
                            role={author.designation}
                            image={author.author_image?.url}
                            joinedDate={author.created_at}
                            onClick={() => handleEditAuthor(author.author_id || '')}
                            onDelete={() =>
                                setAuthorToDelete({
                                    id: author.author_id || '',
                                    name: author.author_name || '',
                                })
                            }
                            disableDelete={authors?.length === 1}
                        />
                    ))
                )}
            </div>

            <Modal
                title='Delete Author'
                open={!!authorToDelete}
                onOk={confirmDelete}
                onCancel={() => setAuthorToDelete(null)}
                okText='Delete'
                okType='danger'
                cancelText='Cancel'
                centered
                confirmLoading={isDeleting}
                cancelButtonProps={{ disabled: isDeleting }}
                closable={!isDeleting}
                maskClosable={!isDeleting}
                zIndex={4100}
            >
                <p>
                    Are you sure you want to delete "{authorToDelete?.name || 'this author'}"? This
                    action cannot be undone.
                </p>
            </Modal>
        </div>
    );
};

export default Author;
