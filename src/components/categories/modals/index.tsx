import { useEffect, useMemo } from 'react';
import { useQueryState } from 'nuqs';
import { CenteredModal } from '@/components/common/Modals';
import { useCategoryService } from '@/services/category.service';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categories.api';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategorySchema } from '@/schemas/categories';
import { z } from 'zod';
import { Input } from '@/components/common/Input';

const modalTitles = {
    create: 'Create Category',
    edit: 'Edit Category',
    remove: 'Remove Category',
};

const modalButtons = {
    create: 'Submit',
    edit: 'Save',
    remove: 'Remove',
};

const fields = [
    {
        name: 'category_name',
        label: 'Category Name',
        placeholder: 'Enter Category Name',
        type: 'text',
    },
];

interface CategoryModalProps {
    openModal?: boolean;
    handleModalClose?: () => void;
    onCategoryCreated?: (newCategory: any) => void;
}

const CategoryModal = ({ openModal, handleModalClose, onCategoryCreated }: CategoryModalProps) => {
    const [paramMode, setParamMode] = useQueryState('mode');
    const [id, setId] = useQueryState('id');

    const { handleCreateCategory, handleUpdateCategory, isLoading, isError } = useCategoryService();

    const { data: category, isLoading: isCategoryLoading } = useQuery({
        queryKey: ['category', id],
        queryFn: () => categoriesApi.handleGetCategoryById(id as string),
        enabled: !!id && paramMode === 'edit',
    });

    const form = useForm<z.infer<typeof CategorySchema>>({
        resolver: zodResolver(CategorySchema),
        defaultValues: category?.category_name,
    });

    const isOpen = useMemo(() => {
        return ['create', 'edit', 'add_new_category'].includes(paramMode || '');
    }, [paramMode]);

    const handleClose = () => {
        form.reset({
            category_name: '',
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
                const newCategory = await handleCreateCategory(formData);
                // Call the callback with the newly created category
                if (onCategoryCreated && newCategory) {
                    onCategoryCreated(newCategory);
                }
            } else if (paramMode === 'edit') {
                await handleUpdateCategory({
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
            category_name: category?.category_name,
        });
    }, [category]);

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
            {isCategoryLoading ? (
                <div className='space-y-2'>
                    <div className='h-4 w-28 rounded bg-gray-200 animate-pulse' />
                    <div className='h-10 w-full rounded-lg bg-gray-100 animate-pulse' />
                </div>
            ) : (
                <Input
                    name='category_name'
                    label='Category Name'
                    placeholder='Enter Category Name'
                    inputType='text'
                    onChange={value => form.reset({ category_name: value })}
                    error={form.formState.errors.category_name}
                    value={form.getValues()['category_name'] || ''}
                />
            )}
        </CenteredModal>
    );
};

export default CategoryModal;
