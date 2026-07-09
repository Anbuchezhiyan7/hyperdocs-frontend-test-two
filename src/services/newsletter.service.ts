import newsletterApi, { NewsletterTemplateAPI } from '@/api/newsletter.api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

const TEMPLATES_KEY = ['newsletter-templates'];
const CONFIG_STATUS_KEY = ['newsletter-config-status'];

const useNewsletterService = () => {
    const qc = useQueryClient(); // ← uses the SAME client as the Provider
    const [activatingId, setActivatingId] = useState<string | null>(null);
    const [isTogglingConfig, setIsTogglingConfig] = useState(false);

    const {
        data: templates,
        isLoading: isLoadingTemplates,
    } = useQuery<NewsletterTemplateAPI[]>({
        queryKey: TEMPLATES_KEY,
        queryFn: newsletterApi.getAllTemplates,
    });

    const {
        data: isNewsletterEnabled,
        isLoading: isLoadingConfigStatus,
    } = useQuery<boolean>({
        queryKey: CONFIG_STATUS_KEY,
        queryFn: newsletterApi.getConfigStatus,
    });

    const activateTemplate = async (template: NewsletterTemplateAPI) => {
        setActivatingId(template.template_id);
        try {
            const updated = await newsletterApi.updateTemplate({
                template_id: template.template_id,
                template_name: template.template_name,
                title: template.title,
                button_text: template.button_text,
                description: template.description,
                right_panel_heading: template.right_panel_heading,
                right_panel_subtext: template.right_panel_subtext,
                is_active: true,
            });

            // Patch cache immediately with PUT response
            qc.setQueryData<NewsletterTemplateAPI[]>(TEMPLATES_KEY, prev =>
                prev?.map(t =>
                    t.template_id === updated.template_id
                        ? { ...t, ...updated }
                        : { ...t, is_active: false }
                ) ?? []
            );

            // Then call GET to fully sync
            await qc.refetchQueries({ queryKey: TEMPLATES_KEY });
            toast.success('Template activated successfully!');
        } catch (err) {
            console.error(err);
            await qc.refetchQueries({ queryKey: TEMPLATES_KEY });
            toast.error('Failed to activate template');
        } finally {
            setActivatingId(null);
        }
    };

    const saveTemplateConfig = async (
        template: NewsletterTemplateAPI,
        updates: Partial<Pick<NewsletterTemplateAPI, 'title' | 'button_text' | 'description' | 'right_panel_heading' | 'right_panel_subtext'>>
    ) => {
        const payload = {
            template_id: template.template_id,
            template_name: template.template_name,
            title: updates.title ?? template.title,
            button_text: updates.button_text ?? template.button_text,
            description: updates.description ?? template.description,
            right_panel_heading: updates.right_panel_heading ?? template.right_panel_heading,
            right_panel_subtext: updates.right_panel_subtext ?? template.right_panel_subtext,
            is_active: template.is_active,
        };

        const updated = await newsletterApi.updateTemplate(payload);

        // Patch cache with exact server response
        qc.setQueryData<NewsletterTemplateAPI[]>(TEMPLATES_KEY, prev =>
            prev?.map(t =>
                t.template_id === updated.template_id ? { ...t, ...updated } : t
            ) ?? []
        );

        // Call GET to fully sync
        await qc.refetchQueries({ queryKey: TEMPLATES_KEY });
    };

    const toggleConfigStatus = async (enabled: boolean) => {
        setIsTogglingConfig(true);
        qc.setQueryData<boolean>(CONFIG_STATUS_KEY, enabled);
        try {
            await newsletterApi.setConfigStatus(enabled);
            await qc.refetchQueries({ queryKey: CONFIG_STATUS_KEY });
            toast.success(enabled ? 'Newsletter enabled!' : 'Newsletter disabled!');
        } catch (err) {
            console.error(err);
            qc.setQueryData<boolean>(CONFIG_STATUS_KEY, !enabled);
            toast.error('Failed to update newsletter status');
        } finally {
            setIsTogglingConfig(false);
        }
    };

    return {
        templates: templates ?? [],
        isLoadingTemplates,
        activateTemplate,
        activatingId,
        saveTemplateConfig,
        isNewsletterEnabled: isNewsletterEnabled ?? false,
        isLoadingConfigStatus,
        isTogglingConfig,
        toggleConfigStatus,
    };
};

export default useNewsletterService;
