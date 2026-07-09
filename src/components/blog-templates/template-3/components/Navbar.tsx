'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useTemplateStore } from '@/store/useTemplateStore';
import { getLogoDimensions } from '@/utils/findAspectRatio';
import { dummyCTA, dummyNavigation, dummyNestedMenu } from '../../preview/dummyData';
import { useTemplate3Bg } from '../useTemplate3Bg';

interface NavbarProps {
    isPreviewMode?: boolean;
}

const Navbar3: React.FC<NavbarProps> = ({ isPreviewMode }) => {
    const template = useTemplateStore(state => state.templateData?.['template']);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mode] = useQueryState('mode');
    const isPreview = mode === 'preview' || isPreviewMode;

    const navigationData =
        isPreview && (!template?.navigation || template.navigation.length === 0)
            ? dummyNavigation
            : template?.navigation || [];
    const headerCTA = isPreview && !template?.headerCTA ? dummyCTA : template?.headerCTA;
    const nestedMenu = isPreview && !template?.nestedMenu ? dummyNestedMenu : template?.nestedMenu;

    const accent = template?.general?.accent_color || '#FF5A1F';
    const bgColor = useTemplate3Bg();
    const logo = template?.advanced?.logo?.url || '/images/placeholder/no-image.webp';
    const logoDimensions = getLogoDimensions(template?.advanced?.logo?.aspect_ratio);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className="sticky top-0 z-50 px-4 pt-3 md:px-6 md:pt-4"
            style={{ ['--accent3' as string]: accent, backgroundColor: bgColor }}
        >
            <div
                className={`mx-auto flex w-full max-w-[1120px] items-center justify-between gap-4 rounded-full border px-3 py-2 transition-all duration-300 md:px-4 ${
                    scrolled
                        ? 'border-[#E0D6C6] bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.1)] backdrop-blur-xl'
                        : 'border-[#E7DECF] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md'
                }`}
            >
                {/* Left: mobile toggle + logo */}
                <div className="flex flex-shrink-0 items-center gap-3 pl-1">
                    <button
                        type="button"
                        aria-label="Open menu"
                        onClick={() => setIsMenuOpen(true)}
                        className="text-[#1A1A1A] transition-colors hover:opacity-70 md:hidden"
                    >
                        <Menu size={24} />
                    </button>
                    <Link href="/" className="flex items-center">
                        <div
                            className="flex items-center overflow-hidden"
                            style={{ minWidth: '110px', height: `${logoDimensions.height}px` }}
                        >
                            <Image
                                src={logo}
                                alt="Logo"
                                className="object-contain"
                                width={logoDimensions.width}
                                height={logoDimensions.height}
                                priority
                            />
                        </div>
                    </Link>
                </div>

                {/* Center: nav links pill */}
                <nav className="hidden items-center gap-1 rounded-full bg-white/40 px-1.5 py-1 md:flex">
                    {navigationData.map((link: any) => (
                        <Link
                            key={link.menu_id}
                            href={link.menu_link}
                            target="_blank"
                            className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-[#3A3A3A] transition-all hover:bg-white hover:text-[#1A1A1A] hover:shadow-sm"
                        >
                            {link.menu_name}
                        </Link>
                    ))}

                    {nestedMenu && (
                        <div className="group relative cursor-pointer">
                            <div className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-[#3A3A3A] transition-all group-hover:bg-white group-hover:text-[#1A1A1A] group-hover:shadow-sm">
                                <span>{nestedMenu.label}</span>
                                <ChevronDown
                                    size={14}
                                    className="transition-transform duration-300 group-hover:rotate-180"
                                />
                            </div>
                            <div className="absolute left-1/2 top-full z-50 hidden w-56 -translate-x-1/2 pt-3 group-hover:block">
                                <div className="overflow-hidden rounded-2xl border border-[#E7DECF] bg-white py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
                                    {nestedMenu.items.map((item: any, idx: number) => (
                                        <Link
                                            key={idx}
                                            href={item.url}
                                            target="_blank"
                                            className="block px-4 py-2.5 text-sm font-medium text-[#3A3A3A] transition-all hover:bg-[#F4EFE8] hover:pl-6 hover:text-[#1A1A1A]"
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Right: CTA (hidden on mobile — available in hamburger menu) */}
                <div className="hidden flex-shrink-0 items-center md:flex">
                    {headerCTA && (
                        <a
                            href={headerCTA.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                backgroundColor: headerCTA.backgroundColor || accent,
                                color: headerCTA.buttonColor || '#fff',
                            }}
                            className="group flex items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-all hover:brightness-110 hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] active:scale-95 sm:text-sm"
                        >
                            {headerCTA.label}
                            <ArrowUpRight
                                size={16}
                                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>
                    )}
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
            <div
                style={{ backgroundColor: bgColor }}
                className={`fixed left-0 top-0 z-[70] w-full rounded-b-[2rem] border-b border-[#E7DECF] shadow-2xl transition-transform duration-500 md:hidden ${
                    isMenuOpen ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <div className="flex max-h-[90vh] flex-col overflow-y-auto p-8 pt-6">
                    <div className="mb-8 flex items-center justify-between">
                        <Image src={logo} alt="Logo" width={120} height={20} className="object-contain" />
                        <button
                            type="button"
                            aria-label="Close menu"
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-full bg-black/5 p-2.5 text-[#1A1A1A] transition-all hover:rotate-90 hover:bg-black/10"
                        >
                            <X size={22} />
                        </button>
                    </div>
                    <nav className="flex flex-col gap-2">
                        {navigationData.map((link: any) => (
                            <Link
                                key={link.menu_id}
                                href={link.menu_link}
                                target="_blank"
                                onClick={() => setIsMenuOpen(false)}
                                className="rounded-2xl border-b border-black/5 p-4 text-[15px] font-bold text-[#1A1A1A] transition-all last:border-0 hover:bg-white/60"
                            >
                                {link.menu_name}
                            </Link>
                        ))}
                        {headerCTA && (
                            <a
                                href={headerCTA.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsMenuOpen(false)}
                                style={{ backgroundColor: headerCTA.backgroundColor || accent }}
                                className="mt-3 flex items-center justify-center gap-1.5 rounded-2xl px-5 py-3.5 text-sm font-bold text-white"
                            >
                                {headerCTA.label}
                                <ArrowUpRight size={16} />
                            </a>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar3;
