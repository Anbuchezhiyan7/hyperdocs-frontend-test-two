// const plans = [
//     {
//         name: 'Free',
//         features: [
//             '400 Ai Credits',
//             'Auto technical SEO',
//             'Easy migration from Wordpress and other CMS',
//         ],
//     },
//     {
//         name: 'Launch',
//         features: [
//             '400 Ai Credits',
//             'Auto technical SEO',
//             'Easy migration from Wordpress and other CMS',
//             'Connect your Own domain',
//             '1 Member',
//             '< 100,000 pageviews/mo ( Unlimited pageview / Month )',
//             '< 50 posts/mo',
//             'Subdirectory hosting',
//             'Remove Hyperblog branding',
//             'Free SSL & CDN',
//             'Schedule Posts',
//             'Google Analytics & GSC Integration',
//             'Basic templates',
//             '24/5 Support',
//             'SEO score',
//             'Author Bio',
//             '500 Leads Capturing / Month',
//             'Ai Banner creation',
//             'Ai Lead Magnet',
//             'Ai Lead Magnet Design',
//         ],
//     },
//     {
//         name: 'Grow',
//         features: [
//             '1200 Ai Credits',
//             'Auto technical SEO',
//             'Easy migration from Wordpress and other CMS',
//             'Connect your Own domain',
//             'upto 5 Team members',
//             '< 100,000 pageviews/mo ( Unlimited pageview / Month )',
//             '< 100 posts/mo',
//             'Subdirectory hosting',
//             'Remove Hyperblog branding',
//             'Free SSL & CDN',
//             'Schedule Posts',
//             'Google Analytics & GSC Integration',
//             'Premium templates',
//             '24/5 Support',
//             'SEO score',
//             'Author Bio',
//             'Unlimited Leads Capturing / Month',
//             'Ai Banner creation',
//             'Ai Lead Magnet',
//             'Ai Lead Magnet Design',
//             'Ai Helper',
//             'Ai Poll creation',
//             'Ai Infographics Creation',
//             'Ai Internal Links',
//             'Privacy-friendly Analytics',
//             'Collaborative review of posts',
//         ],
//     },
//     {
//         name: 'Scale',
//         features: [
//             '4000 Ai Credits',
//             'Auto technical SEO',
//             'Easy migration from Wordpress and other CMS',
//             'Connect your Own domain',
//             'upto 5 Team members',
//             '< 100,000 pageviews/mo ( Unlimited pageview / Month )',
//             '< 500 posts/mo',
//             'Subdirectory hosting',
//             'Remove Hyperblog branding',
//             'Free SSL & CDN',
//             'Schedule Posts',
//             'Google Analytics & GSC Integration',
//             'Premium pro templates',
//             '24/5 Priority Support',
//             'SEO score',
//             'Author Bio',
//             'Unlimited Leads Capturing / Month',
//             'Ai Banner creation',
//             'Ai Lead Magnet',
//             'Ai Lead Magnet Design',
//             'Ai Helper',
//             'Ai Poll creation',
//             'Ai Infographics Creation',
//             'Ai Internal Links',
//             'Privacy-friendly Analytics',
//             'Collaborative review of posts',
//             'Restrict Free email Domains / Allow only official E-mails',
//             'Webhooks for Leads',
//             'API Access (self-serve)',
//             'Leads Magnet Analysis - which lead magnet provides more Leads',
//             'Individual Blog wise Leads',
//             'Blog Approval Flow',
//             'Spreadsheet / Google Docs to blog posts',
//             'Zapier integration',
//         ],
//     },
// ];

const PlanInfo = ({ plans }: { plans: Plan[] }) => {
    return (
        <div className='mt-2 bg-[#F3F3F3] rounded-b-[10px] p-5 w-full'>
            <div className='grid grid-cols-5 gap-6'>
                <div className='flex flex-col gap-3'>
                    <h3 className='text-[12px] text-[#333] font-[600]'>Highlights</h3>
                </div>
                {plans?.map(plan => (
                    <div key={plan.name} className='flex flex-col gap-[10px]'>
                        <div className='flex flex-col gap-[1px]'>
                            {Array.isArray(plan?.features) &&
                                plan?.features?.map((feature, index) => (
                                    <div key={index} className='flex items-start gap-2 '>
                                        <span className='text-[#333]'>•</span>
                                        <p className='text-[12px] font-[500] leading-[20px] text-[#5D5D5D]'>
                                            {feature}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlanInfo;
