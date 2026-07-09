const BlogDetailSkeleton = () => {
    return (
        <div className='min-h-screen bg-white'>
            <div className='container-custom py-10'>
                <div className='grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]'>
                    <aside className='hidden xl:block space-y-6'>
                        <div className='h-10 w-36 rounded-full bg-gray-200 animate-pulse'></div>
                        <div className='space-y-3 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm'>
                            {Array.from({ length: 25 }).map((_, item) => (
                                <div key={item} className='h-4 rounded-full bg-gray-200 animate-pulse'></div>
                            ))}
                        </div>
                    </aside>

                    <main className='space-y-8'>
                        <div className='space-y-4'>
                            <div className='h-8 w-1/3 rounded-full bg-gray-200 animate-pulse'></div>
                            <div className='h-14 w-3/4 rounded-full bg-gray-200 animate-pulse'></div>
                            <div className='h-4 w-1/4 rounded-full bg-gray-200 animate-pulse'></div>
                        </div>

                        <div className='space-y-5'>
                            <div className='h-8 w-40 rounded-full bg-gray-200 animate-pulse'></div>
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className='space-y-3'>
                                    <div className='h-5 rounded-full bg-gray-200 animate-pulse'></div>
                                    <div className='h-5 rounded-full bg-gray-200 animate-pulse w-5/6'></div>
                                    <div className='h-5 rounded-full bg-gray-200 animate-pulse w-11/12'></div>
                                </div>
                            ))}
                        </div>

                        <div className='grid gap-4 lg:grid-cols-2'>
                            {[1, 2].map((item) => (
                                <div key={item} className='space-y-3 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
                                    <div className='h-40 rounded-3xl bg-gray-200 animate-pulse'></div>
                                    <div className='h-5 w-3/4 rounded-full bg-gray-200 animate-pulse'></div>
                                    <div className='h-4 w-1/2 rounded-full bg-gray-200 animate-pulse'></div>
                                </div>
                            ))}
                        </div>
                    </main>

                    <aside className='space-y-6'>
                        <div className='h-10 w-40 rounded-full bg-gray-200 animate-pulse'></div>
                        <div className='space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
                            <div className='h-48 rounded-3xl bg-gray-200 animate-pulse'></div>
                            <div className='h-6 w-3/4 rounded-full bg-gray-200 animate-pulse'></div>
                            <div className='h-4 w-1/2 rounded-full bg-gray-200 animate-pulse'></div>
                            <div className='space-y-2 pt-4'>
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className='h-4 rounded-full bg-gray-200 animate-pulse'></div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailSkeleton;
