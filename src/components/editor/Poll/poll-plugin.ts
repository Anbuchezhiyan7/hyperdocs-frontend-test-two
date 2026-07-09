import { createPlatePlugin } from '@udecode/plate/react';
import { PollElement } from '.';

export const POLL_ELEMENT_TYPE = 'poll';

export const pollPlugin = createPlatePlugin({
    key: POLL_ELEMENT_TYPE,
    node: {
        component: PollElement,
        isElement: true,
        // isVoid: false,
    },
    handlers: {
        onKeyDown: ({ editor, event }) => {
            if (event.key === 'Backspace' && event.target instanceof HTMLInputElement) {
                event.stopPropagation();
                return false; // Let the input handle the backspace
            }
            return true;
        },
    },
});
