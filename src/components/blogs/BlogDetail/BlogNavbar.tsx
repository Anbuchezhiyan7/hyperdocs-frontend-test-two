import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import { Button } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';

interface BlogNavbarProps {
    blog: Blog;
    onBack: () => void;
    isLoading: boolean;
}

const BlogNavbar: React.FC<BlogNavbarProps> = ({ blog, onBack, isLoading }) => {
    const router = useRouter();
    const params = useParams();
    const blogId = params?.id as string;

    const handleEditorNavigation = () => {
        router.push(`/admin/editor/${blogId}`);
    };

    const handleBack = () => {
        router.push('/admin/blogs');
    };

    return (
        <div className="bg-white border-b border-gray-200 w-full sticky top-0 z-50">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        {/* <button
                            onClick={onBack}
                            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button> */}

                        <div className="flex items-center text-gray-500">
                            <FileText size={18} className="mr-2" />
                            <Link className="hover:underline" href="/admin/blogs">
                                Blogs
                            </Link>
                            <ChevronRight size={16} className="mx-2" />
                            <span className="text-gray-800 font-medium truncate max-w-xl">
                                {blog?.blog_title}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="text-gray-500 mr-4">
                            Last Updated:{' '}
                            <span className="font-medium">
                                {dayjs(blog?.updated_at).format('DD-MM-YYYY')}
                            </span>
                        </div>
                        <Button
                            className="text-white rounded-[14px]"
                            iconPosition="start"
                            type="primary"
                            onClick={handleEditorNavigation}
                            disabled={isLoading}
                        >
                            Go to Editor
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogNavbar;
