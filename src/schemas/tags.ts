import { z } from 'zod';

export const TagSchema = z.object({
    tag_name: z
        .string({ required_error: 'Tag name is required.' })
        .min(2, { message: 'Tag name must be at least 2 characters long.' })
        .max(50, { message: 'Tag name must not exceed 50 characters.' }),
});
