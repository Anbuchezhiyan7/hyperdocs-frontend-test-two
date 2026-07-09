'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Monitor, X } from 'lucide-react';

export default function MobileDesktopBanner() {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    const banner = (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden">
            {/* Blurred backdrop gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/95 via-[#0a0a0f]/80 to-transparent backdrop-blur-md" />

            <div className="relative px-5 pt-6 pb-8">
                {/* Dismiss button */}
                <button
                    onClick={() => setDismissed(true)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 flex items-center justify-center transition-colors shadow-sm"
                    aria-label="Dismiss"
                >
                    <X className="w-4 h-4 text-white" />
                </button>

                {/* Content */}
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF5200] to-[#ff8c00] flex items-center justify-center shadow-lg shadow-[#FF5200]/30">
                        <Monitor className="w-5 h-5 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 pr-6">
                        <p className="text-white font-semibold text-[15px] leading-tight mb-1">
                            Better on Desktop
                        </p>
                        <p className="text-white/55 text-[13px] leading-snug">
                            For the full HyperBlog experience — rich editing, AI tools &amp; more — switch to a desktop browser.
                        </p>
                    </div>
                </div>

                <div className="mt-5 w-full h-[1px] bg-white/8" />
            </div>
        </div>
    );

    return createPortal(banner, document.body);
}
