import { Dispatch, SetStateAction, useEffect } from 'react';

const formatTime = (seconds: number) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
};

const OtpTimer = ({
    headTimer,
    setHeadTimer,
}: {
    headTimer: number;
    setHeadTimer: Dispatch<SetStateAction<number>>;
}) => {
    useEffect(() => {
        if (headTimer <= 0) return;
        const interval = setInterval(() => {
            setHeadTimer(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [headTimer]);

    return (
        <p>
            {headTimer > 0 && (
                <span className='text-sm text-[#5D5D5D]'>Resend in: {formatTime(headTimer)}</span>
            )}
        </p>
    );
};

export default OtpTimer;
