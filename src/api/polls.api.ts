import { postRequest, putRequest, getRequest, deleteRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

const pollsApi = {
    handleCreatePoll: (blogId: string) =>
        postRequest(apiPath.polls.base, { blog_id: blogId })?.then(res => res?.data),
    handleUpdatePoll: (pollId: string, updatedPoll: Partial<Poll>) =>
        putRequest(apiPath.polls.id(pollId), updatedPoll)?.then(res => res?.data),
    handleGetPoll: (pollId: string) => getRequest(apiPath.polls.id(pollId))?.then(res => res?.data),
    handleGetAllPolls: (blogId?: string) =>
        getRequest(`${apiPath.polls.base}/all/${blogId}`)?.then(res => res?.data),
    handleDeletePoll: (pollId: string) =>
        deleteRequest(apiPath.polls.id(pollId))?.then(res => res?.data),
    handleDeletePollOption: (pollId: string, optionId: string) =>
        deleteRequest(apiPath.polls.options(pollId, optionId))?.then(res => res?.data),
    handleVote: (pollId: string, optionId: string) =>
        putRequest(apiPath.polls.vote(pollId, optionId), {})?.then(res => res?.data),
};

export default pollsApi;
