import { useEffect, useMemo } from 'react';
import { useQueryState } from 'nuqs';
import { CenteredModal } from '@/components/common/Modals';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/common/Input';
import { tagsApi } from '@/api/tags.api';
import { useTagService } from '@/services/tag.service';
import { TagSchema } from '@/schemas/tags';

const modalTitles = {
    create: 'Create Tag',
    edit: 'Edit Tag',
    remove: 'Remove Tag',
};

const modalButtons = {
    create: 'Submit',
    edit: 'Save',
    remove: 'Remove',
};

const fields = [
    {
        name: 'tag_name',
        label: 'Tag Name',
        placeholder: 'Enter Tag Name',
        type: 'text',
    },
];

interface TagModalProps {
    openModal?: boolean;
    handleModalClose?: () => void;
    onTagCreated?: (newTag: any) => void;
}

const TagModal = ({ openModal, handleModalClose, onTagCreated }: TagModalProps) => {
    const [paramMode, setParamMode] = useQueryState('mode');
    const [id, setId] = useQueryState('id');

    const { handleCreateTag, handleUpdateTag, isLoading, isError } = useTagService();

    const { data: tag, isLoading: isTagLoading } = useQuery({
        queryKey: ['tag', id],
        queryFn: () => tagsApi.handleGetTagById(id as string),
        enabled: !!id && paramMode === 'edit',
    });

    const form = useForm<z.infer<typeof TagSchema>>({
        resolver: zodResolver(TagSchema),
        defaultValues: tag?.tag_name,
    });

    const isOpen = useMemo(() => {
        return ['create', 'edit', 'add_new_tag'].includes(paramMode || '');
    }, [paramMode]);

    const handleClose = () => {
        form.reset({
            tag_name: '',
        });
        if(!openModal){
            setParamMode(null);
            setId(null);
        }
        handleModalClose?.();
    };

    const handleSubmit = async () => {
        try {
            const isValid = await form.trigger();
            if (!isValid) return;

            const formData = form.getValues();

            if (paramMode === 'create' || openModal) {
                const newTag = await handleCreateTag(formData);
                // Call the callback with the newly created tag
                if (onTagCreated && newTag) {
                    onTagCreated(newTag);
                }
            } else if (paramMode === 'edit') {
                await handleUpdateTag({
                    id: id as string,
                    payload: formData,
                });
            }

            if (isError) return;

            handleClose();
        } catch (error: any) {
            toast.error(error.message || 'An error occurred while processing your request');
        }
    };

    useEffect(() => {
        form.reset({
            tag_name: tag?.tag_name,
        });
    }, [tag]);

    return (
        <CenteredModal
            isOpen={isOpen || openModal || false}
            title={modalTitles[paramMode as keyof typeof modalTitles]}
            onClose={handleClose}
            defaultFooterClassName='w-full'
            width={450}
            childrenClassName='!min-h-[120px] pt-5'
            footerPriBtnLabel={modalButtons[paramMode as keyof typeof modalButtons]}
            footerPriBtnProps={{
                onClick: form.handleSubmit(handleSubmit),
                loading: isLoading,
                disabled: paramMode === 'remove' ? false : !form.formState.isValid,
            }}
        >
            {isTagLoading ? (
                <div className='space-y-2'>
                    <div className='h-4 w-28 rounded bg-gray-200 animate-pulse' />
                    <div className='h-10 w-full rounded-lg bg-gray-100 animate-pulse' />
                </div>
            ) : (
                <Input
                    name='tag_name'
                    label='Tag Name'
                    placeholder='Enter Tag Name'
                    inputType='text'
                    onChange={value => form.reset({ tag_name: value })}
                    error={form.formState.errors.tag_name}
                    value={form.getValues()['tag_name'] || ''}
                />
            )}
        </CenteredModal>
    );
};

export default TagModal;
