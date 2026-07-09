'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useQueryState } from 'nuqs';
import { Input } from '@/components/common/Input';
import { CenteredModal } from '@/components/common/Modals';
import InfoBanner from '@/components/common/InfoBanner';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import useBlogService from '@/services/blog.service';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/providers/auth.provider';
import { isTestingEmail } from '@/utils/test';
import Button from '@/components/common/Buttons';
import { useEffect } from 'react';

const JSSchema = z.object({
    custom_script: z.string().refine(val => val.length > 0, {
        message: 'Please enter a valid JavaScript snippet',
    }),
});

export default function JSModal() {
    const [type, setType] = useQueryState('type');
    const [mode, setMode] = useQueryState('mode');
    const { updateBlog, isUpdatingBlog } = useBlogService();
    const { blog } = useAppStore();
    const { user } = useAuth();
    const isTesting = user?.email && isTestingEmail(user?.email);
    type FormSchema = z.infer<typeof JSSchema>;
    const form = useForm<FormSchema>({
        resolver: zodResolver(JSSchema),
        defaultValues: {
            custom_script: blog?.blog_info?.custom_script || '',
        },
    });

    useEffect(() => {
        form.reset({
            custom_script: blog?.blog_info?.custom_script || '',
        });
    }, [blog]);

    const onSubmit = async (data: FormSchema) => {
        await updateBlog({
            blog_info: {
                ...blog?.blog_info,
                custom_script: data.custom_script,
            },
        });
        toast.success('Custom JavaScript updated successfully');
        onClose();
    };

    const onClose = () => {
        form.reset({ custom_script: '' });
        setMode('post_info');
        setType(null);
    };

    const autoFill = () => {
        if (isTesting) {
            form.setValue('custom_script', 'console.log("test");');
            form.formState.isValid = true;
        }
    };

    return (
        <CenteredModal
            title="Add Custom JS (Optional)"
            isOpen={type === 'custom_script'}
            onClose={onClose}
            width={'60vw'}
            footerPriBtnProps={{
                onClick: form.handleSubmit(onSubmit),
                loading: isUpdatingBlog,
                disabled: form.watch('custom_script')?.trim() === '',
            }}
            footerSecBtnProps={{
                onClick: onClose,
            }}
            contentClassName="!z-50"
            headerComponent={
                isTesting ? (
                    <div className="flex items-center gap-4">
                        <p className="text-lg font-bold">Add Custom JS</p>
                        <Button type="primary" onClick={autoFill}>
                            Auto Fill
                        </Button>
                    </div>
                ) : undefined
            }
        >
            <div className="flex flex-col gap-4 w-full justify-between max-h-[60vh] h-fit overflow-y-auto">
                <div className="flex flex-col gap-2 w-full">
                    <Input
                        name="custom_js"
                        inputType="textarea"
                        placeholder="Enter your custom js here"
                        onChange={value => form.setValue('custom_script', value)}
                        value={form.watch('custom_script')}
                        error={form.formState.errors.custom_script?.message}
                        rows={13}
                    />
                </div>
                <InfoBanner
                    content="This is to be modified by experts only"
                    variant="warning"
                    fullWidth
                />
            </div>
        </CenteredModal>
    );
}
