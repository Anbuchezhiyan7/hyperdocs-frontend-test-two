import type { NextConfig } from 'next';

// Import bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
    devIndicators: false,
    images: {
        // Serve AVIF/WebP (much smaller than JPEG/PNG) for the optimized hero/LCP image.
        formats: ['image/avif', 'image/webp'],
        // Floor for how long the optimizer keeps a transcoded image, keyed by source URL.
        // Kept short (60s) so that if a hero/logo is ever overwritten at the SAME URL,
        // the change surfaces within a minute. New uploads that produce a new URL
        // (e.g. Cloudinary versioned URLs) always reflect instantly regardless.
        minimumCacheTTL: 60,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'res.cloudinary.com',
                pathname: '/dxezkqczp/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/dxezkqczp/**',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/favicon.ico',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
            {
                source: '/apple-icon.ico',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
            {
                source: '/:slug',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'private, no-cache, no-store, must-revalidate',
                    },
                ],
            },
            // {
            //     source: '/_next/static/:path*',
            //     headers: [
            //         {
            //             key: 'Cache-Control',
            //             value: 'public, max-age=31536000, immutable',
            //         },
            //     ],
            // },
        ];
    },
    async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend.hyperblog.io';
        return [
            {
                source: '/backend-api/:path*',
                destination: `${apiUrl}/:path*`,
            },
            {
                source: '/ingest/static/:path*',
                destination: 'https://us-assets.i.posthog.com/static/:path*',
            },
            {
                source: '/ingest/:path*',
                destination: 'https://us.i.posthog.com/:path*',
            },
        ];
    },
    skipTrailingSlashRedirect: true,
    reactStrictMode: false,
    pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
    productionBrowserSourceMaps: false,

    experimental: {
        optimizePackageImports: [
            'antd',
            '@udecode/plate',
            "@udecode/plate-react",
            "@udecode/plate/react",
            'lowlight',
            'lucide-react',
            'lottie-react',
            '@udecode/plate-ui',
            'html2canvas',
            '@emoji-mart/data',
            '@lottiefiles/dotlottie-react',
            'swiper',
        ],
        optimizeCss: true,
        cssChunking: true,
        inlineCss: true,
    },
    compress: true,

    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
    },

    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.optimization.splitChunks.cacheGroups = {
                ...config.optimization.splitChunks.cacheGroups,
                posthog: {
                    test: /[\\/]node_modules[\\/]posthog-js[\\/]/,
                    name: 'posthog',
                    chunks: 'async',
                    priority: 40,
                    enforce: true,
                },
                antd: {
                    test: /[\\/]node_modules[\\/]antd[\\/]/,
                    name: 'antd',
                    chunks: 'async',
                },
                plate: {
                    test: /[\\/]node_modules[\\/]@udecode[\\/]/,
                    name: 'plate',
                    chunks: 'async',
                },
                emoji: {
                    test: /[\\/]node_modules[\\/]@emoji-mart[\\/]/,
                    name: 'emoji-mart',
                    chunks: 'all',
                },
                katex: {
                    test: /[\\/]node_modules[\\/]katex[\\/]/,
                    name: 'katex',
                    chunks: 'all',
                },
                highlight: {
                    test: /[\\/]node_modules[\\/]react-syntax-highlighter[\\/]/,
                    name: 'highlight',
                    chunks: 'all',
                },
                acorn: {
                    test: /[\\/]node_modules[\\/]acorn[\\/]/,
                    name: 'acorn',
                    chunks: 'all',
                },
            };
        }

        return config;
    },
};

export default withBundleAnalyzer(nextConfig);
