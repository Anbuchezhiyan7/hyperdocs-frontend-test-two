import Image from 'next/image';
import React from 'react';

interface HeroImageProps {
    src: string;
    alt: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ src, alt }) => {
    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 md:mb-12 mb-4'>
            <div className='relative w-full md:h-[60vh] h-[300px] rounded-xl overflow-hidden'>
                <Image
                    src={src}
                    alt={alt}
                    className='w-full h-full object-cover'
                    width={1000}
                    height={1000}
                />
            </div>
        </div>
    );
};

export default HeroImage;
