import React, { useRef } from 'react';
import SettingsHeader from '../partials/SettingsHeader';
import blogApi from '@/api/blog.api';
import { queryClient, useSendData } from '@/config/query.config';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from '@/components/plate-ui/spinner';
import useImportService from '@/services/import.service';
import { WordPressIcon } from '@/assets/icons'; 
import { useQueryState } from 'nuqs';

interface ImportOption {
    key: string;
    title: string;
    description: string;
    accept: string;
    icon: React.ReactNode;
}

const importOptions: ImportOption[] = [
    // {
    //     key: 'google-docs',
    //     title: 'Google Docs',
    //     description: 'Bring in your Google Docs',
    //     accept: '.doc,.docx',
    //     // icon: <GoogleDocsIcon />
    // },
    // {
    //     key: 'word',
    //     title: 'Word',
    //     description: 'Bring in your word documents',
    //     accept: '.doc,.docx',
    //     // icon: <WordIcon />
    // },
    // {
    //     key: 'text-markdown',
    //     title: 'Text & Markdown',
    //     description: 'Import plain text and formatted notes',
    //     accept: '.txt,.md',
    //     // icon: <TextMarkdownIcon />
    // },
    // {
    //     key: 'html',
    //     title: 'HTML',
    //     description: 'Import web pages and content',
    //     accept: '.html,.htm',
    //     // icon: <HtmlIcon />
    // },
    // {
    //     key: 'zip',
    //     title: 'Zip',
    //     description: 'Import zip file to pages',
    //     accept: '.zip',
    //     // icon: <ZipIcon />
    // },
    // {
    //     key: 'pdf',
    //     title: 'PDF',
    //     description: 'Extract content from PDF documents',
    //     accept: '.pdf',
    //     // icon: <PdfIcon />
    // },
    // {
    //     key: 'csv',
    //     title: 'CSV',
    //     description: 'Import your data from spreadsheets',
    //     accept: '.csv',
    //     // icon: <CsvIcon />
    // },
    {
        key: 'wordpress',
        title: 'Wordpress',
        description: 'Import your wordpress posts',
        accept: '.xml',
        icon: <WordPressIcon />,
    },
];

const ImportOptionCard: React.FC<{
    option: ImportOption;
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ option, handleFileSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const activeSubscription = () =>
        queryClient.getQueryData<ActiveSubscription>(['active_subscription']);
    const remainingBlogs = () => queryClient.getQueryData<any>(['remaining-blogs']);

    const isFreePlan = activeSubscription()?.plan_details?.plan_id === 'free_plan';
    const remainingBlogsAvailable = remainingBlogs()?.remaining_blogs;
    const handleClick = () => {
        if (isFreePlan && remainingBlogsAvailable <= 0) {
            toast.error('You have no remaining blogs');
            return Promise.reject('You have no remaining blogs');
        }
        fileInputRef.current?.click();
    };

    return (
        <div
            onClick={handleClick}
            className='flex items-center gap-4 p-5 bg-white rounded-xl border border-[#E0E0E0] shadow-sm hover:shadow-md transition cursor-pointer min-h-[100px]'
        >
            <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept={option.accept}
                className='hidden'
                aria-label={`Import ${option.title}`}
            />
            {/* Icon placeholder */}
            <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-2xl font-bold'>
                {option.icon}
            </div>
            <div className='flex flex-col'>
                <span className='font-semibold text-[#333] text-base'>{option.title}</span>
                <span className='text-sm text-[#5D5D5D]'>{option.description}</span>
            </div>
        </div>
    );
};

const ImportTab: React.FC = () => {
    const router = useRouter();
    const { handleConvertWordPressXML } = useImportService();
    const activeSubscription = () =>
        queryClient.getQueryData<ActiveSubscription>(['active_subscription']);
    const remainingBlogs = () => queryClient.getQueryData<any>(['remaining-blogs']);
    const [modelType, setModelType] = useQueryState('model-type');

    const isFreePlan = activeSubscription()?.plan_details?.plan_id === 'free_plan';
    const remainingBlogsAvailable = remainingBlogs()?.remaining_blogs;

    const handleSuccess = () => {
        router.push('/blogs');
    };

    const handleCheckRemainingBlogsAndCreateBlog = async (data: any) => {
        if (isFreePlan && remainingBlogsAvailable <= 0) {
            toast.error('You have no remaining blogs');
            setModelType('pricing');
            return Promise.reject('You have no remaining blogs');
        }
        return await handleCreateBlog(data);
    };

    const { mutateAsync: handleCreateBlog, isPending } = useSendData<any>({
        fn: blogApi.handleCreateBlog,
        error: (err: any) => {
            return Promise.reject(err);
        },
        invalidateKey: ['blogs', 'remaining-blogs', 'active_subscription'],
    });

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>,
        option: ImportOption
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const content = await file.text();
            console.log(`File selected for ${option.key}:`, file.name);

            if (option.key === 'wordpress') {
                const posts = await handleConvertWordPressXML(content);
                console.log('Converted WordPress posts:', posts);

                if (isFreePlan && posts?.length > remainingBlogsAvailable) {
                    toast.error('Your posts are more than your remaining blogs');
                    setModelType('pricing');
                    return Promise.reject('Your posts are more than your remaining blogs');
                }

                const results = await Promise.allSettled(
                    posts.map(post =>
                        handleCheckRemainingBlogsAndCreateBlog({
                            ...post,
                            blog_info: {
                                slug_url: post.slug_url,
                            },
                        })
                    )
                );

                const successful = results.filter(r => r.status === 'fulfilled').length;
                const failed = results.filter(r => r.status === 'rejected').length;

                if (successful > 0) {
                    toast.success(
                        `Successfully imported ${successful} post${successful > 1 ? 's' : ''}`
                    );
                }
                if (failed > 0) {
                    toast.error(`Failed to import ${failed} post${failed > 1 ? 's' : ''}`);
                }

                if (successful > 0 && failed === 0) {
                    router.push('/blogs');
                }
            } else {
                console.log('File content:', content);
            }
        } catch (error) {
            console.error('Error processing file:', error);
        }
    };

    return (
        <div className='h-full flex flex-col gap-4 pb-5'>
            <SettingsHeader
                title='Import or migrate'
                description='Import data from other apps and files into Hyperblog'
            />
            {isPending ? (
                <div className='flex items-center gap-2 justify-center h-full'>
                    <Spinner className='w-10 h-10 ' />
                    <span className='text-lg text-gray-500'>Importing...</span>
                </div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2'>
                    {importOptions.map(option => (
                        <ImportOptionCard
                            key={option.key}
                            option={option}
                            handleFileSelect={e => handleFileSelect(e, option)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImportTab;
