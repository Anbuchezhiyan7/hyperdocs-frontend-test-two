import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useQueryState } from 'nuqs';
import { MetaDataForm } from '@/constants/forms/editor';
import { MetaDataSchema } from '@/schemas/editor';
import Form from '@/components/common/Form';
import { useEffect } from 'react';
import useBlogService from '@/services/blog.service';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import { CenteredModal } from '@/components/common/Modals';
import { useAuth } from '@/providers/auth.provider';
import { isTestingEmail } from '@/utils/test';
import Button from '@/components/common/Buttons';
import { useSuggestionService } from '@/services/suggestion.service';
import { useParams } from 'next/navigation';
import TagBadge from '@/components/blog-templates/components/TagBadge';
import { SparkleIcon } from '@/assets/icons';

export default function MetaDataModal () {
    const [mode, setMode] = useQueryState('mode');
    const [type, setType] = useQueryState('type');
    const [suggestionType, setSuggestionType] = useQueryState('suggestion_type');
    const { id: blogId } = useParams();
    const { updateBlog, isUpdatingBlog } = useBlogService();
    const { blog, handleBlogFieldChange } = useAppStore();
    const { handleAcceptOrDeclineSuggestion, isError, isLoading } = useSuggestionService();
    const { user } = useAuth();
    const isTesting = user?.email && isTestingEmail(user?.email);
    type FormSchema = z.infer<typeof MetaDataSchema>;
    const form = useForm<FormSchema>({
        mode: 'onChange',
        defaultValues: {
            title: blog?.blog_info?.custom_meta_data?.title || '',
            description: blog?.blog_info?.custom_meta_data?.description || '',
        },
    });

    // Simple length validation function
    const validateLength = (field: string, value: string, maxLength: number) => {
        const currentError = form.getFieldState(field as keyof FormSchema).error;
        const shouldShowError = value.length > maxLength;
        const errorMessage = `${field === 'title' ? 'Keep title under 50 chars for SEO best practice.' : 'Keep description under 150 chars for SEO best practice.'}`;
        
        // Only update if the error state needs to change
        if (shouldShowError && !currentError) {
            form.setError(field as keyof FormSchema, {
                type: 'manual',
                message: errorMessage,
            });
        } else if (!shouldShowError && currentError) {
            form.clearErrors(field as keyof FormSchema);
        }
    };

    // Watch for changes and validate length
    useEffect(() => {
        const subscription = form.watch((value) => {
            const currentTitle = value.title || '';
            const currentDescription = value.description || '';
            
            // Always validate both fields on any change
            validateLength('title', currentTitle, 50);
            validateLength('description', currentDescription, 150);
        });
        return () => subscription.unsubscribe();
    }, [form]);

    useEffect(() => {
        form.reset({
            title: blog?.blog_info?.custom_meta_data?.title || '',
            description: blog?.blog_info?.custom_meta_data?.description || '',
        });
    }, [blog]);

    const onSubmit = async (data: FormSchema) => {
        if (mode === 'seo-score') {
            handleAcceptOrDeclineSuggestion({
                blog_id: blogId as string,
                suggestion_type: suggestionType as string,
                accept: true,
            });
            setMode(null);
            setSuggestionType(null);
            setType(null);
        }

        await updateBlog({
            blog_info: {
                ...blog?.blog_info,
                custom_meta_data: {
                    title: data.title,
                    description: data.description,
                },
            },
        });
        toast.success('Blog meta data updated successfully');
        onClose();
    };

    const onClose = () => {
        if (suggestionType) {
            handleAcceptOrDeclineSuggestion({
                blog_id: blogId as string,
                suggestion_type: suggestionType as string,
                accept: false,
            });
            setMode(null);
        }

        form.reset({ title: '', description: '' });
        if (mode !== 'seo-score') {
            setMode('post_info');
        }
        setSuggestionType(null);
        setType(null);
    };

    useEffect(() => {
        if (type !== 'custom-metadata') {
            form.reset({
                title: blog?.blog_info?.custom_meta_data?.title || '',
                description: blog?.blog_info?.custom_meta_data?.description || '',
            });
        }
    }, [type]);

    const autoFill = () => {
        if (isTesting) {
            form.setValue('title', 'Test Title');
            form.setValue('description', 'Test Description');
            form.formState.isValid = true;
        }
    };

    console.log('BLOG', blog);

    const headerComponent =
        isTesting || suggestionType ? (
            <div className='flex items-center gap-4'>
                <p className='text-lg font-bold'>Advanced SEO Parameters</p>
                {suggestionType ? (
                    <TagBadge
                        onClick={() => {}}
                        className='cursor-pointer !uppercase flex gap-2 text-xs !bg-[#ffeee5] !text-primary !rounded-sm !font-semibold'
                        icon={<SparkleIcon className='w-4 h-4' />}
                        tag={{
                            tag_name: 'Suggested by ai',
                            tag_id: 'ai-suggested',
                        }}
                    />
                ) : (
                    <Button type='primary' onClick={autoFill}>
                        Auto Fill
                    </Button>
                )}
            </div>
        ) : undefined;

    return (
        <CenteredModal
            title='Advanced SEO Parameters'
            isOpen={type === 'custom_meta_data'}
            onClose={onClose}
            width={'60vw'}
            footerPriBtnProps={{
                onClick: form.handleSubmit(onSubmit),
                loading: isUpdatingBlog,
            }}
            footerSecBtnProps={{
                onClick: onClose,
            }}
            contentClassName='!z-50'
            headerComponent={headerComponent}
        >
            <div className='flex flex-col gap-4 w-full h-full max-h-[60vh] overflow-y-auto'>
                <Form fields={MetaDataForm} form={form} />
            </div>
        </CenteredModal>
    );
}
