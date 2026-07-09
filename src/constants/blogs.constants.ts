export interface BlogPost {
    id: string;
    title: string;
    description?: string;
    date: string;
    image: string;
    category?: string;
    author?: string;
    content?: BlogContent[];
}

export interface BlogContent {
    type: 'heading' | 'paragraph' | 'image';
    content: string;
}

export const popularBlogs: BlogPost[] = [
    {
        id: '1',
        title: 'How Minimalist UI Design Boosts User Engagement',
        date: 'Mar 4, 2025',
        author: 'Mihir Sharma',
        image:
            'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/fc33/c1af/8fba034a60e47986f62ffc403712ae6c?Expires=1746403200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IQP4QdWqvax9AVFrIugVs5iLuhMeIbYtFXT5fm8qROKk1hTWiBRKmEm7LylIXyCxuTaGziZwfK0KX51Y1~ZAFe1jqXEOxsmdnjVKfdNC~lEqhfYvO9ckpfx9xawiA0jzeZw1sWe7YnPZ1549mMtUO6MSOw1Mi3uI1JpQ6GkrrOg-kvd7ZZXQVRVMHatf3gQhynm9KpTjRl0MCESlaO7O98x8N56CVluMyVlvmtk1uNm-PNblBfWuuk7iFwLz12WToOQRKa4cQzdMpDramqEz5xF9tXLsHzYhaCJTlvJRQ8Bznd1cVE~Y~pHS2vjS-jNQTIeA5WFQz04~CyUViD4UFA__',
        description:
            "Minimalist UI design is more than just an aesthetic choice—it's a strategic approach that enhances user experience.",
        content: [
            {
                type: 'heading',
                content: 'Introduction: The Power of Minimalism in UI Design',
            },
            {
                type: 'paragraph',
                content:
                    "Minimalist UI design is more than just an aesthetic choice—it's a strategic approach that enhances user experience and boosts engagement. By eliminating unnecessary elements and focusing on clarity, simplicity, and functionality, minimalist design ensures users interact with digital products seamlessly. In an era where attention spans are decreasing, minimalism helps retain users by making interactions effortless and visually appealing.",
            },
            {
                type: 'heading',
                content: 'Enhanced Usability Through Simplicity',
            },
            {
                type: 'paragraph',
                content:
                    'A cluttered interface can overwhelm users and hinder their ability to complete tasks. Minimalist UI design removes distractions and prioritizes essential elements, leading to intuitive navigation. By employing white space, clean typography, and a limited color palette, users can quickly find what they need without confusion. This enhanced usability translates to higher engagement, as users are more likely to stay on a platform that feels natural and easy to use.',
            },
            {
                type: 'heading',
                content: 'Faster Loading Times and Better Performance',
            },
            {
                type: 'paragraph',
                content:
                    'Heavy graphics, excessive animations, and overloaded layouts can slow down websites and applications, negatively impacting user experience. Minimalist UI design optimizes performance by reducing unnecessary visual clutter, leading to faster loading times and smoother interactions. A fast, responsive interface not only improves engagement but also boosts SEO rankings, as search engines prioritize speed and usability.',
            },
            {
                type: 'heading',
                content: 'Emotional Connection and Brand Perception',
            },
            {
                type: 'paragraph',
                content:
                    'Minimalist UI design fosters a sense of sophistication and trust. A clean, modern interface signals professionalism and reliability, which can positively influence brand perception. Additionally, a decluttered and well-structured layout reduces cognitive load, making users feel more at ease while navigating an app or website. This emotional connection enhances user satisfaction, fostering loyalty and repeat interactions.',
            },
            {
                type: 'heading',
                content: 'Conclusion: Striking the Right Balance',
            },
            {
                type: 'paragraph',
                content:
                    'While minimalism enhances usability, designers must strike a balance between simplicity and functionality. Over-simplification can lead to confusion if essential features are removed. The key is to maintain thoughtful design choices where every element serves a purpose, ensuring an intuitive and engaging user experience. By adopting a minimalist UI approach, businesses can create digital products that captivate users while optimizing performance and efficiency.',
            },
        ],
    },
    {
        id: '2',
        title: "The Future of AI in Product Design: What's Next?",
        date: 'Mar 4, 2025',
        author: 'Sarah Johnson',
        image:
            'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/4e02/17a6/d16c052f3bd9423cdf963b2648b7cbe8?Expires=1746403200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=t8VtbVrXWdWH2rVzpm90Ff76zOYWawR0F95YB8gCat80tlVXRELhI1HoE9VwUtayGlc8ttQ4gAvgL1BHP7iqQkf1XxDCNUiKcrx0SDW4urhjObLw4KViozW3TVuDBdtT0Lrl5EdMnXPi-wgOhgUQ0UgooNkSW7QXgUW7cHwx3rq9p76~FR0MxZo7ExJUUBrXaC-Rl~eyMXLlrlIarsczSDHHgn2xcYkP4Jn2lBbgWjEw2USOqlm17UGa-9QYw6QlfNIHb8rvHyKywYly~ATXSD81PRVTMeOnXZSh1UtZQpjXCNiy5ZfKbowt3ezQiSL8Eegmwsmf1koGFmX5B1clxw__',
        description:
            'Exploring how artificial intelligence is revolutionizing product design and what innovations we can expect in the coming years.',
    },
    {
        id: '3',
        title: 'Designing for Accessibility: Why It Matters More Than Ever',
        date: 'Mar 4, 2025',
        author: 'Alex Chen',
        image:
            'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/7a0e/a9bf/7bbc07ac9bc5259ec02e8245f0def6ad?Expires=1746403200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=bK4BC0luQYUHC~cbsrOEbXJkPCnmOvl7BkQOEXT0tTew68q9Ir0UZYoOMG-5Npb8URMroM4hyyU3VHrLWY7mwjIZFrIGVOml461vzZwVITCekPT80KqOHEeVP5~frTRjds0fQpmm8AedaBgmyWxCcO79SjTOAUxns6vR5LuFO2QL17H42HC2ra92bMmRIsDENtzYSsTI2TDhGSOebjJ4XCeGphDq6XOLDuN7xJrA6jP8n2m~sqXiu1BBGBwTJvam9YXmeGz0Dvn54saRinFEzKO-BW1rdVh9xg4syUGh0pJJLM3ylddIA6Z54XInERZzVHLyxoFjl6S6k9YIHOwH5A__',
        description:
            'A comprehensive guide to creating inclusive digital experiences that work for everyone.',
    },
    {
        id: '4',
        title: 'The Psychology of Colors in UI/UX: Choosing the Right Palette',
        date: 'Mar 4, 2025',
        author: 'Priya Patel',
        image:
            'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/5d1e/4876/d0ea71fd57c5209189014a8e077a077f?Expires=1746403200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=MgsvaTVssfs74qd~Nc7Zazy5EnvSUhwC57DZFiJTQvHUxNcPKrXfJuKpJXXqrXDJkt6nvts2X4dH-xFklIP8JqUXRxmtFFWF01WN2dk3yODRvl9l4FU-KLH0BAjrQrx7CW231GfMr~k0Ks42nAGchR2rxQofg0a-Bq3Xu2i7gqofOYxtZBJrCly9wZwsc-~s1NGFBca8cRDA3LnC2sWFlOB07fEzSKeqjsKrjQxwQFRT3uyQMDnIACUMSjMNLWFjKyMijuNvwm93NMiH3rB071mqYGXzYDpzxTjzwyu6ggi7HRszz9chm29op~hzOmzVr-kn-knVTHWELrbFEOsC2A__',
        description:
            'Understanding how color choices impact user behavior and emotional responses in digital interfaces.',
    },
];

