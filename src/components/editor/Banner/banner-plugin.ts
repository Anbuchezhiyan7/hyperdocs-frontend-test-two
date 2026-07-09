import { createPlatePlugin } from '@udecode/plate/react';
import { BannerElement } from '.';

export const bannerPlugin = createPlatePlugin({
    key: 'banner',
    node: {
        component: BannerElement,
        isElement: true,
    },
});
