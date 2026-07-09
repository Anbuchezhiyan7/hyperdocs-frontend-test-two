'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Navbar3 from '../template-3/components/Navbar';
import Footer3 from '../template-3/components/Footer';
import HyperblogBranding from '../components/HyperblogBranding';
import { usePathname } from 'next/navigation';
import { useTemplateStore } from '@/store/useTemplateStore';
import { useTemplate3Bg } from '../template-3/useTemplate3Bg';

export default function BlogTemplateLayout({
    children,
    isFreePlan,
}: {
    children: React.ReactNode;
    /** Resolved server-side and passed down so the branding badge needs no client fetch. */
    isFreePlan?: boolean;
}) {
    const pathname = usePathname();
    // Check if current page is a blog detail page (not the root listing page)
    const isDetailPage = pathname && pathname !== '/';

    const userTemplate = useTemplateStore(state => state.templateData?.['user_template']);
    const templateTag = userTemplate?.template_tag;
    const isTemplate3 = templateTag === 'template_003';

    const Header = isTemplate3 ? Navbar3 : Navbar;
    const FooterComponent = isTemplate3 ? Footer3 : Footer;
    const bgColor = useTemplate3Bg();

    return (
        <div
            className="flex flex-col min-h-screen"
            style={isTemplate3 ? { backgroundColor: bgColor } : undefined}
        >
            <Header isPreviewMode={false} />
            <div className="flex-1">{children}</div>
            <FooterComponent />
            {isDetailPage && <HyperblogBranding isFreePlan={isFreePlan} />}
        </div>
    );
}