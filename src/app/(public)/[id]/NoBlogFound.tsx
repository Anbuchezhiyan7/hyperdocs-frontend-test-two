'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, BookOpen, Home } from 'lucide-react';
import Button from '@/components/common/Buttons';

export default function NoBlogFound() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-12">
            <div className="w-full max-w-2xl text-center">
                
                {/* Visual Element: Stylized Illustration */}
                <div className="relative mb-10 flex justify-center">
                    <div className="absolute inset-0 m-auto h-40 w-40 animate-pulse rounded-full bg-primary/5 blur-3xl" />
                    <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-white shadow-2xl shadow-slate-200">
                        <Search size={48} className="text-slate-300" strokeWidth={1.5} />
                        <div className="absolute -bottom-2 -right-2 rounded-full bg-white p-2 shadow-lg">
                            <BookOpen size={24} className="text-primary" />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-6">
                    <div>
                        <span className="inline-block rounded-full bg-slate-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                            404 Error
                        </span>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                            Blog Not Found
                        </h1>
                    </div>

                    <p className="mx-auto max-w-lg text-lg leading-relaxed text-slate-600">
                        We searched through our library but couldn't find the story you're looking for. It might have been moved or the link is broken.
                    </p>

                    {/* Action Grid */}
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 text-white transition-all hover:!bg-slate-800 hover:!text-white hover:!border-color-inherit !border-none hover:shadow-lg sm:w-auto"
                            onClick={handleGoBack}
                        >
                            <ArrowLeft size={18} />
                            Go Back
                        </Button>
                        
                        <Button
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 text-slate-700 transition-all hover:bg-slate-50 sm:w-auto"
                            onClick={() => router.push('/')}
                        >
                            <Home size={18} />
                       Blog Home page
                        </Button>
                    </div>
                </div>

                {/* Subtle Help Footer */}
                {/* <div className="mt-16 pt-8 border-t border-slate-100">
                    <p className="text-sm text-slate-400">
                        Need help finding something specific? 
                        <a href="/search" className="ml-1 font-medium text-primary hover:underline">Try searching our archive</a>
                    </p>
                </div> */}
            </div>
        </div>
    );
}