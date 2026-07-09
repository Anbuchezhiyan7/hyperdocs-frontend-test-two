'use client';
import { cn } from '@/utils/cn';
import React, { useState } from 'react';
import { MailIcon, Loader2 } from 'lucide-react';

interface NewsletterTemplate1Props {
    title: string;
    description: string;
    buttonText: string;
    placeholderText?: string;
    readOnly?: boolean;
    onSubscribe?: (email: string) => Promise<void>;
    isLoading?: boolean;
    viewMode?: boolean;
}

const NewsletterTemplate1: React.FC<NewsletterTemplate1Props> = ({
    title,
    description,
    buttonText,
    placeholderText = 'Enter Your Email Address',
    readOnly,
    onSubscribe,
    isLoading,
    viewMode
}) => {
    const containerStyle = { backgroundImage: 'linear-gradient(135deg, #FF5200 0%, #FF7E47 100%)' };
    const btnBg = '#FF5200';

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
        <div
            className={cn(
                'flex flex-col mb-6 w-full mx-auto p-8 md:p-12 gap-5 md:gap-6 items-center justify-center rounded-[2rem] shadow-2xl relative overflow-hidden transition-all duration-300 border border-white/10'
            )}
            style={containerStyle}
        >
            {!viewMode && <div className="absolute inset-0 bg-black/5 pointer-events-none" />}
            {!viewMode && <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />}

            <div className='flex flex-col gap-4 md:gap-6 items-center justify-center w-full z-10 relative'>
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-sm">
                    <MailIcon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
                </div>

                <div className="space-y-2 md:space-y-3 text-center">
                    <p className='text-white text-2xl md:text-5xl font-extrabold tracking-tight leading-[1.1] my-0 drop-shadow-sm'>
                        {title}
                    </p>
                    <p className='text-white/80 font-inter text-sm md:text-lg font-medium max-w-lg mx-auto leading-relaxed'>
                        {description}
                    </p>
                </div>

                {submitted && readOnly ? (
                    <p className="text-white font-semibold text-lg">🎉 Thank you for subscribing!</p>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col md:flex-row w-full max-w-xl mt-4 gap-3 relative group"
                        onClick={e => readOnly && e.stopPropagation()}
                    >
                        <div className="relative flex-grow">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder={placeholderText}
                                disabled={!readOnly || isLoading}
                                required
                                className="w-full bg-white text-gray-900 placeholder:text-gray-400 rounded-2xl md:rounded-full py-4 px-6 md:pl-8 md:pr-4 outline-none focus:ring-4 focus:ring-white/30 transition-all text-base border-none shadow-xl"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!readOnly || isLoading}
                            style={{ backgroundColor: btnBg }}
                            className={cn(
                                'md:absolute md:right-1.5 md:top-1.5 md:bottom-1.5 flex items-center justify-center gap-2 whitespace-nowrap text-white px-10 py-4 md:py-0 rounded-2xl md:rounded-full font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg',
                                (!readOnly || isLoading) && 'pointer-events-none opacity-80'
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Subscribing...</span>
                                </>
                            ) : buttonText}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default NewsletterTemplate1;
