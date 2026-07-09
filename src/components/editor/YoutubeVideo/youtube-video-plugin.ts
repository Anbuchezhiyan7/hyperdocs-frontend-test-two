import { createPlatePlugin } from '@udecode/plate/react';
import { YoutubeVideoElement } from '@/components/editor/YoutubeVideo/index';

export const YOUTUBE_VIDEO_ELEMENT = 'youtube_video';

export const youtubeVideoPlugin = createPlatePlugin({
    key: YOUTUBE_VIDEO_ELEMENT,
    node: {
        component: YoutubeVideoElement,
        isElement: true,
        isVoid: true,
    },
});
