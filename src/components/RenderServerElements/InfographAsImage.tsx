"use client";

import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { defaultColors } from './Infograph';

interface InfographData {
  infograph_id: string;
  blog_id: string;
  infograph_title: string;
  infograph_url: string | null;
  infograph_template_id: string;
  infograph_description: string;
  infograph_steps: Array<{
    step_number: number;
    step_content: string;
  }>;
  alt_text: string;
  infograph_type: string;
  created_at: string;
  updated_at: string;
  accepted: boolean;
}

interface InfographAsImageProps {
  infographData: InfographData | null;
  width?: number;
}

/**
 * InfographAsImage Component
 * Renders an infographic template as a static WebP image using html2canvas.
 * This is useful for SEO, performance, and ensuring consistent rendering across devices.
 */
const InfographAsImage = ({ infographData, width }: InfographAsImageProps) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(true);
  const [captureWidth, setCaptureWidth] = useState<number>(1200);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const data = (infographData as any)?.infograph || infographData;

  useEffect(() => {
    // Only capture if we have data and haven't captured yet
    if (containerRef.current && !imgSrc && data) {
      const captureImage = async () => {
        try {
          // Measure the actual visible container width so the template renders
          // responsively (single-column on mobile, multi-column on desktop).
          const visibleWidth = wrapperRef.current
            ? wrapperRef.current.offsetWidth
            : (width ?? window.innerWidth);
          setCaptureWidth(visibleWidth);

          // Give it a small timeout to ensure fonts and styles are loaded
          // and the off-screen div has re-rendered at the new width.
          await new Promise(resolve => setTimeout(resolve, 800));
          
          if (!containerRef.current) return;

          const canvas = await html2canvas(containerRef.current, {
            useCORS: true,
            scale: 2, // Double resolution for crispness
            backgroundColor: null,
            logging: false,
            allowTaint: true,
          });

          const webpData = canvas.toDataURL('image/webp', 0.95);
          setImgSrc(webpData);
          setIsCapturing(false);
        } catch (error) {
          console.error("Failed to capture infograph as image:", error);
          setIsCapturing(false);
        }
      };

      captureImage();
    }
  }, [data, imgSrc]);

  if (!data) return null;

  // If we have the captured image, render it
  if (imgSrc) {
    return (
      <div 
        className="mx-auto" 
        style={{ 
          maxWidth: '100%', 
          minWidth: '100px', 
          position: 'relative', 
          width: width ? `${width}px` : '100%' 
        }}
      >
        <figure className='group relative m-0 my-6' contentEditable={false}>
          <div className='relative w-full rounded-lg overflow-hidden cursor-pointer group'>
            <Image
              draggable="true"
              src={imgSrc}
              alt={data.alt_text || data.infograph_title || 'Infographic'}
              className="block w-full max-w-full object-cover px-0 rounded-sm"
              width={1200}
              height={800}
              unoptimized
              style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
            />
          </div>
        </figure>
      </div>
    );
  }

  // Use existing image URL if available
  if (data.infograph_url) {
    return (
      <div 
        className="mx-auto" 
        style={{ 
          maxWidth: '100%', 
          minWidth: '100px', 
          position: 'relative', 
          width: width ? `${width}px` : '100%' 
        }}
      >
        <figure className='group relative m-0 my-6' contentEditable={false}>
          <div className='relative w-full rounded-lg overflow-hidden cursor-pointer group'>
            <Image
              draggable="true"
              src={data.infograph_url}
              alt={data.alt_text || data.infograph_title || 'Infographic'}
              className="block w-full max-w-full object-cover px-0 rounded-sm"
              width={1200}
              height={800}
              unoptimized
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </figure>
      </div>
    );
  }

  // Render the template content for capturing (hidden or visible during capture)
  const templateId = data.infograph_template_id || 'blog-infograph-1';
  let templateContent = null;

  if (templateId === 'blog-infograph-1') {
    templateContent = (
      <div className='max-w-6xl mx-auto p-6 md:p-12 bg-[#F8F8F8] h-fit rounded-2xl'>
        <div className='text-center mb-12 md:mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-[#000000] mb-4 mt-0'>{data.infograph_title}</h2>
          <p className='text-[#5D5D5D] max-w-3xl mx-auto text-base md:text-lg'>
            {data.infograph_description}
          </p>
        </div>
        <div className='flex flex-row flex-wrap justify-center gap-x-[35px] gap-y-12 mb-8 relative'>
          {data.infograph_steps?.map((step: any, index: number) => {
            const stepColor = defaultColors[index % defaultColors.length];
            return (
              <div key={index} className='relative w-full md:w-[30%] min-h-[180px] p-2 py-4 flex rounded-tl-md items-start bg-[#FFFFFF] rounded-md shadow-sm border border-gray-100 '>
                <div className='absolute top-0 bottom-0 w-[4px] left-0' style={{ backgroundColor: stepColor }} />
                <div 
                  style={{
                    backgroundColor: stepColor,
                    marginTop: '-25px',
                    position: 'absolute',
                    top: '50%',
                    left: '-25px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: '4px solid white',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    lineHeight: 1,
                    display: 'block',
                  }}>
                    {index + 1}
                  </span>
                </div>
                <div className='flex-1 ml-[38px]'>
                  <div className='font-bold text-lg text-[#000000] mb-2'>Step {index + 1}</div>
                  <p className='text-[#5D5D5D] text-sm leading-relaxed m-0'>{step.step_content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else if (templateId === 'blog-infograph-2') {
    templateContent = (
      <div className='w-full mx-auto p-6 md:p-12 bg-[#FFFFFF] border border-gray-100 rounded-2xl'>
        <div className='text-center mb-12 md:mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-[#000000] mb-4 mt-0'>{data.infograph_title}</h2>
          <p className='text-[#5D5D5D] max-w-3xl mx-auto text-base md:text-lg'>
            {data.infograph_description}
          </p>
        </div>
        <div className='flex flex-wrap justify-center gap-x-6 gap-y-16 mb-8'>
          {data.infograph_steps?.map((step: any, index: number) => {
            const stepColor = defaultColors[index % defaultColors.length];
            return (
              <div key={index} className='relative w-full sm:w-[45%] md:w-[30%] lg:w-[18%] flex flex-col items-center'>
                <div style={{
                  top: '-40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  borderTop: `2px solid ${stepColor}`,
                  borderRight: `2px solid ${stepColor}`,
                  borderLeft: `2px solid ${stepColor}`,
                  borderBottom: 'none',
                  zIndex: 10,
                  position: 'absolute',
                }}>
                  {/* inner coloured circle */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: stepColor,
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  }}>
                    <span style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '20px',
                      lineHeight: 1,
                      display: 'block',
                    }}>
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className='bg-[#FFFFFF] p-5 pt-10 flex-1 rounded-xl shadow-sm w-full text-center border-[3px]' style={{ borderColor: stepColor }}>
                  <h3 className='font-bold text-base text-[#000000] mb-2'>Step {index + 1}</h3>
                  <p className='text-[#5D5D5D] text-xs leading-relaxed m-0'>{step.step_content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    // Fallback layout
    templateContent = (
      <div className="p-8 w-full bg-white flex flex-col items-center text-center">
        <span className="inline-block px-3 py-1 bg-[#5371FF]/10 text-[#5371FF] text-xs font-bold rounded-full mb-4 uppercase tracking-wider">Infograph</span>
        <h3 className="text-2xl font-bold text-gray-900 mt-0 mb-3">{data.infograph_title}</h3>
        <p className="text-gray-600 mb-8 leading-relaxed max-w-2xl">{data.infograph_description}</p>
        <div className="space-y-6 w-full max-w-lg text-left">
          {data.infograph_steps?.map((step: any, index: number) => (
            <div key={index} className="flex items-center group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#5371FF] text-white font-bold text-sm shadow shrink-0 z-10 leading-none">
                {index + 1}
              </div>
              <div className="ml-6 flex-grow p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="text-slate-600 leading-relaxed">{step.step_content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative overflow-hidden w-full">
      {/* Off-screen container for capturing — rendered at the measured visible
          width so the template's responsive breakpoints apply correctly on
          mobile (single-column) vs desktop (multi-column). */}
      <div 
        ref={containerRef} 
        style={{ 
          position: 'absolute', 
          left: '-5000px', 
          top: 0, 
          // Use the measured container width so the template renders at the
          // same width it will actually be displayed, giving the correct
          // responsive layout (no giant desktop image on a narrow screen).
          width: `${captureWidth}px`,
          visibility: 'visible',
          background: '#FFFFFF'
        }}
      >
        {templateContent}
      </div>

      {/* Loading Placeholder */}
      {isCapturing && (
        <div className="w-full h-64 bg-gray-50 flex flex-col items-center justify-center rounded-lg border border-gray-100 animate-pulse">
           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
           <p className="text-sm text-gray-400 font-medium">Preparing Infographic...</p>
        </div>
      )}
    </div>
  );
};

export default InfographAsImage;
