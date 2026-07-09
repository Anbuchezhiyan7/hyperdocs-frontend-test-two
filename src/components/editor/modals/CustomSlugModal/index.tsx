'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useQueryState } from 'nuqs';
import { Input } from '@/components/common/Input';
import { CenteredModal } from '@/components/common/Modals';
import InfoBanner from '@/components/common/InfoBanner';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/providers/auth.provider';
import { isTestingEmail } from '@/utils/test';
import Button from '@/components/common/Buttons';
import { useEffect } from 'react';
import blogApi from '@/api/blog.api';
import { useSendData } from '@/config/query.config';
import { useParams } from 'next/navigation';
import slugify from 'slugify';

const SlugSchema = z.object({
    slug_url: z.string().refine(val => val.length > 0, {
        message: 'Slug URL is required',
    }),
});

export default function CustomSlugModal () {
    const [type, setType] = useQueryState('type');
    const [mode, setMode] = useQueryState('mode');
    const { blog } = useAppStore();
    const { user } = useAuth();
    const isTesting = user?.email && isTestingEmail(user?.email);
    const { id } = useParams();
    

    type FormSchema = z.infer<typeof SlugSchema>;
    const form = useForm<FormSchema>({
        resolver: zodResolver(SlugSchema),
        defaultValues: {
            slug_url: blog?.blog_info?.slug_url || '',
        },
    });

    useEffect(() => {
        form.reset({
            slug_url: blog?.blog_info?.slug_url || slugify(blog?.blog_title || '', { lower: true, strict: true, trim: true, remove: /[*+~.()'"!:@]/g }),
        });
    }, [blog]);

    const { mutateAsync: validateAndUpdateSlug, isPending: isValidatingSlug } = useSendData({
        fn: (payload: any) => blogApi.handleValidateAndUpdateSlug(payload),
        success: () => {
            toast.success('Slug URL updated successfully');
            onClose();
        },
        error: error => {
            console.log('SLUG ERROR', error);
            if (error.status === 400) {
                form.setError('slug_url', { message: error.data?.detail });
            }
            toast.error('Failed to validate slug');
        },
        invalidateKey: ['blog', id as string],
    });

    const onSubmit = (data: FormSchema) => {
        validateAndUpdateSlug({
            blog_info: {
                slug_url: data.slug_url.replace('/', ''),
            },
            blog_id: id as string,
        });
    };

    const onClose = () => {
        form.reset({ slug_url: '' });
        setMode('post_info');
        setType(null);
    };

    const autoFill = () => {
        if (isTesting) {
            form.setValue('slug_url', 'test-slug');
            form.formState.isValid = true;
        }
    };

    const handleChange = (value: string) => {
        // Replace spaces with hyphens
        const sanitizedValue = value.replace(/\s+/g, '-').toLowerCase();
        form.setValue('slug_url', sanitizedValue);
        form.trigger('slug_url');
    };

    const domain = `https://subdomain.hyperblog.io/blogs`;

    return (
        <CenteredModal
            title='Set Custom Slug'
            isOpen={type === 'slug_url'}
            onClose={onClose}
            width={'60vw'}
            footerPriBtnProps={{
                onClick: form.handleSubmit(onSubmit),
                loading: isValidatingSlug,
                disabled: form.watch('slug_url')?.trim() === '',
            }}
            footerSecBtnProps={{
                onClick: onClose,
            }}
            contentClassName='!z-50'
            headerComponent={
                isTesting ? (
                    <div className='flex items-center gap-4'>
                        <p className='text-lg font-bold'>Set Custom Slug</p>
                        <Button type='primary' onClick={autoFill}>
                            Auto Fill
                        </Button>
                    </div>
                ) : undefined
            }
        >
            <div className='flex flex-col gap-4 w-full h-full justify-between min-h-[30vh] max-h-[60vh] overflow-y-auto'>
                <div className='flex flex-col gap-2 w-full'>
                    <Input
                        label='Slug Url'
                        name='slug_url'
                        inputType='text'
                        placeholder='Enter Slug Url'
                        onChange={handleChange}
                        value={form.watch('slug_url')}
                        error={form.formState.errors.slug_url?.message}
                    />
                    <div className='flex flex-col gap-2 w-full'>
                        <p className='text-sm font-medium text-gray-500'>
                            This is what your post url will look like:
                        </p>
                        <p className='text-xs'>
                            {`${domain}/${form.watch('slug_url') || 'untitled'}`}
                        </p>
                    </div>
                </div>
                <InfoBanner
                    content='This is to be modified by experts only. Hyperblog takes care of the url slug usually.'
                    variant='warning'
                    fullWidth
                />
            </div>
        </CenteredModal>
    );
}
