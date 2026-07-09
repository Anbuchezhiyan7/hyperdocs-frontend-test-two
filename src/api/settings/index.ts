import { deleteRequest, getRequest, postRequest, putRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';
import { formatRes } from '@/utils/format/api';
import { revalidatePublic } from '@/utils/revalidate';

export const apiGetSettings = async () => {
    try {
        const { data } = await getRequest(apiPath.settings.get);
        return data || {};
    } catch {
        return {};
    }
};

export const apiUpdateSetting = async (type: string, payload: any) => {
    try {
        const { data, status } = await putRequest(apiPath.settings.update(type), payload);
        await revalidatePublic('settings');
        return formatRes.success(status, 'Settings updated successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Settings not updated');
    }
};

export const apiCreateMenu = async (type: string, payload: any) => {
    try {
        const { data, status } = await postRequest(apiPath.settings.createMenu(type), payload);
        await revalidatePublic('settings');
        return formatRes.success(status, 'Menu created successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Menu not created');
    }
};

export const apiUpdateMenu = async (type: string, payload: any) => {
    try {
        const { data, status } = await putRequest(
            apiPath.settings.updateMenu(type, payload?.menu_id),
            payload
        );
        await revalidatePublic('settings');
        return formatRes.success(status, 'Menu created successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Menu not created');
    }
};

export const apiDeleteMenu = async (type: string, id: string) => {
    try {
        const { data, status } = await deleteRequest(apiPath.settings.deleteMenu(type, id));
        await revalidatePublic('settings');
        return formatRes.success(status, 'Menu deleted successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Menu not deleted');
    }
};

//DOMAIN API

export const apiConnectdomain = async (payload: any, isSkip?: boolean) => {
    try {
        const path = isSkip
            ? `${apiPath.settings.connectdomain}?type=skip`
            : apiPath.settings.connectdomain;
        const { data, status } = await putRequest(path, payload);
        return formatRes.success(status, 'Domain connected successfully', data);
    } catch (error) {
        throw formatRes.error(error, 'Domain not connected');
    }
};

export const apiDisconnectdomain = async (type: string) => {
    try {
        const { data, status } = await getRequest(apiPath.settings.disconnectDomain(type));
        return formatRes.success(status, 'Domain disconnected successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Domain not disconnected');
    }
};

export const apiGetDomainUserId = async (domain: string) => {
    try {
        const { data, status } = await getRequest(apiPath.settings.getDomainUserId(domain));
        return formatRes.success(status, 'Domain user id fetched successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Domain user id not fetched');
    }
};

export const apiGetSubFolderTypes = async (type: string) => {
    try {
        const { data, status } = await getRequest(apiPath.settings.subFolderTypes(type));
        return formatRes.success(status, 'Sub folder types fetched successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Sub folder types not fetched');
    }
};

export const apiGetSubFolderSelectedTypes = async () => {
    try {
        const { data, status } = await getRequest(apiPath.settings.subFolderSelectedTypes);
        return formatRes.success(status, 'Sub folder selected types fetched successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Sub folder selected types not fetched');
    }
};

export const apiSubFolderIntegration = async (payload: {
    sub_folder_domain: string;
    sub_directory: string;
    sub_folder_framework: string;
}) => {
    try {
       
        const { data, status } = await postRequest(apiPath.settings.subFolderIntegration, payload);
        return formatRes.success(status, 'Sub folder integrated successfully', data);
    } catch (error) {
        throw formatRes.error(error, 'Sub folder not integrated');
    }
};

export const apiCreateHeaderCTA = async (payload: any) => {
    try {
        const { data, status } = await postRequest(apiPath.settings.header_cta, payload);
        await revalidatePublic('settings');
        return formatRes.success(status, 'Header CTA created successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Header CTA not created');
    }
};

export const apiUpdateHeaderCTA = async (id: string, payload: any) => {
    try {
        const { data, status } = await putRequest(apiPath.settings.header_cta_id(id), payload);
        await revalidatePublic('settings');
        return formatRes.success(status, 'Header CTA updated successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Header CTA not updated');
    }
};

export const apiDeleteHeaderCTA = async (id: string) => {
    try {
        const { data, status } = await deleteRequest(apiPath.settings.header_cta_id(id));
        await revalidatePublic('settings');
        return formatRes.success(status, 'Header CTA deleted successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Header CTA not deleted');
    }
};


export const apiCreateNestedMenu = async (payload: any) => {
    try {
        const { data, status } = await postRequest(apiPath.settings.nested_menu, payload);
        await revalidatePublic('settings');
        return formatRes.success(status, 'Nested menu created successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Nested menu not created');
    }
};

export const apiUpdateNestedMenu = async (id: string, payload: any) => {
    try {
        const { data, status } = await putRequest(apiPath.settings.nested_menu_id(id), payload);
        await revalidatePublic('settings');
        return formatRes.success(status, 'Nested menu updated successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Nested menu not updated');
    }
};

export const apiDeleteNestedMenu = async (id: string) => {
    try {
        const { data, status } = await deleteRequest(apiPath.settings.nested_menu_id(id));
        await revalidatePublic('settings');
        return formatRes.success(status, 'Nested menu deleted successfully', data);
    } catch (error) {
        return formatRes.error(error, 'Nested menu not deleted');
    }
};

