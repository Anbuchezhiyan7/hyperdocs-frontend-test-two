import LeadMagnetTemplate1 from './lead-magnet-template-1';
import LeadMagnetTemplate2 from './lead-magnet-template-2';
import LeadMagnetTemplate3 from './lead-magnet-template-3';
import LeadMagnetTemplate4 from './lead-magnet-template-4';
import LeadMagnetTemplate5 from './lead-magnet-template-5';
import LeadMagnetTemplate6 from './lead-magnet-template-6';
const LeadMagnetTemplates = [
    {
        id: 'blog-lead-magnet-1',
        name: 'Template 1',
        component: LeadMagnetTemplate1,
        image: '/images/lead-magnets/template-1-lead-magnet.png',
    },
    {
        id: 'blog-lead-magnet-2',
        name: 'Template 2',
        component: LeadMagnetTemplate2,
        image: '/images/lead-magnets/template-2-lead-magnet.png',
    },
    {
        id: 'blog-lead-magnet-3',
        name: 'Template 3',
        component: LeadMagnetTemplate3,
        image: '/images/lead-magnets/lead-magnet-template-3.png',
    },
    {
        id: 'blog-lead-magnet-4',
        name: 'Template 4',
        component: LeadMagnetTemplate4,
        image: '/images/lead-magnets/lead-magnet-template-4.png',
    },
    {
        id: 'blog-lead-magnet-5',
        name: 'Lead Form',
        component: LeadMagnetTemplate5,
        image: '/images/lead-magnets/lead-magnet-template-5.png',
        isLeadForm: true,
    },
    {
        id: 'blog-lead-magnet-6',
        name: 'Lead Form 2',
        component: LeadMagnetTemplate6,
        image: '/images/lead-magnets/lead-magnet-template-6.png',
        isLeadForm: true,
    },
];

export default LeadMagnetTemplates;
