import pollsApi from '@/api/polls.api';
import { useSendData } from '@/config/query.config';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const usePollService = (blog_id?: string, pollId?: string) => {
    const invalidateKey = ['polls', 'poll', pollId || ''];
    const [isLoading, setIsLoading] = useState(false);
    const blogId = useParams().id || blog_id;

    const { mutate: handleVote, isPending: isVoting, isError: isVotingError } = useSendData({
        fn: ({ pollId, optionId }: { pollId: string; optionId: string }) =>
            pollsApi.handleVote(pollId, optionId),
        invalidateKey,
        error: (error: any) => {
            console.log('ERROR', error);
            const errorMessage = error?.message || error?.data?.detail || 'Error voting';
            toast.error(errorMessage);
        },
    });

    const handleCreatePoll = async () => {
        try {
            setIsLoading(true);
            const res = await pollsApi.handleCreatePoll(blogId as string);
            return res;
        } catch (error: any) {
            console.log('ERROR', error);
            const errorMessage = error?.message || error?.data?.detail || 'Error creating poll';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const {
        mutate: handleUpdatePoll,
        isPending: isUpdatingPoll,
        isError: isUpdatingPollError,
    } = useSendData({
        fn: ({ pollId, poll }: { pollId: string; poll: any }) =>
            pollsApi.handleUpdatePoll(pollId, poll),
        invalidateKey,
        error: (error: any) => {
            console.log('ERROR', error);
            const errorMessage = error?.message || error?.data?.detail || 'Error updating poll';
            toast.error(errorMessage);
        },
    });

    const {
        mutate: handleDeletePoll,
        isPending: isDeletingPoll,
        isError: isDeletingPollError,
    } = useSendData({
        fn: ({ pollId }: { pollId: string }) => pollsApi.handleDeletePoll(pollId),
        invalidateKey,
        error: (error: any) => {
            console.log('ERROR', error);
            const errorMessage = error?.message || error?.data?.detail || 'Error deleting poll';
            toast.error(errorMessage);
        },
    });

    const {
        mutate: handleDeletePollOption,
        isPending: isDeletingPollOption,
        isError: isDeletingPollOptionError,
    } = useSendData({
        fn: ({ pollId, optionId }: { pollId: string; optionId: string }) =>
            pollsApi.handleDeletePollOption(pollId, optionId),
        invalidateKey,
        error: (error: any) => {
            console.log('ERROR', error);
            const errorMessage = error?.message || error?.data?.detail || 'Error deleting poll option';
            toast.error(errorMessage);
        },
    });

    return {
        handleCreatePoll,
        handleUpdatePoll,
        handleDeletePoll,
        handleDeletePollOption,
        handleVote,
        isLoading: isUpdatingPoll || isDeletingPollOption || isLoading || isVoting,
        isDeletingPoll,
        isError:
            isUpdatingPollError ||
            isDeletingPollError ||
            isDeletingPollOptionError ||
            isVotingError,
    };
};

export default usePollService;
