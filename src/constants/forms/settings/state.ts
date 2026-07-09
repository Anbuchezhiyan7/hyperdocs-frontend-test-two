import { getLocalUTC } from '@/utils/time';
import {
    AllSettings,
    AdvancedSettings,
    DomainSettings,
    GeneralSettings,
    NavFooterSettings,
    SeoSettings,
} from '@/interface/settings';

const GeneralSettingState: GeneralSettings = {
    organization_name: '',
    organization_logo: '',
    description: '',
    accent_color: '#000000',
    time_zone: getLocalUTC(),
    show_description: false,
    show_hyperblog_branding: false,
};

const SeoSettingState: SeoSettings = {
    google_analytics_id: '',
    google_adsense_publisher_id: '',
    google_adsense_ads_txt: '',
    default_cookie_popup: false,
    privacy_policy_url: '',
    meta_title: '',
    meta_description: '',
    hide_authors: false,
    hide_post_dates: false,
    hide_social_sharing_icons: false,
    hide_default_menu_items_in_footer: false,
    show_searchbar_on_homepage: false,
    send_email_upon_deploy: false,
    show_post_progress_bar_on_scroll: false,
    homepage_type: 'static_page',
    miscellaneous_scripts: '',
    head_scripts: '',
    custom_css: '',
    custom_robots_txt: '',
};

const AdvancedSettingsState: AdvancedSettings = {
    logo: null,
    fav_icon: null,
    color_palette: [],
    blog_ui_font: '',
    blog_post_font: '',
    header_title: '',
    header_caption: '',
    header_cta_button: {
        label: '',
        link: '',
    },
    categories_filter: [],
    fixed_navbar: false,
    graph_image: null,
    footer_logo: null,
    short_description: '',
};

const DomainSettingsState: DomainSettings = {
    domain_connected: false,
    main_domain: null,
    sub_domain: null,
    sub_folder: null,
    default: null,
};

const NavFooterSettingsState: NavFooterSettings = {
    navigation: [],
    footer: [],
    headerCTA: null,
    nestedMenu: null,
};

export const SettingsState: AllSettings = {
    general: GeneralSettingState,
    seo: SeoSettingState,
    advanced: AdvancedSettingsState,
    domain: DomainSettingsState,
    navigation_footer: NavFooterSettingsState,
};
