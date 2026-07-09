import { createPlatePlugin } from '@udecode/plate/react';
import { FAQElement } from './index';

export const FAQ_ELEMENT = 'faq';

export const faqPlugin = createPlatePlugin({
    key: FAQ_ELEMENT,
    node: {
        component: FAQElement,
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
