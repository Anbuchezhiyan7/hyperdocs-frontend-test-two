'use client';

import { useMemo, useEffect, useCallback } from 'react';
import { useQueryState } from 'nuqs';
import { Button } from 'antd';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import CenteredModal from '@/components/common/Modals/CenteredModal';
import { Input } from '@/components/common/Input';
import { showToast } from '@/components/common/Toast';
import { apiCreateSchedule, apiDeleteSchedule } from '@/api/schedule';
import { getLocalUTC } from '@/utils/time';
import { useAppStore } from '@/store/useAppStore';
import useBlogService from '@/services/blog.service';

import dayjs from 'dayjs';
import { ScheduleSchema } from '@/schemas/schedule';
import { z } from 'zod';
import { toast } from 'sonner';

type FormSchema = z.infer<typeof ScheduleSchema>;

const ScheduleBlog = () => {
    const { blog, settings } = useAppStore();
    const { id: blog_id } = useParams();
    const queryClient = useQueryClient();
    const [mode, setMode] = useQueryState('mode');

    const utc_timezone = useMemo(() => settings?.general?.time_zone || getLocalUTC(), [settings]);
    const blogScheduled = blog?.blog_status === 'scheduled' ? blog?.scheduled_blog : null;

    const isBlogScheduled = Boolean(blogScheduled);
    const { isPublishable } = useBlogService(blog_id as string);

    const form = useForm<FormSchema>({
        resolver: zodResolver(ScheduleSchema),
        defaultValues: {
            blog_id: blog_id as string,
            scheduled_date: blogScheduled?.scheduled_date || '',
            scheduled_time: blogScheduled?.scheduled_time || '',
        },
    });

    useEffect(() => {
        if (mode === 'schedule') {
            form.reset({
                blog_id: blog_id as string,
                scheduled_date: blogScheduled?.scheduled_date || '',
                scheduled_time: blogScheduled?.scheduled_time || '',
            });
        }
    }, [mode, blog_id, utc_timezone, blogScheduled, form]);

    const handleClose = useCallback(() => {
        setMode(null);
        form.reset();
    }, [setMode, form]);

    const handleSubmit = async (data: FormSchema) => {
        if (!isBlogScheduled) {
            const { isValid, errors } = isPublishable();
            if (!isValid) {
                toast.error(
                    `${errors.join('\n')} - Please fill all the fields to publish the blog`
                );
                setMode('post_info');
                return;
            }
        }

        const apiCall = isBlogScheduled
            ? apiDeleteSchedule(blogScheduled.schedule_id as string)
            : apiCreateSchedule({
                  ...data,
                  utc_timezone,
              });

        const { success, type, message } = await apiCall;

        if (success) {
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['blog', blog_id] });
        }

        showToast(message, type);
    };

    console.log('errors', form.formState.errors);

    return (
        <CenteredModal
            title={isBlogScheduled ? 'Unschedule Blog' : 'Schedule Blog'}
            isOpen={mode === 'schedule'}
            onClose={handleClose}
            width={400}
            hideDivider
            rootClassName='!py-2'
            footerComponent={
                <Button
                    type='primary'
                    onClick={form.handleSubmit(handleSubmit)}
                    loading={form.formState.isSubmitting}
                    className='!w-full'
                    danger={blog?.blog_status === 'scheduled'}
                >
                    {isBlogScheduled ? 'Unschedule Blog' : 'Schedule Blog'}
                </Button>
            }
        >
            <div>
                <Input
                    inputType='datepicker'
                    name='scheduled_date'
                    label='Schedule Date'
                    format='DD-MM-YYYY'
                    value={form.watch('scheduled_date')}
                    onChange={value => form.setValue('scheduled_date', value as string)}
                    disabled={isBlogScheduled}
                    rootClassName='h-9'
                    minDate={dayjs(new Date())}
                    error={form.formState.errors.scheduled_date?.message}
                />
                <div className='flex items-end gap-2'>
                    <Input
                        inputType='timepicker'
                        name='scheduled_time'
                        label='Schedule Time'
                        value={form.watch('scheduled_time')}
                        onChange={value => form.setValue('scheduled_time', value)}
                        disabled={isBlogScheduled}
                        rootClassName='h-9'
                        className='!mb-0'
                        error={form.formState.errors.scheduled_time?.message}
                    />
                    <button
                        disabled
                        className='h-9 flex-center px-3 bg-gray-300 rounded-md text-sm font-medium text-gray-500'
                    >
                        {utc_timezone}
                    </button>
                </div>
            </div>
        </CenteredModal>
    );
};

export default ScheduleBlog;
