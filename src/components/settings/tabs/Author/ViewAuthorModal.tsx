'use client';

import Button from '@/components/common/Buttons';
import { cn } from '@/utils/cn';
import CenteredModal from '@/components/common/Modals/CenteredModal';
import { useQueryState } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import authorApi from '@/api/authors.api';
import { useSendData } from '@/config/query.config';
import AuthorView from './AuthorView';

const ViewAuthorModal = () => {
    const [mode, setMode] = useQueryState('mode');
    const [section, setSection] = useQueryState('section');
    const [id, setId] = useQueryState('id');
    const [authorId, setAuthorId] = useQueryState('authorId');

    const isOpen = mode === 'view-author' || section === 'author-details';

    const onClose = () => {
        if(section === 'author-details'){
            setAuthorId(null);
            setSection(null);
        }
        else{
            setMode(null);
            setId(null);
            setSection(null);
        }
    };

    const handleEdit = () => {
        setMode('author');
    };

    const { data: author, isLoading } = useQuery({
        queryKey: ['author', id, authorId],
        queryFn: () => authorApi.handleGetAuthorById(id || authorId || ''),
        enabled: !!id && mode === 'view-author' || !!authorId && section === 'author-details',
    });

    const { mutate: removeAuthor, isPending: isRemoving } = useSendData({
        fn: () => authorApi.handleDeleteAuthor(id || ''),
        success: () => {
            onClose();
        },
        invalidateKey: ['authors'],
    });

    const headerComponent = (
        <div className='flex flex-row justify-between items-center'>
            <Button type='default' onClick={onClose} className={cn('rounded-xl h-9')}>
                Go back
            </Button>

            {
                section !== 'author-details' && (
                    <div className='flex items-center gap-2'>
                <Button
                    danger
                    type='default'
                    onClick={() => removeAuthor(id || '')}
                    className={cn('rounded-xl h-9')}
                    loading={isRemoving}
                    >
                    Remove Author
                </Button>
                <Button type='primary' onClick={handleEdit} className={cn('rounded-xl h-9')}>
                    Edit details
                </Button>
            </div>
                )}
        </div>
    );

    return (
        <CenteredModal
            width='80vw'
            height='90vh'
            title={author?.author_name}
            onClose={onClose}
            isOpen={isOpen}
            hideFooter
            headerComponent={headerComponent}
            zIndex={4000}
            hideCloseIcon
            contentClassName='h-[calc(100vh-100px)] relative'
        >
            <AuthorView author={author} isLoading={isLoading} />
        </CenteredModal>
    );
};

export default ViewAuthorModal;