export const caseStudies: BlogPost[] = [
    {
        id: '5',
        title: "How Airbnb's Redesign Increased Bookings by 30%",
        date: 'Mar 4, 2025',
        image:
            'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/3584/8dfe/769bae1ab6df55b7a1ab5a64211ee0e8?Expires=1746403200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=o4niKLim7Dd36YSDJ-21btc2vsSk7CcFbiwaxHPVEkNl3XeFBSdiZI4pCEkuIQDGRVDn04pDb4gPRAcYnV5WyNkaIietDNVTSBDtuco2i8ThizjP6HvQ42Pt43Cma-OfeXWC0CTKA8BqDXctq3wN6PHc5786wKWKa7pqalk~g-juiRUP0leHA-kbmonZZWDkiPzc2yzk~Sz09LUgmbBoVqtXEA7pCCEJwpZ1zDcE7Jq9FbSsyJFfTLNHDunRwqXVaN-T~uu-5OI567dGoEUUXxbPR5-CKcBuTQjwVcOd4duvPQf7tj~ae6ceKVWh~F6-CaNp61F3Ne7jBhjsaSm5rw__',
    },
    {
        id: '6',
        title: "Revamping Spotify's UX: How a Simple Update Improved Retention",
        date: 'Mar 4, 2025',
        image:
            'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/87bf/d9cb/16ab8497266dfaa4b9e38e8e32c8e9bd?Expires=1746403200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jl37Dji5An5Kjl2C-c1sNZRaot1OMJWuj1Lfc696YDdWlzBEBKrKMIZjXVPsncXhW8uWCRdQDrudtg6xUTwabVtje5dswJ13OkB37GuJIXozwUgB7sxmE-5hv7Hh~zOgv48ubS5OMGU7u~PsMZpyzo50NZi4CBlA~z52HxbleNfGNrMjc8u-7l4XaZxnWgxwzHHHRIj7l4r6Mz7e292f2oUYjXctjjmP4ezNUQno-dLXY83dUIwooZr9LTa-RmN1LGjVz56QllORjxOAayIiof5RBzQvt66~FWv0l913kPWvONEd5YbusjovjPAghIn1Ao5xK225eVv3X3xqYQjYWg__',
    },
    {
        id: '7',
        title: 'From Confusion to Clarity: How Duolingo Simplified User Onboarding',
        date: 'Mar 4, 2025',
        image:
            'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/47f4/b2cd/b55389996afb0c51d17cc2e6728aa4e4?Expires=1746403200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=U2eVrI-e2Ey~E6EYhFie8PU3iMmnp1eKeqKKG2fhcc-uu59V7TXeZIcf2YI1zFxxjBCfPVZyxbCIZNIVXbHmW6mO08dJhaXZGSLCbTnpm9ljVrh-PnKMZGDdm0Zcw-Xv04ZokUkugV6w~dC6Z4JfgVPLBXheGXyM90dhAxl0PdjdBunWcEyEyxwVSuZfos5-9uscgS0blTYtQKM6QlMx0IR6ybCdJJXQ8sFRVhPg45kzKKdjToY47h3lLXMuiy3jj~gTzUNd-VF0ZtzUBhzBAJcXTfshJ8WiMnTn3iIWWtRyekUY7WSiZ0rqfFKv0IbOFYcC3YK8WwrDlXkyIHPVKg__',
    },
    {
        id: '8',
        title: 'Revolutionizing E-Commerce: How Shopify Enhanced Checkout for Higher Conversions',
        date: 'Mar 4, 2025',
        image:
            'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/8d77/54ff/b398c0baee54772aecadb9ba7890dc19?Expires=1746403200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=XZJpf4HMLTLtvFCFoWs3arpqUJZcA10tnW3GneUo3VKOjby-dbZ5ncyFPHCC4ylmHROWW0k1BTImtGq7cEoaxOytpq1zCbbaukKsYM~AkuQiQrMQc6F3OxcYUqed8k2lnBOPW~rztk-1xXlWvib4ZpwcDkA4D1zi8G4Sq19MA2R0R8KPYG61jhV-UJxRo6kNNiiG0nE5HPYI7GA5U0a2mcClMDWL2ULe2ONHzPgY3L5ctsODTP7M7fN~~vOtafYQhYLadMlo~H20kNpb6fsBV78SMQnQ2LZrocb~QnecUPwSAFj-GPzKG21TBP58l11PSebBJAr1k7eg~ExXAWXnDQ__',
    },
];

