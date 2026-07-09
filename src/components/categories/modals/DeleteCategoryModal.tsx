import DeleteModal from '@/components/common/Modals/DeleteModal';
import { useCategoryService } from '@/services/category.service';
import { toast } from 'sonner';

interface DeleteCategoryModalProps {
    open: boolean;
    selectedCategories: any[];
    onClose: () => void;
}

const DeleteCategoryModal = ({ open, selectedCategories, onClose }: DeleteCategoryModalProps) => {
    const { handleDeleteCategory, isLoading } = useCategoryService();

    const isMultiple = selectedCategories.length > 1;

    const handleSubmit = async () => {
        try {
            const categoryIds = selectedCategories.map(category => category.category_id);
            await handleDeleteCategory(categoryIds);
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
            title={isMultiple ? 'Delete Categories' : 'Delete Category'}
            description={`This action cannot be undone. Are you sure you want to delete ${
                isMultiple ? 'these categories' : 'this category'
            }?`}
        />
    );
};

export default DeleteCategoryModal;
