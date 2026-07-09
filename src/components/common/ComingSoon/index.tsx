import React from 'react';
import Lottie from 'react-lottie-player';
import comingsoon from '@/assets/animation/comingsoon.json';

interface ComingSoonProps {
    width?: number;
    height?: number;
}

const ComingSoon = ({ width = 500, height = 300 }: ComingSoonProps) => {
    return (
        <div className="bg-white w-fit rounded-2xl">
            <Lottie
                loop
                play={true}
                animationData={comingsoon}
                style={{ width, height }}
            />
        </div>
    );
};

export default ComingSoon;
