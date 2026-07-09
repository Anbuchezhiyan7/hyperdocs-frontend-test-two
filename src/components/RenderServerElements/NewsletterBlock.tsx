'use client';
import React from 'react';
import { toast } from 'sonner';
import leadMagnetsApi from '@/api/lead-magnet.api';
import NewsletterTemplate1 from '@/components/newsletter/NewsletterTemplate1';
import NewsletterTemplate2 from '@/components/newsletter/NewsletterTemplate2';

interface NewsletterTemplate {
    template_id: string;
    template_name: string;
    title: string;
    button_text: string;
    description: string;
    right_panel_heading: string | null;
    right_panel_subtext: string | null;
    is_active: boolean;
}

interface NewsletterBlockProps {
    tpl: NewsletterTemplate;
    blogId: string;
}

const NewsletterBlock: React.FC<NewsletterBlockProps> = ({ tpl, blogId }) => {
    const handleSubscribe = async (email: string) => {
        const now = new Date().toISOString();
        await leadMagnetsApi.handleStoreBlogLeadMagnet({
            user_email: email,
            blog_id: blogId,
            lead_magnet_id: tpl.template_id,
            lead_type: 'newsletter',
            created_date: now,
            created_time: now,
        });
        toast.success('You have subscribed successfully!');
    };

    if (tpl.template_name === 'template_2') {
        return (
            <NewsletterTemplate2
                title={tpl.title}
                description={tpl.description}
                buttonText={tpl.button_text}
                placeholderText="Enter your email address"
                rightHeading={tpl.right_panel_heading ?? 'Join our readers'}
                rightSubtext={tpl.right_panel_subtext ?? 'No spam. Unsubscribe anytime.'}
                readOnly={true}
                viewMode={true}
                onSubscribe={handleSubscribe}
            />
        );
    }

    return (
        <NewsletterTemplate1
            title={tpl.title}
            description={tpl.description}
            buttonText={tpl.button_text}
            placeholderText="Enter your email address"
            readOnly={true}
            viewMode={true}
            onSubscribe={handleSubscribe}
        />
    );
};

export default NewsletterBlock;
