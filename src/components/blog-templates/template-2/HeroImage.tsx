import Image from 'next/image';
import React from 'react';

interface HeroImageProps {
    src: string;
    alt: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ src, alt }) => {     
    return (
        <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 md:mb-12 mb-4'>
              <div className='relative w-full h-auto rounded-xl overflow-hidden'>
                            <Image
                                src={src}
                                alt={alt}
                                className='w-full h-full object-cover'
                                width={1200}
                                height={630}
                                priority
                                fetchPriority="high"
                                sizes="(max-width: 1024px) 100vw, 1200px"
                            />
            </div>
        </div>
    );
};

export default HeroImage;
