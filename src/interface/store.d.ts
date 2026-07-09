import { AllSettings } from './settings';

type UseUserStoreProps = {
    user: User | null;
    setUserData: (data: { user: User }) => void;
};

type UseBlogStoreProps = {
    blog: Blog | null;
    hasContentChanged: boolean;
    setHasContentChanged: (hasContentChanged: boolean) => void;
    filters: {
        sort_by: string | null;
        blog_status: string | null;
        author: string | null;
        categories: string | null;
        tags: string | null;
    };
    handleBlogFieldChange: (field: any, value: any) => void;
    setBlog: (blog: Blog) => void;
    resetBlog: () => void;
    setFilters: (filters: any) => void;
    resetFilters: () => void;
};

type UseSettingsStoreProps = {
    settings: AllSettings;
    setSettings: (data: any) => void;
    isDomainNull: boolean;
    setIsDomainNull: (isDomainNull: boolean) => void;
};

type UseTemplateStoreProps = {
    templateData: any;
    setTemplateData: (key: string, value: any) => void;
    getTemplateData: (key: string) => any;
};

type UseLeadStoreProps = {
    leadFilters: {
        sort_by: string | null;
        blog_status: string | null;
        author: string | null;
    };
    setLeadFilters: (filters: any) => void;
    resetLeadFilters: () => void;
};

type UseAppStoreProps = UseUserStoreProps &
    UseBlogStoreProps &
    UseSettingsStoreProps &
    UseLeadStoreProps &
    UseTemplateStoreProps;
