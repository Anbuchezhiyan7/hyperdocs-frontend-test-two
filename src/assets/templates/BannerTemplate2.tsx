import { cn } from '@/lib/utils';

type Props = {
    colors: string[];
    className?: string;
};

const BannerTemplate2 = ({ colors, className }: Props) => {
    return (
        <svg
            viewBox='0 0 900 600'
            width='100%'
            height='100%'
            preserveAspectRatio='xMidYMid slice'
            xmlns='http://www.w3.org/2000/svg'
            xmlnsXlink='http://www.w3.org/1999/xlink'
            className={cn(className)}
        >
            <defs>
                <filter id='blur1' x='-10%' y='-10%' width='120%' height='120%'>
                    <feFlood floodOpacity='0' result='BackgroundImageFix'></feFlood>
                    <feBlend
                        mode='normal'
                        in='SourceGraphic'
                        in2='BackgroundImageFix'
                        result='shape'
                    ></feBlend>
                    <feGaussianBlur
                        stdDeviation='161'
                        result='effect1_foregroundBlur'
                    ></feGaussianBlur>
                </filter>
            </defs>
            <rect width='900' height='600' fill={colors[1]}></rect>
            <g filter='url(#blur1)'>
                <circle cx='773' cy='30' fill={colors[1]} r='357'></circle>
                <circle cx='607' cy='458' fill={colors[2]} r='357'></circle>
                <circle cx='205' cy='390' fill={colors[1]} r='357'></circle>
                <circle cx='112' cy='592' fill={colors[1]} r='357'></circle>
                <circle cx='342' cy='133' fill={colors[1]} r='357'></circle>
                <circle cx='46' cy='224' fill={colors[1]} r='357'></circle>
            </g>
        </svg>
    );
};

export default BannerTemplate2;
