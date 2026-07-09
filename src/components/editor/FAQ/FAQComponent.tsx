import { useEditorRef } from '@udecode/plate/react';
import { FAQDisplay } from './FAQDisplay';
import { useQuery } from '@tanstack/react-query';
import { FAQCreatorModal } from './FAQCreatorModal';
import useFAQService from '@/services/faq.service';
import faqsApi from '@/api/faq.api';
import BannerPlaceholder from '@/components/common/BannerPlaceholder';
import { ImageIcon } from '@/assets/icons';

type Props = {
    isPreview?: boolean;
    element: any;
    isReadOnly?: boolean;
};

const FAQComponent = ({ isPreview, element, isReadOnly }: Props) => {
    const editor = useEditorRef();
    const faqId = element?.plugin_data_id;
    const {
        handleDeleteFAQ,
        isError: isDeletingFAQError,
        handleUpdateFAQ,
        isError: isUpdatingFAQError,
        isDeletingFAQ,
    } = useFAQService(element?.plugin_data_id);

    const { data: faq, isLoading: isGettingFAQ } = useQuery({
        queryKey: ['faq', faqId],
        queryFn: () => faqsApi.handleGetFAQ(faqId as string),
        enabled: !!faqId && faqId !== 'new',
    });

    const handleSave = async (faq: FAQ[]) => {
        await handleUpdateFAQ({ faqId: element?.plugin_data_id as string, faq_data: faq });
        if (isUpdatingFAQError) {
            return;
        }
        const path = editor.api.findPath(element);
        editor.tf.setNodes({ isEditing: false }, { at: path });
    };

    const handleDelete = async () => {
        if (element?.plugin_data_id) {
            await handleDeleteFAQ({ faqId: element?.plugin_data_id as string });
            if (isDeletingFAQError) {
                return;
            }
        }

        const path = editor.api.findPath(element);
        editor.tf.removeNodes({ at: path });
    };

    const handleEdit = () => {
        editor.tf.setNodes({ isEditing: true }, { at: editor.api.findPath(element) });
    };

    const handleClose = () => {
        editor.tf.setNodes({ isEditing: false }, { at: editor.api.findPath(element) });
    };

    return (
        <>
            <FAQCreatorModal
                isOpen={element.isEditing && !isPreview && !isReadOnly && !!faq}
                onSave={data => handleSave(data as any)}
                onClose={handleClose}
                initialFAQs={faq?.faq_data}
            />
            {!isPreview && !faq && !isReadOnly ? (
                <BannerPlaceholder
                    icon={ImageIcon}
                    text='Add FAQ'
                    onAccept={handleEdit}
                    onReject={handleDelete}
                />
            ) : (
                <FAQDisplay
                    handleEdit={handleEdit}
                    faq={faq}
                    isLoading={isGettingFAQ}
                    isPreview={isPreview || isReadOnly}
                    onDelete={handleDelete}
                    isDeleting={isDeletingFAQ}
                />
            )}
        </>
    );
};

export default FAQComponent;
