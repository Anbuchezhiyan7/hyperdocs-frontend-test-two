export const BASE_URL = "https://backend.hyperblog.io"
typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    : process.env.NODE_ENV === 'development'
        ? '/backend-api'
        : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
export const TESTING_EMAILS = process.env.NEXT_PUBLIC_TESTING_EMAILS || '';
export const DOMAIN_URL = process.env.NEXT_PUBLIC_FRONTENT_DOMAIN || '';

export const PADDLE_TOKEN = process.env.NEXT_PUBLIC_PADDLE_TOKEN || '';
export const PADDLE_VENDOR_ID = process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || '';
export const PADDLE_ENVIRONMENT = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || '';

export const CREDIT_PRICE = 0.023;

export const CUSTOM_BLOCKS = ['lead_magnet', 'banner', 'infograph', 'poll'];
export const DASHBOARD_URLS = process.env.NEXT_PUBLIC_DASHBOARD_URLS?.split(',') || [
    'localhost:3000',
];

export const LOCALHOST_FALLBACK_USER_ID =
    process.env.NEXT_PUBLIC_LOCALHOST_USER_ID || 'f1795552-60dc-4ca4-993d-94f6d70b61d0'

// f1795552-60dc-4ca4-993d-94f6d70b61d0
// 399a251b-706f-4849-8e25-afaf63675fe7