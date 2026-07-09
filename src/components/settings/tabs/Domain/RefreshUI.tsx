'use client';
import React, { useState } from 'react';
import { Button } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import Loader from '@/components/common/Loader';

const RefreshUI = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const handleRefresh = () => {
        setLoading(true);
        queryClient.invalidateQueries({ queryKey: ['settings'] }).then((res) => {
            setLoading(false);
        });
    };

    return (
        <div className="h-[76vh] flex flex-col justify-center gap-4 items-center  pb-4">
            {loading && <Loader />}
            <div className="mt-4  flex flex-col justify-center gap-4 items-center  pb-4">
                <p className="text-[24px] font-[600] text-[#000]">Setting Up Your Subdomain...</p>
                <p className=" text-primary bg-[#ffeee5] font-[600] text-sm text-center">
                    <span className="animate-pulse">⏳</span> Hang tight! DNS changes can take a few
                    minutes to reflect.
                </p>
                <p className="text-muted-foreground font-[500] text-[14px] text-center">
                    Your subdomain is being configured and may take 5-10 minutes to verify. Once
                    ready, click the button below to check the connection.
                </p>
                <Button type="primary" onClick={handleRefresh} loading={loading}>
                    Refresh
                </Button>
            </div>
        </div>
    );
};

export default RefreshUI;
