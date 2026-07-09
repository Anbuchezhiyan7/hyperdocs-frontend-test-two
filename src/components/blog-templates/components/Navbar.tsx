'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { useTemplateStore } from '@/store/useTemplateStore';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { getLogoDimensions } from '@/utils/findAspectRatio';
import { useState } from 'react';
import { ArrowLeft, Menu, X, ChevronDown } from 'lucide-react';
import Button from '@/components/common/Buttons';
import { dummyCTA, dummyNavigation, dummyNestedMenu } from '../preview/dummyData';

interface NavbarProps {
    isPreviewMode?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isPreviewMode }) => {
    const templateData = useTemplateStore(state => state.templateData?.['template']);
    const [pageType, setPageType] = useQueryState('page-type');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileNestedOpen, setIsMobileNestedOpen] = useState(false);

    const [mode, setMode] = useQueryState('mode');
    const isPreview = mode === 'preview' || isPreviewMode;
    
    const navigationData = (isPreview && (!templateData?.navigation || templateData.navigation.length === 0)) 
        ? dummyNavigation 
        : (templateData?.navigation || []);
    
    const headerCTA = (isPreview && !templateData?.headerCTA) 
        ? dummyCTA 
        : templateData?.headerCTA;
        
    const nestedMenu = (isPreview && !templateData?.nestedMenu) 
        ? dummyNestedMenu 
        : templateData?.nestedMenu;


    const logo = templateData?.advanced?.logo?.url || '/images/placeholder/no-image.webp';
    const path = `/`;
    const logoAspectRatio = templateData?.advanced?.logo?.aspect_ratio;
    const logoDimensions = isPreview ? { width: 178, height: 28 } : getLogoDimensions(logoAspectRatio);

    const isFixedMenu = templateData?.advanced?.fixed_navbar;
    const pathname = usePathname();
    const router = useRouter();
    // Check if we're on a deeper sub-page (e.g., category or blog post).
    // We filter segments to handle trailing slashes robustly across environments.
    const segments = pathname.split('/').filter(Boolean);
    const isDashboard = pathname.includes('/admin/template');

    const isNotMainpage = isDashboard 
        ? false 
        : pathname.includes('/blogs')
            ? segments.length > 2 && segments[0] === 'blogs'
            : segments.length > 1;

    const handleGoBack = () => {
        if (isNotMainpage) {
            router.back();
        }

        if (pageType !== null) {
            setPageType(null);
        }
    };

    const renderHeaderContent = () => {
        if (((!isDashboard && isNotMainpage) || pageType !== null) && isPreview) {

            return (
                <div className="flex pt-4">
                    <Button
                        variant="text"
                        className="flex border-none bg-transparent p-0 hover:!bg-transparent items-center text-textSecondary hover:text-primary transition-colors mb-6"
                        onClick={handleGoBack}
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Go Back
                    </Button>
                </div>
            );
        }

        return (
            <>
                {/* Left Group: Toggle (Mobile) + Logo (Both) */}
                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    <div className="md:hidden flex items-center">
                        <button
                            type="button"
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-textPrimary hover:text-primary transition-colors focus:outline-none"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                    <Link href={path} className="flex items-center">
                        {logo && logo !== '' && (
                            <div
                                style={{
                                    width: isPreview ? '170px' : `${logoDimensions.width}px`,
                                    height: isPreview ? '26px' : `${logoDimensions.height}px`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    minWidth: "120px"
                                }}
                            >
                                <Image
                                    src={isPreview ? '/images/blogs/DummyLogo.png' : logo}
                                    alt="Navbar Logo"
                                    className="object-contain"
                                    width={logoDimensions.width}
                                    height={logoDimensions.height}
                                    priority
                                />
                            </div>
                        )}
                    </Link>
                </div>

                {/* Right Group: Nav Links + CTA */}
                <div className="flex items-center justify-end flex-1 gap-4 sm:gap-8 ml-4">
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigationData.map((link: any) => (
                            <Link
                                key={link.menu_id}
                                target={'_blank'}
                                href={link.menu_link}
                                className="text-textPrimary font-medium hover:text-primary transition-colors whitespace-nowrap"
                            >
                                {link.menu_name}
                            </Link>
                        ))}

                        {nestedMenu && (
                            <div className="relative group cursor-pointer">
                                <div className="flex items-center gap-1 text-textPrimary font-medium group-hover:text-primary transition-colors py-4">
                                    <span>{nestedMenu.label}</span>
                                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                                </div>
                                <div className="absolute right-0 top-full hidden group-hover:block w-52 bg-white border border-border rounded-xl shadow-xl overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {nestedMenu.items.map((item: any, idx: number) => (
                                        <Link 
                                            key={idx}
                                            href={item.url}
                                            target="_blank"
                                            className="block px-4 py-2.5 text-sm font-medium text-textPrimary hover:bg-primary/5 hover:text-primary transition-all duration-200 hover:pl-6"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </nav>

                    {/* CTA Button (Visible on both Mobile and Desktop) */}
                    {headerCTA && (
                        <a 
                            href={headerCTA.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                                backgroundColor: headerCTA.backgroundColor, 
                                color: headerCTA.buttonColor 
                            }}
                            className="flex items-center justify-center px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full text-[11px] sm:text-sm font-bold shadow-sm transition-all hover:brightness-110 active:scale-95 whitespace-nowrap"
                        >
                            {headerCTA.label}
                        </a>
                    )}
                </div>
            </>
        );
    };

    return (
        <header
            className={`border-b z-50 border-border h-fit ${
                isFixedMenu ? 'sticky top-0 bg-white z-10' : ''
            }`}
        >
            <div className="w-[90%] mx-auto flex items-center justify-between min-h-16">
                {renderHeaderContent()}
            </div>

            {/* Mobile Menu Overlay/Backdrop */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 z-[60] bg-black/0 md:hidden backdrop-blur-sm transition-all duration-500" 
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
            
            {/* Mobile Menu Content (Glassmorphism Sidebar) */}
            <div className={`fixed top-0 left-0 z-[70] w-full bg-white/30 backdrop-blur-lg shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden rounded-b-[2.5rem] border-b border-white/20 ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="flex flex-col p-8 pt-6 max-h-[90vh] overflow-y-auto thin-scrollbar">
                    <div className="flex items-center justify-between mb-8">
                        {/* Logo in Mobile Menu */}
                        <div className="flex items-center">
                             {logo && logo !== '' && (
                                <Image
                                    src={isPreview ? '/images/blogs/DummyLogo.png' : logo}
                                    alt="Navbar Logo"
                                    width={120}
                                    height={20}
                                    className="object-contain"
                                />
                             )}
                        </div>
                        <button
                            type="button"
                            aria-label="Close menu"
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2.5 rounded-full bg-black/5 text-textPrimary hover:bg-black/10 hover:rotate-90 transition-all duration-300 focus:outline-none"
                        >
                            <X size={22} />
                        </button>
                    </div>
                    <nav className="flex flex-col space-y-3">
                        {navigationData.map((link: any) => (
                            <Link
                                key={link.menu_id}
                                target={'_blank'}
                                href={link.menu_link}
                                className="text-textPrimary text-[15px] font-bold hover:text-primary hover:translate-x-3 transition-all duration-300 p-4 rounded-2xl hover:bg-primary/5 active:scale-95 border-b border-black/5 last:border-0"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.menu_name}
                            </Link>
                        ))}

                        {nestedMenu && (
                            <div className="flex flex-col border-b border-black/5">
                                <button 
                                    onClick={() => setIsMobileNestedOpen(!isMobileNestedOpen)}
                                    className="flex items-center justify-between text-textPrimary text-[15px] font-bold hover:text-primary transition-all duration-300 p-4 rounded-2xl hover:bg-primary/5"
                                >
                                    <span>{nestedMenu.label}</span>
                                    <ChevronDown size={20} className={`transition-transform duration-300 ${isMobileNestedOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isMobileNestedOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                                    <div className=" p-4 pl-0 bg-black/5 rounded-2xl border border-black/5 flex flex-col space-y-3">
                                        {nestedMenu.items.map((item: any, idx: number) => (
                                            <Link
                                                key={idx}
                                                href={item.url}
                                                target="_blank"
                                                className="text-textSecondary text-[14px] font-semibold hover:text-primary transition-colors flex items-center gap-2"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <div className="w-1 h-1 rounded-full bg-textSecondary/30" />
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
