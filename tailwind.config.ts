import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'var(--primary)',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))',
                },
                'input-background': '#F3F3F3',
                stroke: '#E0E0E0',
                success: '#28A745',
                error: '#DC3545',
                brand: {
                    DEFAULT: 'hsl(var(--brand))',
                    foreground: 'hsl(var(--brand-foreground))',
                },
                highlight: {
                    DEFAULT: 'hsl(var(--highlight))',
                    foreground: 'hsl(var(--highlight-foreground))',
                },
                // New colors from banner design
                bannerBg: '#F0F0F0', // Approximate background color from image
                bannerText: '#000000',
                bannerButtonBg: '#FFFFFF',
                bannerButtonBorder: '#000000',
                bannerButtonText: '#000000',
                logoBlueDark: '#09355D', // From figma colors
                logoBlueLight: '#51A3EE', // From figma colors
                logoBlueMedium: '#0E4F8B', // From figma colors
            },
            fontFamily: {
                jakarta: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
                lora: ['var(--font-lora)', 'serif'],
                'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
                'open-sans': ['var(--font-open-sans)', 'sans-serif'],
                poppins: ['var(--font-poppins)', 'sans-serif'],
                roboto: ['var(--font-roboto)', 'sans-serif'],
                lato: ['var(--font-lato)', 'sans-serif'],
                montserrat: ['var(--font-montserrat)', 'sans-serif'],
                oswald: ['var(--font-oswald)', 'sans-serif'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            backgroundImage: {
                'banner-gradient': "url('/images/banners/banner-1-bg.png')",
                'banner-plain': "url('/images/banners/banner-2-bg.png')",
            },
        },
    },
    plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
export default config;
