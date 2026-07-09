import { cn } from '@/lib/utils';
import { Image, useMediaState } from '@udecode/plate-media/react';
import templates from './templates';

interface InfographTemplateViewProps {
    infograph: any;
    isDragging?: boolean;
}

const InfographTemplateView = ({ infograph, isDragging }: InfographTemplateViewProps) => {
    const { focused, selected } = useMediaState();
    const currentTemplate = templates.find(
        template => template.id === (infograph?.infograph_template_id || 'blog-infograph-1')
    );
    const TemplateComponent = currentTemplate?.component as any;
console.log(infograph?.alt_text,"infograph?.alt_text");

    return (
        <>
            {infograph?.infograph_type === 'template' ? (
                <TemplateComponent
                    steps={infograph?.infograph_steps || []}
                    description={infograph?.infograph_description}
                    title={infograph?.infograph_title}
                />
            ) : (
                <Image
                    className={cn(
                        'block w-full max-w-full object-cover px-0',
                        'rounded-sm',
                        focused && selected ? 'ring-2 ring-ring ring-offset-2' : '',
                        isDragging ? 'opacity-50' : ''
                    )}
                    src={infograph?.infograph_url}
                    alt={infograph?.alt_text || ''}
                    width='100%'
                    height='auto'
                />
            )}
        </>
    );
};

export default InfographTemplateView;
