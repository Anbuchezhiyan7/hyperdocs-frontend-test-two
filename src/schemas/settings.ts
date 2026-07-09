import { z } from 'zod';

export const GeneralSettingsSchema = z.object({
    organization_name: z
        .string()
        .min(2, { message: 'Organization name must be at least 2 characters long' })
        .max(100, { message: 'Organization name must not exceed 100 characters' }),
    organization_logo: z.string().optional().nullable(),
    description: z
        .string()
        .max(500, { message: 'Description must not exceed 500 characters' })
        .optional()
        .nullable()
        .default(''),
    accent_color: z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            message: 'Invalid color format. Please use hex color code (e.g. #000000)',
        })
        .default('#000000')
        .nullable(),
    time_zone: z.string({
        message: 'Timezone is required',
        required_error: 'Timezone is required',
    }),
    show_description: z
        .boolean({
            message: 'Show description is required',
            required_error: 'Show description is required',
        })
        .default(false)
        .nullable(),
    show_hyperblog_branding: z
        .boolean({
            message: 'Show hyperblog branding is required',
            required_error: 'Show hyperblog branding is required',
        })
        .default(false)
        .nullable(),
});

export const AdvancedSettingsSchema = z.object({
    logo: z
        .object(
            {
                url: z.string().nullable(),
                image_id: z.string().nullable(),
                aspectRatio: z.union([z.enum(['16:9', '1:1']), z.undefined()]).optional().default('16:9'),
            },
            { message: 'Logo is required' }
        )
        .required(),
    fav_icon: z
        .object(
            {
                url: z.string().nullable(),
                image_id: z.string().nullable(),
            },
            { message: 'Favicon is required' }
        )
        .required(),
    color_palette: z
        .array(z.string())
        .min(5, { message: 'Minimum 5 colors are required' })
        .default([]),
    blog_ui_font: z.string().min(1, { message: 'Blog UI font is required' }).default(''),
    blog_post_font: z.string().min(1, { message: 'Blog post font is required' }).default(''),
    header_title: z
        .string()
        .max(100, { message: 'Header title must not exceed 100 characters' })
        .default(''),
    header_caption: z
        .string()
        .max(200, { message: 'Header caption must not exceed 200 characters' })
        .optional()
        .nullable()
        .default(''),
    header_cta_button: z
        .object({
            label: z.string().optional().nullable(),
            link: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
    // categories_filter: z
    //     .array(z.string())
    //     .min(1, { message: 'Categories filter is required' })
    //     .default([]),
    fixed_navbar: z.boolean({ message: 'Fixed navbar is required' }).default(false).nullable(),
    graph_image: z
        .object(
            {
                url: z.string().nullable(),
                image_id: z.string().nullable(),
            },
            { message: 'Graph image is required' }
        )
        .required()
        .default({ url: '', image_id: '' }),
    footer_logo: z
        .object(
            {
                url: z.string().nullable(),
                image_id: z.string().nullable(),
                aspectRatio: z.union([z.enum(['16:9', '1:1']), z.undefined()]).optional().default('16:9'),
            },
            { message: 'Footer logo is required' }
        )
        .default({ url: '', image_id: '' }),
});

export const SeoSettingsSchema = z.object({
    google_analytics_id: z.string().optional().nullable(),
    google_adsense_publisher_id: z.string().optional().nullable(),
    google_adsense_ads_txt: z.string().optional().nullable(),
    default_cookie_popup: z.boolean().default(false).nullable(),
    privacy_policy_url: z.string().optional().nullable().default(''),
    meta_title: z.string().min(1, { message: 'Meta title is required' }).default(''),
    meta_description: z.string().min(1, { message: 'Meta description is required' }).default(''),
    hide_authors: z.boolean().default(false).nullable(),
    hide_post_dates: z.boolean().default(false).nullable(),
    hide_social_sharing_icons: z.boolean().default(false).nullable(),
    hide_default_menu_items_in_footer: z.boolean().default(false).nullable(),
    show_searchbar_on_homepage: z.boolean().default(false).nullable(),
    send_email_upon_deploy: z.boolean().default(false).nullable(),
    show_post_progress_bar_on_scroll: z.boolean().default(false).nullable(),
    // homepage_type: z.enum(['static_page', 'recent_posts']),
    miscellaneous_scripts: z.string().optional().nullable().default(''),
    head_scripts: z.string().optional().nullable().default(''),
    custom_css: z.string().optional().nullable().default(''),
    custom_robots_txt: z.string().optional().nullable().default(''),
});

export const SettingsSchema = {
    general: GeneralSettingsSchema,
    advanced: AdvancedSettingsSchema,
    seo: SeoSettingsSchema,
};

export type GeneralSettingsFormData = z.infer<typeof GeneralSettingsSchema>;
export type AdvancedSettingsFormData = z.infer<typeof AdvancedSettingsSchema>;
export type SeoSettingsFormData = z.infer<typeof SeoSettingsSchema>;
export type SettingsFormData<T extends keyof typeof SettingsSchema> = {
    [key in keyof typeof SettingsSchema]: z.infer<typeof SettingsSchema[key]>;
};
