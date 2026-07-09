import { AlignCenter, AlignLeft, AlignRight, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from './button';
import { useEditorRef } from '@udecode/plate/react';

type BannerAlignmentType = 'left' | 'center' | 'right';

interface BannerAlignmentProps {
    align: BannerAlignmentType;
    readOnly: boolean;
    handleDelete: () => void;
    element: any;
}

const BannerAlignment = ({ align, readOnly, handleDelete, element }: BannerAlignmentProps) => {
    const editor = useEditorRef();

    const handleAlign = (newAlign: BannerAlignmentType) => {
        const path = editor.api.findPath(element);
        editor.tf.setNodes({ align: newAlign }, { at: path });
    };

    return (
        <div
            className={cn(
                'absolute group-hover:opacity-100 opacity-0 -top-[40px] right-0 items-center gap-1 bg-white rounded-md shadow-md p-1 z-10',
                readOnly ? 'hidden' : 'flex'
            )}
        >
            <Button
                variant='ghost'
                size='icon'
                onClick={() => handleAlign('left')}
                className={cn(align === 'left' ? 'bg-muted' : 'bg-white')}
            >
                <AlignLeft className='h-4 w-4' />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => handleAlign('center')}
                className={cn(align === 'center' ? 'bg-muted' : 'bg-white')}
            >
                <AlignCenter className='h-4 w-4' />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => handleAlign('right')}
                className={cn(align === 'right' ? 'bg-muted' : 'bg-white')}
            >
                <AlignRight className='h-4 w-4' />
            </Button>
            <Button variant='ghost' size='icon' onClick={handleDelete}>
                <Trash2 className='h-4 w-4' />
            </Button>
        </div>
    );
};

export default BannerAlignment;
