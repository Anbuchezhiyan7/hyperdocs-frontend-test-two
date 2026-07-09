import Link from 'next/link';

import { AdvancedSettingForm } from '@/constants/forms/settings';
import { AdvancedSettings } from '@/interface/settings';
import { Input } from '@/components/common/Input';
import SettingsHeader from '../partials/SettingsHeader';
import ActionFooter from '../partials/ActionFooter';
import CtaInput from './elements/CtaInput';
import ImageInput from './elements/ImageInput';
import ColorPaletteSelector from './elements/ColorPalette';
import { useSettingsForm2 } from '@/hooks/api-calls/useSettingsForm2';
import { convertToSelectOptions } from '@/utils/format/string';
import { categoriesApi } from '@/api/categories.api';
import { useQuery } from '@tanstack/react-query';
import { ViewSampleModal } from './modals/ViewSampleModal';
import { useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

const renderFontPreview = () => (
    <p className='text-xs'>
        You can see the preview on{' '}
        <Link target='_blank' href='https://fonts.google.com/' className='text-primary underline'>
            google fonts
        </Link>
    </p>
);

const renderSamplePreview = (mode: string) => (
    <Link href={`/admin/settings/advanced?mode=${mode}`} className='text-xs text-primary underline'>
        View sample
    </Link>
);

const Advanced = () => {
    const { form, handleSave, isModified, isLoading } = useSettingsForm2('advanced');
    const [viewSampleModalOpen, setViewSampleModalOpen] = useState(false);
    const { settings } = useAppStore();
    const [aspectRatios, setAspectRatios] = useState<Record<string, '16:9' | '1:1'>>({
        logo: settings?.advanced?.logo?.aspect_ratio || '16:9',
        footer_logo: settings?.advanced?.footer_logo?.aspect_ratio || '16:9'
    });
    const router = useRouter();
    const formData = form.watch() as any;
    const [mode] = useQueryState('mode');

    console.log(settings, "SETTINGS in advanced");

    const handleChange = (name: string, value: any) => {        
        console.log('DO NOT REMOVE THIS', formData, form.clearErrors());

        // If this is the logo or footer_logo field and we have an aspect ratio for it, append it to the value
        if ((name === 'logo' || name === 'footer_logo') && value) {
            const imageWithAspectRatio = {
                ...value,
                aspect_ratio: aspectRatios[name] || '16:9' // Default to '16:9' if no aspect ratio is set
            };
            console.log(`handleChange with aspect ratio:`, imageWithAspectRatio);
            form.setValue(name as any, imageWithAspectRatio);
            console.log(form.getValues(), "FORM VALUES in handleChange");
            
        } else {
            form.setValue(name as any, value);
        }
    };

    const handleAspectRatioChange = (fieldName: string, aspectRatio: '16:9' | '1:1') => {
        setAspectRatios(prev => ({
            ...prev,
            [fieldName]: aspectRatio
        }));
        console.log(`Aspect ratio changed for ${fieldName}:`, aspectRatio);
    };

    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoriesApi.handleGetAllCategories(),
    });

    const categoriesOptions = convertToSelectOptions(
        categoriesData || [],
        'category_id',
        'category_name'
    );

    const handleClose = () => {
        setViewSampleModalOpen(false);
        router.replace('/admin/settings/advanced');
    }

    useEffect(() => {
        if(mode){
            setViewSampleModalOpen(true);
        }
        else{
            setViewSampleModalOpen(false);
        }
    }, [ mode ]);

    const renderField = (field: any) => {
        const name = field?.name as keyof AdvancedSettings;
        const inputType = field?.inputType;

        if (inputType === 'image') {
            return (
                <ImageInput
                    {...(field as any)}
                    key={name}
                    value={formData[name]}
                    onChange={(val: any) => handleChange(name, val)}
                    error={(form?.formState?.errors as any)?.[name]?.message}
                    required={field?.required}
                    isCroppable={field?.isCroppable}
                    onAspectRatioChange={(aspectRatio: '16:9' | '1:1') => handleAspectRatioChange(name, aspectRatio)}
                    aspectRatio={aspectRatios[name]}
                />
            );
        }

        if (inputType === 'cta_input') {
            return (
                <CtaInput
                    key={name}
                    label={field?.label}
                    value={formData[name]}
                    handleChange={(val: any) => handleChange(name, val)}
                    error={(form?.formState?.errors as any)?.[name]?.message}
                />
            );
        }

        if (inputType === 'color_palette' && formData?.logo?.url) {
            return (
                <ColorPaletteSelector
                    key={name}
                    imageUrl={formData?.logo?.url}
                    colors={formData[name] as string[]}
                    onChange={(val: string[]) => handleChange(name, val)}
                    error={(form?.formState?.errors as any)?.[name]?.message}
                />
            );
        }

        return (
            <Input
                {...(field as any)}
                key={name}
                name={name}
                value={formData[name]}
                onChange={(val: any) => handleChange(name, val)}
                className='!mb-0'
                fontPreview={field?.fontsPreview}
                error={(form?.formState?.errors as any)?.[name]?.message}
                options={field?.name === 'categories_filter' ? categoriesOptions : field?.options}
            />
        );
    };

    console.log('formData-Advanced', form?.formState?.errors);
    return (
        <div className='h-full flex flex-col justify-between'>
            <div className='h-full hide-scrollbar'>
                <SettingsHeader
                    title='Customize the look and feel of your blog homepage. Adjust branding, typography, and layout to match your brand.'
                />
                <div className='flex flex-col gap-4 py-3'>
                    {AdvancedSettingForm.map((field, index) => (
                        <div key={field?.name || index} className='flex flex-col gap-1'>
                            {renderField(field)}
                            {field?.fontsPreview && renderFontPreview()}
                            {field?.samplePreview && renderSamplePreview(field?.mode)}
                        </div>
                    ))}
                </div>
            </div>
            <ActionFooter
                isSaving={isLoading}
                disableButtons={!isModified}
                handleSave={handleSave}
            />
            <ViewSampleModal open={viewSampleModalOpen} onClose={handleClose} />
        </div>
    );
};

export default Advanced;
