// Base lead properties
interface BaseLead {
    id: string;
    name: string;
    email: string;
    date: string;
    time: string;
}

// For blog detail view
export interface BlogDetailLead extends BaseLead {
    sourceId: string;
    sourceType: string;
    sourceTitle: string;
}

// For main leads page
export interface LeadListItem extends BaseLead {
    blogTitle: string;
}

export type TabType =
    | 'All Blogs'
    | 'Blogs'
    | 'Leads'
    | 'Tags'
    | 'Categories'
    | 'Templates'
    | 'Settings'
    | 'Dashboard'
    | 'Lead Library'
    | 'Newsletter';

export type BlogDetailTabType = 'Summary' | 'Polls' | 'Leads' | 'Activity';
