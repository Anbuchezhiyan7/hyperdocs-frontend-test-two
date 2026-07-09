import { cn } from '@/lib/utils';
import { Image, useMediaState } from '@udecode/plate-media/react';
import templates from './templates';

interface BannerTemplateViewProps {
    banner: any;
    isDragging?: boolean;
    onAuthorClick?: () => void;
    hideButtons?: boolean;
    mockPathname?: string;
    mockRouter?: any;
}

const BannerTemplateView = ({
    banner,
    isDragging,
    onAuthorClick,
    hideButtons,
    mockPathname,
    mockRouter,
}: BannerTemplateViewProps) => {
    const { focused, selected } = useMediaState();
    const currentTemplate = templates.find(template => template.id === banner?.banner_template_id);
    const TemplateComponent = currentTemplate?.component as any;
    return (
        <>
            {banner?.banner_type === 'template' ? (
                <TemplateComponent
                    title={banner?.banner_title}
                    onAuthorClick={onAuthorClick}
                    hideButtons={hideButtons}
                    mockPathname={mockPathname}
                    mockRouter={mockRouter}
                />
            ) : (
                <Image
                    className={cn(
                        'block w-full max-w-full object-cover px-0',
                        'rounded-sm',
                        focused && selected ? 'ring-2 ring-ring ring-offset-2' : '',
                        isDragging ? 'opacity-50' : ''
                    )}
                    src={banner?.banner_url}
                    alt={banner?.alt_text || ''}
                    width='100%'
                    height='auto'
                />
            )}
        </>
    );
};

export default BannerTemplateView;
