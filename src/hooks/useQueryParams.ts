"use client";

import { useSearchParams } from 'next/navigation';

export const useQueryParams = () => {
  const searchParams = useSearchParams();
  
  const settingType = searchParams.get('type') || 'general';
  
  const setSettingType = (type: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('type', type);
    window.history.replaceState({}, '', url);
  };

  return { settingType, setSettingType };
}; 