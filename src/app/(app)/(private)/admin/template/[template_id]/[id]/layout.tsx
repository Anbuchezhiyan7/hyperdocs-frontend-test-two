import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { generateBlogMetadata, getBlogMetaData, setUserIdCookie, extractScriptContent } from '@/utils/metadata';

type Props = {
    params: Promise<{ id: string }>;
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const paramsResponse = await params;
    return await generateBlogMetadata(paramsResponse?.id);
    // return await generateBlogMetadata('you-dont-need');
}

export default async function BlogsLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const paramsResponse = await params;
    const blog = await getBlogMetaData(paramsResponse?.id);
    // const blog = await getBlogMetaData('you-dont-need');

    // Set user ID cookie if needed
    await setUserIdCookie(paramsResponse?.id);
    // await setUserIdCookie('you-dont-need');

    return (
        <>
            {blog?.blog_info?.custom_script && (
                <Script id='custom-script' strategy='afterInteractive'>
                    {extractScriptContent(blog.blog_info.custom_script)}
                </Script>
            )}
            {children}
        </>
    );
}
