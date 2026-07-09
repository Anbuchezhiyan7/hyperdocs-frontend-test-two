import { useEditorRef } from '@udecode/plate/react';
import { PollCreator } from './PollCreator';
import { PollDisplay } from './PollDisplay';
import usePollService from '@/services/poll.service';
import pollsApi from '@/api/polls.api';
import { useQuery } from '@tanstack/react-query';

type Props = {
    isPreview?: boolean;
    element: any;
    isReadOnly?: boolean;
};

const PollComponent = ({ isPreview, element, isReadOnly }: Props) => {
    const editor = useEditorRef();
    const pollId = element?.plugin_data_id;

    const {
        handleDeletePoll,
        isError: isDeletingPollError,
        handleUpdatePoll,
        isError: isUpdatingPollError,
        isDeletingPoll,
    } = usePollService(element?.plugin_data_id);

    const { data: poll, isLoading: isGettingPoll } = useQuery({
        queryKey: ['poll', pollId],
        queryFn: () => pollsApi.handleGetPoll(pollId as string),
        enabled: !!pollId && pollId !== 'new',
    });

    const handleSave = async (poll: Poll) => {
        await handleUpdatePoll({ pollId: element?.plugin_data_id as string, poll });
        if (isUpdatingPollError) {
            return;
        }
        const path = editor.api.findPath(element);
        editor.tf.setNodes({ isEditing: false }, { at: path });
    };

    const handleDelete = async () => {
        if (element?.plugin_data_id) {
            await handleDeletePoll({ pollId: element?.plugin_data_id as string });
            if (isDeletingPollError) {
                return;
            }
        }

        const path = editor.api.findPath(element);
        editor.tf.removeNodes({ at: path });
    };

    const handleEdit = () => {
        editor.tf.setNodes({ isEditing: true }, { at: editor.api.findPath(element) });
    };

    return element.isEditing && !isPreview && !isReadOnly ? (
        <PollCreator
            isDeletingPoll={isDeletingPoll}
            poll={poll}
            onSave={handleSave}
            onDelete={handleDelete}
        />
    ) : (
        <PollDisplay
            handleEdit={handleEdit}
            poll={poll}
            isLoading={isGettingPoll}
            isPreview={isPreview}
        />
    );
};

export default PollComponent;
