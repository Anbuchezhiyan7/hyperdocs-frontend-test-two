interface UploadInfoProps {
    title: string;
    content: string[];
}

export default function UploadInfo ({ title, content }: UploadInfoProps) {
    return (
        <div className='bg-input-background rounded-lg p-4 mb-4'>
            <h2 className='text-xl font-semibold mb-2'>{title}</h2>
            <div className='space-y-1'>
                {content.map((item, index) => (
                    <div key={index} className='text-gray-700'>
                        {index + 1}. {item}
                    </div>
                ))}
            </div>
        </div>
    );
}
