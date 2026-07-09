import React, { useEffect, useState } from 'react';

interface ReadingProgressProps {
    // containerRef is no longer needed
}

const ReadingProgress: React.FC<ReadingProgressProps> = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(scrollPercent);
        };

        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', updateProgress);
        updateProgress(); // set initial value
        return () => {
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
        };
    }, []);

    return (
        <div className='fixed top-0 left-0 w-full h-1 bg-gray-200 z-50'>
            <div
                className='h-full !bg-[#0080FF] transition-all duration-150'
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ReadingProgress;
