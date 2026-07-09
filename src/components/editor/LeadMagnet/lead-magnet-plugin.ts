import { createPlatePlugin } from '@udecode/plate/react';
import LeadMagnetElement from '.';

export const leadMagnetPlugin = createPlatePlugin({
    key: 'lead_magnet',
    node: {
        component: LeadMagnetElement,
        isElement: true,
        props: {
            draggable: true,
        },
    },
});
