import React, { useEffect, useMemo, useState } from 'react';
import { useQueryState } from 'nuqs';
import { useQueryClient } from '@tanstack/react-query';

import { Input } from '@/components/common/Input';
import { CenteredModal } from '@/components/common/Modals';
import { FooterLinksEditor } from './FooterLinksEditor';
import { apiCreateMenu, apiUpdateMenu } from '@/api/settings';
import { showToast } from '@/components/common/Toast';
import { LinkType } from '@/interface/settings';

type NavigationFormData = {
    menu_name?: string;
    menu_link?: string;
};

type FooterFormData = {
    menu_id?: string;
    menu_name?: string;
    menu_link?: LinkType[];
};

type ActionModalProps = {
    title: string;
    open: boolean;
    type: 'navigation' | 'footer';
    initialData?: NavigationFormData | FooterFormData;
};

const navigationFields = [
    { name: 'menu_name', inputType: 'text', label: 'Name', placeholder: 'Enter menu name' },
    { name: 'menu_link', inputType: 'url', label: 'Link', placeholder: 'Paste menu link' },
] as const;

const ActionModal: React.FC<ActionModalProps> = ({ title, open, type, initialData }) => {
    const queryClient = useQueryClient();
    const [paramMode, setParamMode] = useQueryState('mode');
    const [paramMenuId, setParamMenuId] = useQueryState('menu_id');

    const [formData, setFormData] = useState<NavigationFormData | FooterFormData>({});
    const [isLoading, setIsLoading] = useState(false);

    const isNavigation = type === 'navigation';

    useEffect(() => {
        if (paramMenuId) {
            setFormData(initialData || {});
        }
    }, [paramMenuId, initialData]);

    const handleChange = (name: keyof NavigationFormData | keyof FooterFormData, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = useMemo(() => {
        if (isNavigation) {
            return navigationFields.every(({ name }) => (formData as NavigationFormData)[name]?.trim());
        } else {
            const footerData = formData as FooterFormData;
            if (!footerData.menu_name?.trim()) return false;
            return footerData.menu_link?.length && footerData.menu_link.every(link => link.link_name.trim() && link.link_url.trim());
        }
    }, [formData, isNavigation]);

    const handleClose = () => {
        setFormData({});
        setParamMode(null);
        setParamMenuId(null);
    };

    const handleSubmit = async () => {
        if (!paramMode) return;
        setIsLoading(true);

        const apiCall = paramMenuId ? apiUpdateMenu : apiCreateMenu;
        const { success, message, type: toastType } = await apiCall(paramMode, formData);

        if (success) {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
            handleClose();
        }

        showToast(message, toastType);
        setIsLoading(false);
    };

    return (
        <CenteredModal
            isOpen={open}
            onClose={handleClose}
            title={title}
            width={isNavigation ? 450 : 650}
            hideDivider
            childrenClassName="!py-2 !pb-0"
            footerClassName="!py-5"
            defaultFooterClassName="w-full"
            footerPriBtnProps={{
                onClick: handleSubmit,
                disabled: !isFormValid,
                loading: isLoading,
                children: 'Submit',
            }}
            footerSecBtnProps={{
                onClick: handleClose,
                disabled: isLoading,
                children: 'Cancel',
            }}
        >
            <div className="flex flex-col gap-1">
                {isNavigation ? (
                    navigationFields.map(({ name, ...rest }) => (
                        <Input
                            key={name}
                            name={name}
                            {...(rest as any)}
                            value={(formData as NavigationFormData)[name] || ''}
                            onChange={(val: string) => handleChange(name, val)}
                            inputClassName="!h-10"
                        />
                    ))
                ) : (
                    <>
                        <Input
                            label="Name"
                            name="menu_name"
                            inputType="text"
                            value={(formData as FooterFormData)?.menu_name || ''}
                            onChange={(val: string) => handleChange('menu_name', val)}
                            placeholder="Enter footer section name"
                        />
                        <FooterLinksEditor
                            links={(formData as FooterFormData)?.menu_link || []}
                            onChange={(val) => handleChange('menu_link', val)}
                        />
                    </>
                )}
            </div>
        </CenteredModal>
    );
};

export default ActionModal;
