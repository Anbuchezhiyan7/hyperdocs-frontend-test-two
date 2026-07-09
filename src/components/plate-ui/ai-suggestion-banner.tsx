import { SuggestedPreviewPopover } from './suggested-preview-popover';

interface AISuggestionBannerProps {
    type: 'banner' | 'infograph' | 'lead-magnet' | 'poll' | 'faq';
    content?: string;
    onReject: () => void;
    preview: React.ReactNode;
    onApply: () => void;
}

export function AISuggestionBanner({ onReject, preview, onApply }: AISuggestionBannerProps) {
    return (
        <SuggestedPreviewPopover
            onCancel={onReject}
            onApply={onApply}
            open={true}
            preview={preview}
            isLoading={false}
        />
    );
}
