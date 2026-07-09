import React, { useEffect, useState } from 'react';

interface ReadingProgressProps {
    containerRef: React.RefObject<HTMLDivElement>;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({ containerRef }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateProgress = () => {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight - container.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            setProgress(scrollPercent);
        };

        container.addEventListener('scroll', updateProgress);
        return () => container.removeEventListener('scroll', updateProgress);
    }, [containerRef]);

    return (
        <div className='fixed top-0 left-0 w-full h-1 bg-gray-200 z-50'>
            <div
                className='h-full !bg-primary transition-all duration-150'
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ReadingProgress;
