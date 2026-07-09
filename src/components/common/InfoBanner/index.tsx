import { WarningIcon } from '@/assets/icons'; 

interface InfoBannerProps {
    content: string;
    variant?: 'warning' | 'danger';
    fullWidth?: boolean;
}

const InfoBanner = ({ content, variant = 'warning', fullWidth = false }: InfoBannerProps) => {
    const styles = {
        warning: {
            border: '#FFC107',
            background: '#332600',
            text: '#FFC107',
            contentText: 'white',
        },
        danger: {
            border: '#DC3545',
            background: '#FBE9EB',
            text: '#DC3545',
            contentText: 'black',
        },
    };

    const currentStyle = styles[variant];

    return (
        <div className="w-full flex items-center justify-center">
            <div
                className={`w-full border-l-[7px] flex items-center rounded-[10px] py-3 ${
                    fullWidth ? '' : 'max-w-3xl mx-auto'
                }`}
                style={{
                    borderLeftColor: currentStyle.border,
                    backgroundColor: currentStyle.background,
                }}
            >
                <p className="flex items-center gap-2 px-4" style={{ color: currentStyle.text }}>
                    <span className="text-[1.5rem]">
                        <WarningIcon />
                    </span>
                    <span className="text-[14px] font-medium">Warning :</span>
                    <span
                        className="text-[14px] font-medium"
                        style={{ color: currentStyle.contentText }}
                    >
                        {content}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default InfoBanner;
