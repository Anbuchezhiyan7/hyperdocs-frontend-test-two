import { z } from 'zod';

export const CategorySchema = z.object({
    category_name: z
        .string({ required_error: 'Category name is required.' })
        .min(2, { message: 'Category name must be at least 2 characters long.' })
        .max(50, { message: 'Category name must not exceed 50 characters.' }),
});
