type AnalyticsRange = 'today' | '7d' | '30d' | '1y' | 'all';

interface PageViewSeriesItem {
    date: string;
    views: number;
}

interface PageViewPageItem {
    path: string;
    title: string;
    views: number;
    unique_views: number;
}

interface AnalyticsOverview {
    total_views: number;
    today_views: number;
    unique_views: number;
    series: PageViewSeriesItem[];
    top_pages: PageViewPageItem[];
}

interface AnalyticsPagesResponse {
    pages: PageViewPageItem[];
    total: number;
    page: number;
    limit: number;
}
