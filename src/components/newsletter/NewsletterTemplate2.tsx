'use client';
import { cn } from '@/utils/cn';
import React, { useState } from 'react';
import { MailIcon, Loader2, ArrowRight } from 'lucide-react';

interface NewsletterTemplate2Props {
    title: string;
    description: string;
    buttonText: string;
    placeholderText?: string;
    rightHeading?: string;
    rightSubtext?: string;
    readOnly?: boolean;
    onSubscribe?: (email: string) => Promise<void>;
    isLoading?: boolean;
     viewMode?:boolean;
}

const NewsletterTemplate2: React.FC<NewsletterTemplate2Props> = ({
    title,
    description,
    buttonText,
    placeholderText = 'Enter your email address',
    rightHeading = 'Join our readers',
    rightSubtext = 'No spam. Unsubscribe anytime.',
    readOnly,
    onSubscribe,
    isLoading,
    viewMode
}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!readOnly) return;
        if (!email || !email.includes('@')) return;
        await onSubscribe?.(email);
        setEmail('');
        setSubmitted(true);
    };

    return (
        <div className="w-full mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 mb-6">
            {/* Top accent bar */}
            <div
                className="h-1.5 w-full"
                style={{ background: 'linear-gradient(90deg, #FF5200 0%, #FF7E47 50%, #ffb347 100%)' }}
            />

            <div className="flex flex-col md:flex-row w-full">
                {/* LEFT — Branding panel */}
                <div
                    className="flex flex-col justify-center gap-5 px-8 py-10 md:px-10 md:py-12 md:w-[48%]"
                    style={{ background: 'linear-gradient(145deg, #FF5200 0%, #FF7E47 100%)' }}
                >

                    {/* Icon + heading */}
                    <div className="flex flex-col gap-3">
                        <div className="bg-white/15 border border-white/25 rounded-2xl p-3 w-fit shadow-lg backdrop-blur-sm">
                            <MailIcon className="w-7 h-7 text-white" strokeWidth={2} />
                        </div>
                        <p className="text-white text-2xl md:text-3xl font-extrabold leading-tight tracking-tight drop-shadow-sm m-0">
                            {title}
                        </p>
                        <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed max-w-xs">
                            {description}
                        </p>
                    </div>

                    {/* Decorative circles */}
                    <div className="relative h-0 pointer-events-none">
                        <div className="absolute -bottom-28 -right-10 w-44 h-44 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -top-16 -left-8 w-28 h-28 rounded-full bg-white/5 blur-xl" />
                    </div>
                </div>

                {/* RIGHT — Form panel */}
                <div className="flex flex-col justify-center gap-6 px-8 py-10 md:px-10 md:py-12 md:w-[52%] bg-[#FFF8F4]">
                    {submitted && readOnly ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                                style={{ background: 'linear-gradient(135deg, #FF5200, #FF7E47)' }}>
                                🎉
                            </div>
                            <p className="text-xl font-bold text-gray-800">You're in!</p>
                            <p className="text-sm text-gray-500">Thanks for subscribing. Stay tuned for great content.</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1">
                                <p className="text-gray-800 font-bold text-lg md:text-xl">{rightHeading}</p>
                                <p className="text-gray-500 text-sm">{rightSubtext}</p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-3 w-full"
                                onClick={e => readOnly && e.stopPropagation()}
                            >
                                <div className="relative">
                                    <MailIcon
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                        strokeWidth={2}
                                    />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder={placeholderText}
                                        disabled={!readOnly || isLoading}
                                        required
                                        className="w-full bg-white text-gray-900 placeholder:text-gray-400 rounded-2xl py-4 pl-11 pr-4 outline-none border-2 border-gray-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all text-sm shadow-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!readOnly || isLoading}
                                    className={cn(
                                        'flex items-center justify-center gap-2 w-full text-white font-bold py-4 rounded-2xl text-sm transition-all duration-300 shadow-lg hover:shadow-orange-300/50 hover:scale-[1.02] active:scale-95',
                                        (!readOnly || isLoading) && 'pointer-events-none opacity-80'
                                    )}
                                    style={{ background: 'linear-gradient(135deg, #FF5200 0%, #FF7E47 100%)' }}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Subscribing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{buttonText}</span>
                                            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                                        </>
                                    )}
                                </button>
                            </form>

                        
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewsletterTemplate2;
