'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useQueryState } from 'nuqs';
import { Input } from '@/components/common/Input';
import { CenteredModal } from '@/components/common/Modals';
import InfoBanner from '@/components/common/InfoBanner';
import { isValidLink } from '@/utils/validate';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import useBlogService from '@/services/blog.service';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/providers/auth.provider';
import { isTestingEmail } from '@/utils/test';
import Button from '@/components/common/Buttons';
import { useEffect } from 'react';

const CanonicalSchema = z.object({
    canonical_url: z.string().refine(isValidLink, {
        message: 'Please enter a valid URL',
    }),
});

export default function CanonicalModal () {
    const [type, setType] = useQueryState('type');
    const [mode, setMode] = useQueryState('mode');
    const { updateBlog, isUpdatingBlog } = useBlogService();
    const { blog } = useAppStore();
    const { user } = useAuth();
    const isTesting = user?.email && isTestingEmail(user?.email);

    type FormSchema = z.infer<typeof CanonicalSchema>;
    const form = useForm<FormSchema>({
        resolver: zodResolver(CanonicalSchema),
        defaultValues: {
            canonical_url: blog?.blog_info?.canonical_url || '',
        },
    });

    useEffect(() => {
        form.reset({
            canonical_url: blog?.blog_info?.canonical_url || '',
        });
    }, [blog]);

    const onSubmit = async (data: FormSchema) => {
        await updateBlog({
            blog_info: {
                ...blog?.blog_info,
                canonical_url: data.canonical_url,
            },
        });
        toast.success('Canonical URL updated successfully');
        onClose();
    };

    const onClose = () => {
        form.reset({ canonical_url: '' });
        setMode('post_info');
        setType(null);
    };

    const autoFill = () => {
        if (isTesting) {
            form.setValue('canonical_url', 'https://example.com/test');
            form.formState.isValid = true;
        }
    };

    return (
        <CenteredModal
            title='Set Custom Canonical Url'
            isOpen={type === 'canonical_url'}
            onClose={onClose}
            width={'60vw'}
            footerPriBtnProps={{
                onClick: form.handleSubmit(onSubmit),
                loading: isUpdatingBlog,
                disabled: form.watch('canonical_url')?.trim() === '',
            }}
            footerSecBtnProps={{
                onClick: onClose,
            }}
            contentClassName='!z-50'
            headerComponent={
                isTesting ? (
                    <div className='flex items-center gap-4'>
                        <p className='text-lg font-bold'>Set Custom Canonical Url</p>
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
                        label='Canonical Url'
                        name='canonical_url'
                        inputType='url'
                        placeholder='Enter Canonical Url'
                        onChange={value => form.setValue('canonical_url', value)}
                        value={form.watch('canonical_url')}
                        error={form.formState.errors.canonical_url?.message}
                    />
                </div>
                <InfoBanner
                    content='This is to be modified by experts only. Hyperblog takes care of the canonical url slug automatically.'
                    variant='warning'
                    fullWidth
                />
            </div>
        </CenteredModal>
    );
}