export interface OtherTopicPost {
    id: string;
    title: string;
    description: string;
    date: string;
    image: string;
}

export const otherTopicsPosts: OtherTopicPost[] = [
    {
        id: '9',
        title: 'The Psychology Behind Minimalist UI Design',
        description:
            'Understanding the psychological impact of minimalist design helps in creating interfaces that resonate with users on a deeper level, leading to increased satisfaction and retention.',
        date: 'Apr 12, 2025',
        image:
            'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/388b/fce1/f4be8e3f1f6f6f1470741009be217320?Expires=1746403200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=GHhFizS2tcuMarxUNsfAq3EpPitD43s-8gJBVb6ruSuDR~Yqy5gDdyuPQIpg-WSj3eiBQuTT8Nl6QH-7cxtQLSj5ToKAJ5CIKiJj2uGA4GqtQGROGFfSJ9JhwjKxjmaiZkoKOFC~EQISI7ZrUZMnpVQc5tLNxfKykaPVoviUmz~0b75xdta-gxWbV6sS3nTzd25UlxelTWEEOGfCwaFrDhANabDN7EazbBJeulliZfteLpsvt0-uRbysanq2THFzsXHZ7zjy-9G6T58FAxZHW3yRUO0E8~j6R4lPLMMAM8SFZJe4-oZvy0wU7opQd8mfuNEzDz1dIkoFGzU5YWxcqg__',
    },
    {
        id: '10',
        title: 'The Role of White Space in UI Design',
        description:
            'White space is a critical component in minimalist design, allowing users to focus on essential elements and improving overall readability and comprehension.',
        date: 'May 15, 2025',
        image:
            'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/4296/dbcb/0c79d853dede652b05783b9f2dc9d43b?Expires=1746403200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=uCfQ1uEUBxJ7tU0HkYV6K~W3-EUgnLWnI4NAKV5bZJysCc9bKdCoVeDgIhrY1pgL9WgFiWb5OLkagse-9S6ZtDCmOFbOa~OpVTB7nrKRdRnJ-Ktwou6dNR6U9B5GHcGuOkteWalqr~ZMoFpibMlc9yLLAM7ml5vL3v4niCXtuMuLLxgPZNdydneoWwL6-nC5OYSe0s2WERMy9vRZ-Vw0S274JNh8dsYe7MAQKPhuZZbqzRn1slEsG526n5cpiwfKCVxSwpkIqJ-Pa9ctI6TzgyAPDGCEQVB3hcA9rPpfLbYevDrROqtn3rje90-VQi27Rz9VuD2HydnVWshjeoJp2A__',
    },
    {
        id: '11',
        title: 'Color Theory in Minimalist UI Design',
        description:
            "Utilizing color effectively in minimalist UI can evoke emotions and guide users' attention without overwhelming them, making the experience more intuitive.",
        date: 'Jun 21, 2025',
        image:
            'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/abe6/15ce/0c64c72fe7b626814341c728edc70149?Expires=1746403200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=U5hb~o2j~YRYUQy8w4wouiRjCZYwO4Jh2Br0W22Omv5~i~vVNxUlwoO7mGa70JlasXVGvdXAVMyIWOsenntz-zi5rjwWjOFZJy4TPK0Gm9PIIyuf5-Wcr24wVWdp89YkeivK1qt~zf96Au-xSK9Dtd9ldJR~Jy4ORPH57JWaQdloJrPTaqOwEpRIkfAT2YEmsIaLopNCt44m-tHF0nOn6aGYHCDY-dRgmjQoUWN6-KtjjJvNqHIDK-jX5EyXQttR~it8~8NMKETKRONFXL45lIRFdecampADrHT-uMHsRm9UvrrF9Cz3HXc5k8AvZUA7zFyPr9620WjXaroUj~3T7g__',
    },
];

