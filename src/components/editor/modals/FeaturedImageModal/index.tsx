'use client';

import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useQueryState } from 'nuqs';
import UploadInfo from '@/components/common/UploadInfo';
import { CenteredModal } from '@/components/common/Modals';
import FileUploader from '@/components/common/Input/Upload';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import useBlogService from '@/services/blog.service';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/providers/auth.provider';
import { isTestingEmail } from '@/utils/test';
import Button from '@/components/common/Buttons';
import { useEffect, useState } from 'react';
import { useUploadFile } from '@/hooks/use-upload';

const FeaturedImageSchema = z.object({
    featured_image: z
        .union([
            z.instanceof(File),
            z.object({
                image_id: z.string(),
                url: z.string(),
            }),
        ])
        .refine(val => val instanceof File || typeof val === 'object', {
            message: 'Please upload an image',
        }),
});

type FormSchema = z.infer<typeof FeaturedImageSchema>;

export default function FeaturedImageModal () {
    const [type, setType] = useQueryState('type');
    const [mode, setMode] = useQueryState('mode');
    const [isLoading, setIsLoading] = useState(false);
    const { updateBlog, isUpdatingBlog } = useBlogService();
    const { blog } = useAppStore();

    const { user } = useAuth();
    const isTesting = user?.email && isTestingEmail(user?.email);

    const form = useForm<FormSchema>({
        resolver: zodResolver(FeaturedImageSchema),
        defaultValues: {
            featured_image: blog?.blog_info?.featured_image || {
                image_id: '',
                url: '',
            },
        },
        mode: 'onChange',
    });

    const { uploadFile, handleRemoveFile, isUploading } = useUploadFile({
        onUploadComplete: res => {
            form.setValue('featured_image', res);
        },
    });

    const onSubmit: SubmitHandler<FormSchema> = async (data: FormSchema) => {
        setIsLoading(true);
        try {
            let imageUrl = data.featured_image;
            if (data.featured_image instanceof File) {
                const res = await uploadFile(data.featured_image, 'image');
                if (!res) {
                    throw new Error('Failed to upload image');
                }
                imageUrl = res;
            }

            console.log('WHAT IS FEATURED IMAGE', imageUrl);

            await updateBlog({
                blog_info: {
                    ...blog?.blog_info,
                    featured_image: imageUrl,
                },
            });

            toast.success('Featured image updated successfully');
            onClose();
        } catch (error) {
            console.error('Error updating featured image:', error);
            toast.error('Failed to update featured image');
        } finally {
            setIsLoading(false);
        }
    };

    const onClose = () => {
        form.reset({
            featured_image: {
                image_id: '',
                url: '',
            },
        });
        setMode('post_info');
        setType(null);
    };

    const autoFill = () => {
        if (isTesting) {
            // For testing, we'll use a placeholder image URL
            form.setValue('featured_image', {
                image_id: '',
                url: '/images/placeholder/no-image.webp',
            });
            form.formState.isValid = true;
        }
    };

    useEffect(() => {
        form.reset({
            featured_image: blog?.blog_info?.featured_image || {
                image_id: '',
                url: '',
            },
        });
    }, [blog]);

    const currentValue = form.watch('featured_image');
    const displayValue = currentValue instanceof File ? currentValue : currentValue?.url;

    const handleRemoveImage = async () => {
        if (typeof currentValue === 'object' && 'image_id' in currentValue) {
            await handleRemoveFile(currentValue.image_id, 'image');
        }
        form.setValue('featured_image', {
            image_id: '',
            url: '',
        });
    };

    return (
        <CenteredModal
            title='Set Custom Featured Image'
            isOpen={type === 'featured_image'}
            onClose={onClose}
            width={'50vw'}
            footerPriBtnProps={{
                onClick: form.handleSubmit(onSubmit),
                loading: isLoading,
                disabled: !form.formState.isValid,
            }}
            footerSecBtnProps={{
                onClick: onClose,
            }}
            contentClassName='!z-50'
            headerComponent={
                isTesting ? (
                    <div className='flex items-center gap-4'>
                        <p className='text-lg font-bold'>Set Custom Featured Image</p>
                        <Button type='primary' onClick={autoFill}>
                            Auto Fill
                        </Button>
                    </div>
                ) : undefined
            }
        >
            <div className='flex flex-col gap-4 w-full h-full min-h-[30vh] overflow-y-auto'>
                <FileUploader
                    onUpload={file => form.setValue('featured_image', file)}
                    value={displayValue as string}
                    onRemove={handleRemoveImage}
                    isUploading={isUploading}
                />
                <UploadInfo
                    title='Info'
                    content={[
                        'Image should be in 3:2 dimensions.',
                        "This image won't be shown in the post.",
                        'This image is used for post thumbnail only (also as OG Image).',
                    ]}
                />
            </div>
        </CenteredModal>
    );
}
