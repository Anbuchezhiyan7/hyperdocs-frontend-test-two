import { Metadata } from 'next';
import { generateTemplateMetadata } from '@/utils/metadata';

// Listing-style pages under /blogs (author, category, tag) have no per-blog
// metadata, so they inherit the tenant's template branding (fav_icon, etc.).
export async function generateMetadata(): Promise<Metadata> {
    return await generateTemplateMetadata();
}

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
