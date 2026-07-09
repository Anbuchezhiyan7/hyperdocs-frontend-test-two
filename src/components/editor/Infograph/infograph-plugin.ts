import { createPlatePlugin } from '@udecode/plate/react';
import { InfographElement } from '.';

export const infographPlugin = createPlatePlugin({
    key: 'infograph',
    node: {
        component: InfographElement,
        isElement: true,
        props: {
            draggable: true,
        },
    },
});