export interface Category {
    category_name: string;
    category_id: string;
    created_at: string;
    updated_at: string;
    user_id: string;
}

export const categories: Category[] = [
    {
        category_name: 'UI/UX Design',
        category_id: '1',
        created_at: '2025-05-09T19:21:49.093000',
        updated_at: '2025-05-09T19:21:49.093000',
        user_id: 'c44cc235-ee27-470f-ba8b-33c9868e8814',
    },
    {
        category_name: 'Web Development',
        category_id: '2',
        created_at: '2025-05-09T19:21:49.093000',
        updated_at: '2025-05-09T19:21:49.093000',
        user_id: 'c44cc235-ee27-470f-ba8b-33c9868e8814',
    },
    {
        category_name: 'Product Management',
        category_id: '3',
        created_at: '2025-05-09T19:21:49.093000',
        updated_at: '2025-05-09T19:21:49.093000',
        user_id: 'c44cc235-ee27-470f-ba8b-33c9868e8814',
    },
    {
        category_name: 'Marketing Strategies',
        category_id: '4',
        created_at: '2025-05-09T19:21:49.093000',
        updated_at: '2025-05-09T19:21:49.093000',
        user_id: 'c44cc235-ee27-470f-ba8b-33c9868e8814',
    },
];

export interface Tag {
    id: string;
    name: string;
}

