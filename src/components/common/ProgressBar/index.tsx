import React from 'react';
import { Progress } from 'antd';
import { cn } from '@/utils/cn';

const getColorByPercent = (percent: number) => {
  if (percent < 65) return '#ff4d4f';
  if (percent < 85) return '#faad14';
  return '#52c41a';
};

const ProgressBar = ({ percent }: { percent: number }) => {
  const infoClass = percent === 0 ? 'text-red-600 font-bold' : 'text-black font-bold';

  return (
    <Progress
      percent={percent}
      strokeColor={getColorByPercent(percent)}
      strokeWidth={16}
      format={(percent) => (
        <span className={cn(infoClass)}>{percent}%</span>
      )}
      className="w-full"
    />
  );
};

export default ProgressBar;
