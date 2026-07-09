import DeleteModal from '@/components/common/Modals/DeleteModal';
import { toast } from 'sonner';
import { useTagService } from '@/services/tag.service';

interface DeleteTagModalProps {
    open: boolean;
    selectedTags: any[];
    onClose: () => void;
}

const DeleteTagModal = ({ open, selectedTags, onClose }: DeleteTagModalProps) => {
    const { handleDeleteTag, isLoading } = useTagService();

    const isMultiple = selectedTags.length > 1;

    const handleSubmit = async () => {
        try {
            const tagIds = selectedTags.map(tag => tag.tag_id);
            await handleDeleteTag(tagIds);
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'An error occurred while processing your request');
        }
    };

    return (
        <DeleteModal
            open={open}
            onClose={onClose}
            onAccept={handleSubmit}
            isLoading={isLoading}
            title={isMultiple ? 'Delete Tags' : 'Delete Tag'}
            description={`This action cannot be undone. Are you sure you want to delete ${
                isMultiple ? 'these tags' : 'this tag'
            }?`}
        />
    );
};

export default DeleteTagModal;
