'use client';

import { paddleApi } from '@/api/paddle.api';
import { useSendData } from '@/config/query.config';

export const usePaddleService = () => {
    const { mutate: handleBuyCredits } = useSendData({
        fn: paddleApi.handleBuyCredits,
        success: () => {},
        error: () => {},
    });

    return {
        handleBuyCredits,
    };
};
