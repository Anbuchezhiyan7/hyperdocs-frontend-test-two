import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/components/common/Toast';
import authorApi from '@/api/authors.api';
import { useQueryState } from 'nuqs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const optionalUrl = z.string().url('Invalid URL').or(z.literal(''));

const AuthorFormSchema = z.object({
    author_name: z.string().min(1, 'Author name is required'),
    author_designation: z.string().min(1, 'Designation is required'),
    author_image: z.object(
        {
            url: z.string().url('Image is required'),
            image_id: z.string(),
        },
        {
            message: 'Image is required',
            required_error: 'Image is required',
        }
    ),
    author_bio: z.string().min(1, 'Bio is required'),
    x: optionalUrl,
    linkedin: optionalUrl,
    website: optionalUrl,
    facebook: optionalUrl,
});

type AuthorFormData = z.infer<typeof AuthorFormSchema>;

export const useAuthorForm = ({ close, onAuthorCreated }: { close?: () => void; onAuthorCreated?: (newAuthor: any) => void }) => {
    const queryClient = useQueryClient();
    const [id, setId] = useQueryState('id');
    const [mode, setMode] = useQueryState('mode');
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<AuthorFormData>({
        resolver: zodResolver(AuthorFormSchema),
        defaultValues: {
            author_name: '',
            author_designation: '',
            author_image: {
                url: '',
                image_id: '',
            },
            author_bio: '',
            x: '',
            linkedin: '',
            website: '',
            facebook: '',
        },
    });

    const { data: author, isLoading: isLoadingAuthor } = useQuery({
        queryKey: ['author', id],
        queryFn: () => authorApi.handleGetAuthorById(id || ''),
        enabled: !!id && mode === 'author',
        staleTime: 0,
        refetchOnMount: 'always',
    });

    // Prefill the form whenever fresh author data arrives (each open re-fetches),
    // instead of relying on a side effect inside the query fn that gets skipped
    // when the response is served from cache.
    useEffect(() => {
        if (!author) return;
        form.reset({
            author_name: author?.author_name,
            author_designation: author?.designation,
            author_image: author?.author_image,
            author_bio: author?.short_bio,
            x: author?.social_links?.twitter ?? '',
            linkedin: author?.social_links?.linkedin ?? '',
            website: author?.social_links?.website ?? '',
            facebook: author?.social_links?.facebook ?? '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [author]);

    const handleDiscard = () => {
        form.reset({
            author_name: '',
            author_designation: '',
            author_image: {
                url: '',
                image_id: '',
            },
            author_bio: '',
            x: '',
            linkedin: '',
            website: '',
            facebook: '',
        });
        if(mode !== "post_info"){
            setMode(null);
            setId(null);
        }
        close?.();
    };

    const isModified = () => {
        if (!author) return false;

        const currentValues = form.getValues();
        const originalValues = {
            author_name: author.author_name,
            author_designation: author.designation,
            author_image: author.author_image,
            author_bio: author.short_bio,
            x: author.social_links?.twitter || '',
            linkedin: author.social_links?.linkedin || '',
            website: author.social_links?.website || '',
            facebook: author.social_links?.facebook || '',
        };

        return JSON.stringify(currentValues) !== JSON.stringify(originalValues);
    };

    const handleSaveAuthor = async () => {
        const isValid = await form.trigger();
        if (!isValid) {
            showToast('Please fix the form errors before saving', 'error');
            return;
        }

        console.log('DO NOT REMOVE THIS', form);

        setIsSaving(true);
        try {
            const formData = form.getValues();
            const payload = {
                author_name: formData.author_name,
                designation: formData.author_designation,
                author_image: formData.author_image,
                short_bio: formData.author_bio,
                social_links: {
                    twitter: formData.x,
                    linkedin: formData.linkedin,
                    website: formData.website,
                    facebook: formData.facebook,
                },
            };
            const res = await (id
                ? authorApi.handleUpdateAuthor(id, payload)
                : authorApi.handleCreateAuthor(payload));
            if (res?.status === 200 || res?.status === 201) {
                queryClient.invalidateQueries({ queryKey: ['authors'] });
                
                // If this is a new author creation, call the callback
                if (!id && onAuthorCreated && res.data) {
                    onAuthorCreated(res.data);
                }
            }
            form.reset();

            showToast(res.data?.message || 'Author saved successfully', res.data?.status);
            handleDiscard();
        } catch (error) {
            showToast((error as any).message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        form,
        handleSaveAuthor,
        handleDiscard,
        isSaving,
        isModified: isModified(),
        author,
        isLoadingAuthor,
    };
};
