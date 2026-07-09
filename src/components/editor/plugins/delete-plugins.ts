'use client';

import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import {
    AudioPlugin,
    FilePlugin,
    ImagePlugin,
    MediaEmbedPlugin,
    VideoPlugin,
} from '@udecode/plate-media/react';
import { DeletePlugin, SelectOnBackspacePlugin } from '@udecode/plate-select';
import { bannerPlugin } from '../Banner/banner-plugin';
import { pollPlugin } from '../Poll/poll-plugin';
import { infographPlugin } from '../Infograph/infograph-plugin';
import { leadMagnetPlugin } from '../LeadMagnet/lead-magnet-plugin';

export const deletePlugins = [
    SelectOnBackspacePlugin.configure({
        options: {
            query: {
                allow: [
                    ImagePlugin.key,
                    VideoPlugin.key,
                    AudioPlugin.key,
                    FilePlugin.key,
                    MediaEmbedPlugin.key,
                    HorizontalRulePlugin.key,
                    bannerPlugin.key,
                    pollPlugin.key,
                    infographPlugin.key,
                    leadMagnetPlugin.key,
                ],
            },
        },
    }),
    DeletePlugin,
] as const;
