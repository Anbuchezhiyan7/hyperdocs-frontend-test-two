import { cn } from '@/utils/cn';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

type SuggestionLoaderProps = {
    label?: string;
    rootClassName?: string;
    labelClassName?: string;
    subTitle?: string;
};

const SuggestionLoader = ({
    label = 'Analyzing your content',
    rootClassName = '',
    labelClassName = '',
    subTitle = '',
}: SuggestionLoaderProps) => {
    return (
        <div
            className={cn(
                'fixed flex top-0 bottom-0 left-0 right-0 z-50 items-center justify-center flex-col gap-4 bg-white/60 backdrop-blur-[12px] ',
                rootClassName
            )}
        >
            <DotLottieReact
                src='https://lottie.host/6a5080bb-ed9c-4ac8-a364-57dadef27aec/YpRZ7zZi5P.lottie'
                loop
                autoplay
                style={{
                    background: 'transparent',
                    width: '50px',
                    height: '50px',
                }}
                speed={1}
            />
            <p
                className={cn(
                    'text-[#333] flex flex-col gap-1 text-center font-plus-jakarta text-xl font-semibold',
                    labelClassName
                )}
            >
                {label}
                <span className="text-[#333] text-center font-plus-jakarta text-xl font-semibold">
                    {subTitle}
                </span>
            </p>
        </div>
    );
};

export default SuggestionLoader;
