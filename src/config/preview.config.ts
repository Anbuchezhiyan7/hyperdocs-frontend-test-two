import { Template1 } from '@/components/blog-templates/preview/template-1';
import { BlogAuthor } from '@/components/blog-templates/preview/template-1/BlogAuthor';
import { BlogAuthor as BlogAuthor2 } from '@/components/blog-templates/preview/template-2/BlogAuthor';
import BlogDetailPage from '@/components/blog-templates/preview/template-1/BlogDetailPage';
import BlogDetailPage2 from '@/components/blog-templates/preview/template-2/BlogDetailsPage';
import BlogsPage from '@/components/blog-templates/preview/template-2/BlogsPage';
import BlogsPage3 from '@/components/blog-templates/preview/template-3/BlogsPage';
import BlogDetailPage3 from '@/components/blog-templates/preview/template-3/BlogDetailsPage';
import { BlogAuthor as BlogAuthor3 } from '@/components/blog-templates/preview/template-3/BlogAuthor';

const TEMPLATE_CONFIG = {
    template_001: {
        id: 'template_001',
        routes: [
            {
                path: '/blogs',
                component: Template1,
            },
            {
                path: '/blogs/:id',
                component: BlogDetailPage,
            },
            {
                path: 'author',
                component: BlogAuthor,
            },
        ],
    },
    template_002: {
        id: 'template_002',
        routes: [
            {
                path: '/blogs',
                component: BlogsPage,
            },
            {
                path: '/blogs/:id',
                component: BlogDetailPage2,
            },
            {
                path: 'author',
                component: BlogAuthor2,
            },
        ],
    },
    template_003: {
        id: 'template_003',
        routes: [
            {
                path: '/blogs',
                component: BlogsPage3,
            },
            {
                path: '/blogs/:id',
                component: BlogDetailPage3,
            },
            {
                path: 'author',
                component: BlogAuthor3,
            },
        ],
    },
};

export default TEMPLATE_CONFIG;
