import { z } from 'zod';
import dayjs from 'dayjs';

export const ScheduleSchema = z
    .object({
        blog_id: z.string(),
        scheduled_date: z.string(),
        scheduled_time: z.string(),
    })
    .superRefine((data, ctx) => {
        const today = dayjs().startOf('day');
        const selectedDate = dayjs(data?.scheduled_date, 'DD-MM-YYYY');

        // Date must be today or a future date
        if (!selectedDate?.isValid() || selectedDate?.isBefore(today, 'day')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['scheduled_date'],
                message: 'Schedule date must be today or a future date',
            });
            return;
        }

        // Time only needs to be in the future when the selected date is today.
        // For a future date, any time of day is valid.
        if (selectedDate?.isSame(today, 'day')) {
            const selectedDateTime = dayjs(
                `${data?.scheduled_date} ${data?.scheduled_time}`,
                'DD-MM-YYYY HH:mm'
            );
            if (!selectedDateTime?.isValid() || !selectedDateTime?.isAfter(dayjs())) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['scheduled_time'],
                    message: 'Schedule time must be in the future',
                });
            }
        }
    });
