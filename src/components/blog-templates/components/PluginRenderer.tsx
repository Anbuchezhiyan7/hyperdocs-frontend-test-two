'use client';

import React, { Suspense, lazy, memo, useMemo } from 'react';
import { BannerSkeleton } from '@/components/common/Skeletons';

// Lazy load all plugin components to reduce initial bundle size
const LazyBannerComponent = lazy(() => import('@/components/editor/Banner/BannerComponent'));
const LazyPollComponent = lazy(() => import('@/components/editor/Poll/PollComponent'));
const LazyFAQComponent = lazy(() => import('@/components/editor/FAQ/FAQComponent'));
const LazyInfographComponent = lazy(() => import('@/components/editor/Infograph/InfographComponent'));
const LazyLeadMagnetComponent = lazy(() => import('@/components/editor/LeadMagnet/LeatMagnetComponent'));

// Loading skeleton for each plugin type
const PluginSkeleton = ({ type }: { type: string }) => {
  const skeletonHeight = useMemo(() => {
    switch (type) {
      case 'banner': return 'h-64';
      case 'poll': return 'h-32';
      case 'faq': return 'h-24';
      case 'infograph': return 'h-48';
      case 'lead-magnet': return 'h-40';
      default: return 'h-32';
    }
  }, [type]);

  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${skeletonHeight} w-full`}>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
};

interface PluginRendererProps {
  element: any;
  isPreview?: boolean;
  readOnly?: boolean;
  loading?: boolean;
}

// Memoized plugin component mapping
const PluginRenderer: React.FC<PluginRendererProps> = memo(({ 
  element, 
  isPreview = false, 
  readOnly = true, 
  loading = false 
}) => {
  // Determine plugin type from element
  const pluginType = useMemo(() => {
    if (element?.type === 'banner') return 'banner';
    if (element?.type === 'poll') return 'poll';
    if (element?.type === 'faq') return 'faq';
    if (element?.type === 'infograph') return 'infograph';
    if (element?.type === 'lead-magnet') return 'lead-magnet';
    return 'unknown';
  }, [element?.type]);

  // Get plugin data based on type
  const pluginData = useMemo(() => {
    switch (pluginType) {
      case 'banner':
        return {
          banner: element?.banner || element?.plugin_data,
          onDelete: element?.onDelete
        };
      case 'poll':
        return {
          poll: element?.poll || element?.plugin_data,
          onDelete: element?.onDelete
        };
      case 'faq':
        return {
          faq: element?.faq || element?.plugin_data,
          onDelete: element?.onDelete
        };
      case 'infograph':
        return {
          infograph: element?.infograph || element?.plugin_data,
          onDelete: element?.onDelete
        };
      case 'lead-magnet':
        return {
          leadMagnet: element?.leadMagnet || element?.plugin_data,
          onDelete: element?.onDelete
        };
      default:
        return {};
    }
  }, [element, pluginType]);

  // Render appropriate plugin component
  const renderPlugin = () => {
    if (loading) {
      return <PluginSkeleton type={pluginType} />;
    }

    const commonProps = {
      element,
      isPreview,
      readOnly,
      loading,
      ...pluginData
    };

    switch (pluginType) {
      case 'banner':
        return <LazyBannerComponent {...commonProps} />;
      case 'poll':
        return <LazyPollComponent {...commonProps} />;
      case 'faq':
        return <LazyFAQComponent {...commonProps} />;
      case 'infograph':
        return <LazyInfographComponent {...commonProps} />;
      case 'lead-magnet':
        return <LazyLeadMagnetComponent {...commonProps} />;
      default:
        return <div>Unknown plugin type: {pluginType}</div>;
    }
  };

  return (
    <Suspense fallback={<PluginSkeleton type={pluginType} />}>
      {renderPlugin()}
    </Suspense>
  );
});

PluginRenderer.displayName = 'PluginRenderer';

export default PluginRenderer;
