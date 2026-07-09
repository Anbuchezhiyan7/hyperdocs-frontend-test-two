import React from 'react';
import { optimizeCloudinaryImage } from '@/utils/cloudinary';

interface MediaEmbedData {
  url: string;
  caption?: Array<{
    text: string;
  }>;
  children?: Array<{
    text: string;
  }>;
  id: string;
  type?: string;
  width?: number;
}

interface MediaEmbedProps {
  block: MediaEmbedData;
  index: number;
}

const getYoutubeVideoId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const isVideoUrl = (url: string) => {
  if (!url) return false;
  return url.match(/\.(mp4|webm|ogg)$/i) != null;
};

const MediaEmbed = ({ block, index }: MediaEmbedProps) => {
  // Add null checks for block and its properties
  if (!block || !block.url || !block.id) return null;

  const captionArray = block.caption || block.children;
  const captionText = captionArray && Array.isArray(captionArray) 
    ? captionArray
        .map(c => c && c.text ? c.text : '')
        .filter(text => text !== '')
        .join('') 
    : '';

  const youtubeId = getYoutubeVideoId(block.url);
  const isVideo = isVideoUrl(block.url);

  return (
    <div 
      className="media-embed-container my-6"
      itemScope 
      itemType="https://schema.org/MediaObject"
    >
      <div 
        className="media-content mb-4 mx-auto relative"
        style={{ width: block.width ? `${block.width}px` : '100%', maxWidth: '100%', minWidth: '100px' }}
      >
        {youtubeId ? (
          <div className="relative w-full rounded-md shadow-sm overflow-hidden" style={{ paddingTop: '56.25%' }}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={captionText || 'Embedded youtube video'}
            />
          </div>
        ) : isVideo ? (
          <video 
            src={block.url}
            controls
            className="w-full rounded-md shadow-sm"
          />
        ) : (
          <img
            src={optimizeCloudinaryImage(block.url)}
            alt={captionText || 'Embedded media'}
            className="w-full rounded-md shadow-sm"
            itemProp="contentUrl"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      
      {captionText && (
        <div className="caption text-center">
          <p 
            className="text-sm text-gray-600 italic"
            itemProp="description"
          >
            {captionText}
          </p>
        </div>
      )}
      
      {/* <div className="media-details mt-3">
        <p className="text-xs text-gray-500">
          <strong>Media ID:</strong> {block.id}
        </p>
        <p className="text-xs text-gray-500">
          <strong>Source URL:</strong> <span className="break-all">{block.url}</span>
        </p>
      </div> */}
    </div>
  );
};

export default MediaEmbed;
