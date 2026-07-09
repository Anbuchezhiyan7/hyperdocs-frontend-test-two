import { z } from 'zod';

// PostInfo => MetaData Modal
export const MetaDataSchema = z.object({
    title: z
        .string({ required_error: 'Meta title is required.' })
        // .min(40, { message: 'Meta title must be at least 40 characters long.' })
        .max(50, { message: 'Keep title under 50 chars for SEO best practice.' }),
    description: z
        .string({ required_error: 'Meta description is required.' })
        // .min(120, { message: 'Meta description must be at least 120 characters long.' })
        .max(150, { message: 'Keep description under 150 chars for SEO best practice.' }),
});

export const LeadMagnetSchema = z.object({
    template_type: z.string().min(1, 'Template Type is required'),
    media_url: z.string().min(1, 'Media URL is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    cta_placement: z.string().min(1, 'CTA Placement is required'),
    cta_button: z.string().min(1, 'CTA Button is required'),
});
