import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useQueryState } from 'nuqs';
import { Input } from '@/components/common/Input';
import { CenteredModal } from '@/components/common/Modals';
import InfoBanner from '@/components/common/InfoBanner';
import { isValidFAQSchema } from '@/utils/validate';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import useBlogService from '@/services/blog.service';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/providers/auth.provider';
import { isTestingEmail } from '@/utils/test';
import Button from '@/components/common/Buttons';
import { useEffect } from 'react';
const SchemaMarkupSchema = z.object({
    schema_markup: z.string().refine(isValidFAQSchema, {
        message: 'Please enter a valid FAQ Schema markup',
    }),
});

export default function SchemaMarkupModal () {
    const [type, setType] = useQueryState('type');
    const [mode, setMode] = useQueryState('mode');
    const { updateBlog, isUpdatingBlog } = useBlogService();
    const { blog } = useAppStore();
    const { user } = useAuth();
    const isTesting = user?.email && isTestingEmail(user?.email);
    type FormSchema = z.infer<typeof SchemaMarkupSchema>;
    const form = useForm<FormSchema>({
        resolver: zodResolver(SchemaMarkupSchema),
        defaultValues: {
            schema_markup: blog?.blog_info?.schema_markup || '',
        },
    });

    useEffect(() => {
        form.reset({
            schema_markup: blog?.blog_info?.schema_markup || '',
        });
    }, [blog]);

    const onSubmit = async (data: FormSchema) => {
        await updateBlog({
            blog_info: {
                ...blog?.blog_info,
                schema_markup: data.schema_markup,
            },
        });
        toast.success('Schema markup updated successfully');
        onClose();
    };

    const onClose = () => {
        form.reset({ schema_markup: '' });
        setMode('post_info');
        setType(null);
    };

    const autoFill = () => {
        if (isTesting) {
            form.setValue(
                'schema_markup',
                JSON.stringify(
                    {
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: [
                            {
                                '@type': 'Question',
                                name: 'Test Question?',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'Test Answer',
                                },
                            },
                        ],
                    },
                    null,
                    2
                )
            );
            form.formState.isValid = true;
        }
    };

    return (
        <CenteredModal
            title='Set Schema Markup'
            isOpen={type === 'schema_markup'}
            onClose={onClose}
            width={'60vw'}
            footerPriBtnProps={{
                onClick: form.handleSubmit(onSubmit),
                loading: isUpdatingBlog,
                disabled: form.watch('schema_markup')?.trim() === '',
            }}
            footerSecBtnProps={{
                onClick: onClose,
            }}
            contentClassName='!z-50'
            headerComponent={
                isTesting ? (
                    <div className='flex items-center gap-4'>
                        <p className='text-lg font-bold'>Set Schema Markup</p>
                        <Button type='primary' onClick={autoFill}>
                            Auto Fill
                        </Button>
                    </div>
                ) : undefined
            }
        >
            <div className='flex flex-col gap-4 w-full justify-between max-h-[60vh] h-fit overflow-y-auto'>
                <div className='flex flex-col gap-2 w-full'>
                    <Input
                        name='schema_markup'
                        inputType='textarea'
                        placeholder='Enter your schema markup here'
                        onChange={value => form.setValue('schema_markup', value)}
                        value={form.watch('schema_markup')}
                        error={form.formState.errors.schema_markup?.message}
                        rows={13}
                    />
                </div>
                <InfoBanner
                    content='This is to be modified by experts only'
                    variant='warning'
                    fullWidth
                />
            </div>
        </CenteredModal>
    );
}
