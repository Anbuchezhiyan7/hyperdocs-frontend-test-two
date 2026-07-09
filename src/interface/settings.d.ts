export type SettingType =
    | 'general'
    | 'domain'
    | 'navigation'
    | 'advanced'
    | 'seo'
    | 'import'
    | 'upgrade'
    | 'members'
    | 'invite'
    | 'author';

export type TeamMemberStatus = 'pending' | 'completed' | 'revoked';

export interface TeamMember {
    invite_id: string;
    invited_email: string;
    created_at: string;
    accepted_at: string | null;
    status: TeamMemberStatus;
}

export interface SidebarItem {
    id: SettingType;
    label: string;
    icon?: any;
    isUpgrade?: boolean;
}

interface GeneralSettings {
    organization_name: string;
    organization_logo: string;
    accent_color: string;
    description: string;
    time_zone: string;
    show_description: boolean;
    show_hyperblog_branding: boolean;
}

interface DomainSettings {
    domain_connected: boolean;
    main_domain: string | null;
    sub_domain: string | null;
    sub_folder: string | null;
    default: string | null;
    default_connected?: boolean;
}

interface SeoSettings {
    google_analytics_id: string;
    google_adsense_publisher_id: string;
    google_adsense_ads_txt: string;
    default_cookie_popup: boolean;
    privacy_policy_url: string;
    meta_title: string;
    meta_description: string;
    hide_authors: boolean;
    hide_post_dates: boolean;
    hide_social_sharing_icons: boolean;
    hide_default_menu_items_in_footer: boolean;
    show_searchbar_on_homepage: boolean;
    send_email_upon_deploy: boolean;
    show_post_progress_bar_on_scroll: boolean;
    homepage_type: 'static_page' | 'recent_posts';
    miscellaneous_scripts: string;
    head_scripts: string;
    custom_css: string;
    custom_robots_txt: string;
}

interface HeaderCTAButton {
    label: string;
    link: string;
}

interface ColorPaletteType {
    id: string;
    value: string;
}

interface AuthorSettings {
    author_name: string;
    author_designation: string;
    author_image: any;
    author_bio: string;
    facebook: string;
    x: string;
    website: string;
    linkedin: string;
    author_id?: string;
    designation?: string;
}

interface AuthorType {
    id: string;
    name: string;
    role: string;
    image: ImageFileType | null;
}

interface AdvancedSettings {
    logo: ImageFileType | null;
    fav_icon: ImageFileType | null;
    color_palette: any[];
    blog_ui_font: string;
    blog_post_font: string;
    header_title: string;
    header_caption: string;
    header_cta_button: HeaderCTAButton;
    categories_filter: string[];
    fixed_navbar: boolean;
    graph_image: ImageFileType | null;
    footer_logo: ImageFileType | null;
    short_description: string;
}

type LinkType = {
    link_name: string;
    link_url: string;
};

interface MenuItemType {
    menu_id: string;
    menu_name: string;
    menu_link: string | LinkType[];
}

interface HeaderCTA {
    header_cta_id: string;
    label: string;
    buttonColor: string;
    backgroundColor: string;
    url: string;
}

interface NestedMenuItem {
    label: string;
    url: string;
}

interface NestedMenu {
    menu_id: string;
    label: string;
    items: NestedMenuItem[];
}

interface NavFooterSettings {
    navigation: MenuItemType[];
    footer: MenuItemType[];
    headerCTA: HeaderCTA | null;
    nestedMenu: NestedMenu | null;
}

interface AllSettings {
    general: GeneralSettings;
    domain: DomainSettings;
    seo: SeoSettings;
    advanced: AdvancedSettings;
    navigation_footer: NavFooterSettings;
}

export type SettingsType = 'general' | 'domain' | 'seo' | 'advanced' | 'navigation_footer';
