import { deleteRequest, getRequest, postRequest, putRequest } from '@/config/http.config';
import apiPath from '@/constants/api-path.constants';

export interface LeadMagnetLibraryPayload {
    template_id: string;
    template_number: string;
    lead_magnet_instance_name: string;
    lead_magnet_instance_title: string;
    description: string;
    cta_button_text: string;
    cover_image: {
        image_id: string;
        url: string;
    };
    pdf_url: string;
    required_form_fields: string[];
}

export interface LeadMagnetLibraryItem extends LeadMagnetLibraryPayload {
    lead_magnet_instance_id: string;
    created_at?: string;
    updated_at?: string;
}

const leadMagnetLibraryApi = {
    getAll: (): Promise<LeadMagnetLibraryItem[]> =>
        getRequest(apiPath.leadMagnetLibrary.base)?.then(res => res?.data),

    getById: (id: string): Promise<LeadMagnetLibraryItem> =>
        getRequest(apiPath.leadMagnetLibrary.id(id))?.then(res => res?.data),

    create: (payload: LeadMagnetLibraryPayload): Promise<LeadMagnetLibraryItem> =>
        postRequest(apiPath.leadMagnetLibrary.base, payload)?.then(res => res?.data),

    update: (id: string, payload: Partial<LeadMagnetLibraryPayload>): Promise<LeadMagnetLibraryItem> =>
        putRequest(apiPath.leadMagnetLibrary.id(id), payload)?.then(res => res?.data),

    delete: (id: string): Promise<void> =>
        deleteRequest(apiPath.leadMagnetLibrary.id(id))?.then(res => res?.data),
};

export default leadMagnetLibraryApi;
