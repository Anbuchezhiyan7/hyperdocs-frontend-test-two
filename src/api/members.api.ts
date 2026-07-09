import { deleteRequest, getRequest, postRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

const membersApi = {
    handleInviteMember: async (email: string) =>
        (await postRequest(apiPath.members.invite, { email })).data,
    handleGetMembers: async () => (await getRequest(apiPath.members.list)).data,
    handleRevokeMember: async (inviteId: string) =>
        (await deleteRequest(apiPath.members.id(inviteId))).data,
};

export default membersApi;
