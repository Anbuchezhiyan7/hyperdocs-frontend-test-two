import React from 'react';

interface StatusConnectedProps {
    connected?: boolean | null;
}

const StatusConnected: React.FC<StatusConnectedProps> = ({ connected = false }) => {
    return (
        <div
            className={`px-4 py-1 rounded-[4px] text-xs font-semibold ${
                connected ? 'bg-[#E6F9EB] text-[#28A745]' : 'bg-[#FFF5D6] text-[#A37A00]'
            }`}
        >
            STATUS : {connected ? 'CONNECTED' : 'NOT CONNECTED'}
        </div>
    );
};

export default StatusConnected;