export const tags: Tag[] = [
    { id: '1', name: 'Artificial Intelligence' },
    { id: '2', name: 'AI Content Creation' },
    { id: '3', name: 'AI Marketing Solutions' },
    { id: '4', name: 'AI Writing Tools' },
    { id: '5', name: 'Automated Copy Generation' },
    { id: '6', name: 'Content Automation' },
    { id: '7', name: 'Creative AI Solutions' },
    { id: '8', name: 'Digital Copywriting' },
    { id: '9', name: 'Intelligent Content Creation' },
    { id: '10', name: 'Machine Learning Copywriting' },
    { id: '11', name: 'Natural Language Processing' },
    { id: '12', name: 'Personalized Marketing Copy' },
    { id: '13', name: 'Smart Content Solutions' },
    { id: '14', name: 'Text Generation AI' },
    { id: '15', name: 'Virtual Writing Assistant' },
    { id: '16', name: 'Web Content Automation' },
    { id: '17', name: 'Writing Enhancement Tools' },
    { id: '18', name: 'Writing Optimization AI' },
    { id: '19', name: 'Writing Software Solutions' },
    { id: '20', name: 'AI-Powered Copywriting' },
];

export interface FooterLink {
    id: string;
    name: string;
    href: string;
}

export const servicesLinks: FooterLink[] = [
    { id: '1', name: 'AI Solutions', href: '' },
    { id: '2', name: 'Digital Marketing', href: '' },
    { id: '3', name: 'App Development', href: '' },
];

export const companyLinks: FooterLink[] = [
    { id: '1', name: 'About', href: '' },
    { id: '2', name: 'Privacy Policy', href: '' },
    { id: '3', name: 'Terms of service', href: '' },
];

export const navLinks: FooterLink[] = [
    { id: '1', name: 'Heading 1', href: '' },
    { id: '2', name: 'Heading 2', href: '' },
    { id: '3', name: 'Heading 3', href: '' },
];

export interface TableOfContents {
    id: string;
    title: string;
    href: string;
}

export const blogTableOfContents: TableOfContents[] = [
    {
        id: '1',
        title: 'Introduction: The Power of Minimalism in UI Design',
        href: '#introduction',
    },
    {
        id: '2',
        title: 'Enhanced Usability Through Simplicity',
        href: '#enhanced-usability',
    },
    {
        id: '3',
        title: 'Emotional Connection and Brand Perception',
        href: '#emotional-connection',
    },
    {
        id: '4',
        title: 'Faster Loading Times and Better Performance',
        href: '#faster-loading',
    },
    {
        id: '5',
        title: 'Conclusion: Striking the Right Balance',
        href: '#conclusion',
    },
];

export const relatedBlogs = [popularBlogs[1], popularBlogs[2], popularBlogs[3], caseStudies[0]];
