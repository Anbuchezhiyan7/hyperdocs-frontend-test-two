'use client';

import Button from '@/components/common/Buttons';
import { cn } from '@/utils/cn';
import CenteredModal from '@/components/common/Modals/CenteredModal';
import { useQueryState } from 'nuqs';
import { AuthorSettingForm } from '@/constants/forms/settings';
import ImageInput from '../Advanced/elements/ImageInput';
import { AuthorSettings } from '@/interface/settings';
import { Input } from '@/components/common/Input';
import { useAuthorForm } from '@/hooks/api-calls/useAuthorForm';
import React from 'react';

import AuthorFormSkeleton from './AuthorFormSkeleton';
interface AddEditAuthorModalProps {
    open?: boolean;
    close?: () => void;
    onAuthorCreated?: (newAuthor: any) => void;
}

const AddEditAuthorModal: React.FC<AddEditAuthorModalProps> = ({ open, close, onAuthorCreated }) => {
    const [mode, setMode] = useQueryState('mode');
    const [id, setId] = useQueryState('id');

    const { handleSaveAuthor, isModified, isSaving, handleDiscard, form, isLoadingAuthor } =
        useAuthorForm({
            close,
            onAuthorCreated,
        });

    const isOpen = open || mode === 'author';
    const isEdit = !!id && mode === 'author';

    const onClose = () => {
        if (!close && mode !== "post_info") {
            setMode(null);
            setId(null);
        }
        handleDiscard();
        close?.();
    };

    const formData = form.watch();

    const handleChange = (name: keyof AuthorSettings, value: any) => {
        console.log('DO NOT REMOVE THIS', form.clearErrors());
        form.setValue(name as any, value);
    };

    const headerComponent = (
        <div className='flex flex-col'>
            <div className='text-[18px] font-bold text-[#222]'>
                {isEdit ? 'Edit Author' : 'Add Author'}
            </div>
            <p className='text-[13px] font-medium text-[#8F8F8F]'>
                {isEdit
                    ? 'Update author details and social links'
                    : 'Add a new author with their details and social links'}
            </p>
        </div>
    );

    const footerComponent = (
        <div className='flex items-center justify-end w-full gap-2'>
            <Button type='default' onClick={onClose} className={cn('rounded-xl h-9 px-5')}>
                Cancel
            </Button>
            <Button
                loading={isSaving}
                disabled={!isModified && isEdit}
                type='primary'
                className={cn('rounded-xl h-9 px-5')}
                onClick={handleSaveAuthor}
            >
                Save
            </Button>
        </div>
    );

    const renderField = (field: any) => {
        const name = field?.name as any;
        const inputType = field?.inputType;

        if (inputType === 'image') {
            return (
                <ImageInput
                    {...(field as any)}
                    key={name}
                    value={(formData as any)?.[name]}
                    onChange={(val: any) => handleChange(name, val)}
                    className={'!w-full'}
                    error={
                        (form.formState.errors as any)?.[name]?.url?.message ||
                        (form.formState.errors as any)?.[name]?.image_id?.message
                    }
                />
            );
        }

        return (
            <Input
                {...(field as any)}
                key={name}
                name={name}
                value={(formData as any)?.[name] || ''}
                onChange={(val: any) => handleChange(name, val)}
                className={'!w-full'}
                rootClassName={'!w-full'}
                error={(form.formState.errors as any)?.[name]?.message}
            />
        );
    };

    return (
        <CenteredModal
            width={720}
            title={isEdit ? 'Edit Author' : 'Add Author'}
            onClose={onClose}
            isOpen={isOpen}
            headerComponent={headerComponent}
            footerComponent={footerComponent}
            zIndex={4000}
            childrenClassName='!py-5 show-scrollbar'
        >
            <div className='flex w-full flex-col gap-7'>
                {isLoadingAuthor ? (
                    <AuthorFormSkeleton />
                ) : (
                    AuthorSettingForm.map((field, index) => (
                        <div key={index} className='w-full flex flex-col gap-3'>
                            <h3 className='text-[13px] font-bold uppercase tracking-wider text-[#8F8F8F]'>
                                {field?.title}
                            </h3>
                            <div className='grid grid-cols-2 w-full gap-x-4 gap-y-4'>
                                {field?.fields.map((field, index) => (
                                    <div key={index} className={cn(field?.className)}>
                                        {renderField(field)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </CenteredModal>
    );
};

export default AddEditAuthorModal;
