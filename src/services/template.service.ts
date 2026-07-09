'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import templatesApi from '@/api/templates.api';
import Cookies from 'js-cookie';
import { revalidatePublic } from '@/utils/revalidate';

export const useTemplateService = () => {
    const user_id = Cookies.get('user_id');
    // Use the provider's QueryClient, not the singleton — they are different instances
    const queryClient = useQueryClient();

    const { mutateAsync: handleSelectTemplate, isPending: isCreating } = useMutation({
        mutationFn: (payload: any) => templatesApi.handleSelectTemplate(payload),
        onSuccess: async (data: any) => {
            // Invalidate both template queries used in the public layout
            queryClient.invalidateQueries({ queryKey: ['template', user_id] });
            queryClient.invalidateQueries({ queryKey: ['user_template', user_id] });
            // Also cover the blog-templates page key
            queryClient.invalidateQueries({ queryKey: ['user-template', user_id] });
            // Invalidate the main templates list to reflect "Active Now" status
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            // Bust the server-side unstable_cache so the public reader sees the
            // newly-selected template immediately (not after the 1h revalidate).
            await revalidatePublic('template');
            toast.success(data?.message || 'Template selected successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to select template');
        },
    });

    const { mutateAsync: handleUpdateTemplate, isPending: isUpdating } = useMutation({
        mutationFn: ({ template_id, payload }: { template_id: string; payload: any }) =>
            templatesApi.handleUpdateTemplate(template_id, payload),
        onSuccess: async (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            // Header menu / cta / footer / favicon / seo settings live in the
            // template-details + user-template caches — bust them server-side so
            // the public reader reflects the update immediately.
            await revalidatePublic('template');
            toast.success(data?.message || 'Template updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update template');
        },
    });

    const getCachedData = (queryKey: string) => {
        return queryClient.getQueryCache().find<any>({
            queryKey: [queryKey, user_id],
        })?.state?.data;
    };

    return { handleSelectTemplate, isCreating, handleUpdateTemplate, isUpdating, getCachedData };
};
