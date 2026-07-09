'use client';

import { useCallback, useState } from 'react';
import { isUrl } from '@udecode/plate';
import { useEditorRef } from '@udecode/plate/react';
import { toast } from 'sonner';
import { useFilePicker } from 'use-file-picker';
import { UploadIcon } from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './alert-dialog';
import { FloatingInput } from './input';
import { Button } from './button';

interface MediaInsertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    type: 'image' | 'embed';
}

export function MediaInsertDialog ({ open, onOpenChange, type }: MediaInsertDialogProps) {
    const editor = useEditorRef();
    const [url, setUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const { openFilePicker } = useFilePicker({
        accept: type === 'image' ? ['image/*'] : ['*'],
        multiple: true,
        onFilesSelected: ({ plainFiles: updatedFiles }) => {
            (editor as any).tf.insert.media(updatedFiles);
            onOpenChange(false);
        },
    });

    const handleUrlSubmit = useCallback(() => {
        if (!isUrl(url)) {
            toast.error('Invalid URL');
            return;
        }

        editor.tf.insertNodes({
            children: [{ text: '' }],
            type: type === 'image' ? 'image' : 'media_embed',
            url,
        });
        onOpenChange(false);
    }, [url, editor, type, onOpenChange]);

    const handleFileUpload = () => {
        setIsUploading(true);
        openFilePicker();
        setIsUploading(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className='gap-6'>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {type === 'image' ? 'Insert Image' : 'Insert Media'}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                {type === 'image' ? (
                    <div className='flex flex-col gap-4'>
                        <Button
                            variant='outline'
                            className='w-full'
                            onClick={handleFileUpload}
                            disabled={isUploading}
                        >
                            <UploadIcon className='mr-2 h-4 w-4' />
                            Upload from computer
                        </Button>
                        <div className='relative'>
                            <div className='absolute inset-0 flex items-center'>
                                <span className='w-full border-t' />
                            </div>
                            <div className='relative flex justify-center text-xs uppercase'>
                                <span className='bg-background px-2 text-muted-foreground'>Or</span>
                            </div>
                        </div>
                        <AlertDialogDescription className='group relative w-full'>
                            <FloatingInput
                                id='url'
                                className='w-full'
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleUrlSubmit();
                                }}
                                label='URL'
                                placeholder=''
                                type='url'
                                autoFocus
                            />
                        </AlertDialogDescription>
                    </div>
                ) : (
                    <AlertDialogDescription className='group relative w-full'>
                        <FloatingInput
                            id='url'
                            className='w-full'
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') handleUrlSubmit();
                            }}
                            label='URL'
                            placeholder=''
                            type='url'
                            autoFocus
                        />
                    </AlertDialogDescription>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={e => {
                            e.preventDefault();
                            if (type === 'image' && !url) {
                                handleFileUpload();
                            } else {
                                handleUrlSubmit();
                            }
                        }}
                    >
                        {type === 'image' && !url ? 'Upload' : 'Insert'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
