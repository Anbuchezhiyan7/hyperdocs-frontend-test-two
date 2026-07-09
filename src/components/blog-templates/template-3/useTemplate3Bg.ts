'use client';

import { useTemplateStore } from '@/store/useTemplateStore';

export const TEMPLATE3_DEFAULT_BG = '#F4EFE8';

/**
 * Template 3 background color.
 * Reads `bg_color` from the user's selected template (public side) or from the
 * template settings (dashboard preview), falling back to the default cream.
 */
export const useTemplate3Bg = (): string => {
    const userTemplate = useTemplateStore(state => state.templateData?.['user_template']);
    const template = useTemplateStore(state => state.templateData?.['template']);
    return userTemplate?.bg_color || template?.bg_color || TEMPLATE3_DEFAULT_BG;
};
