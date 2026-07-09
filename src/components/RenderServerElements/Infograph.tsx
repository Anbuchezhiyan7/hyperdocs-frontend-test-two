import NextImage from 'next/image';
import { optimizeCloudinaryImage } from '@/utils/cloudinary';

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

interface InfographProps {
  infographData: InfographData | null;
  visualMode?: boolean;
  width?: number;
}

export const defaultColors = [
  '#FF5758', // Red
  '#FF924D', // Orange
  '#FDBD5A', // Yellow
  '#7EDA58', // Green
  '#5371FF', // Blue
];

const Infograph = ({ infographData, visualMode = false, width }: InfographProps) => {
  // Try to unwrap if nested
  const data = (infographData as any)?.infograph || infographData;

  // If no data at all, return null
  if (!data) return null;

  // Validation: If it's a template, it MUST have title and description
  // If it's an image, it MUST have a URL
  const isImage = data.infograph_type === 'image' || !!data.infograph_url;
  const isTemplate = data.infograph_type === 'template';

  if (isTemplate && (!data.infograph_title || !data.infograph_description)) return null;
  if (isImage && !data.infograph_url) return null;
  if (!isTemplate && !isImage) return null;

  if (visualMode) {
    const hasSteps = data.infograph_steps && data.infograph_steps.length > 0;
    const imgWidth = width || 800;

    let content: React.ReactNode = null;

    // 1. Template-based rendering
    if (data.infograph_type === 'template') {
      const templateId = data.infograph_template_id || 'blog-infograph-1';

      if (templateId === 'blog-infograph-1') {
        content = (
          <div className='max-w-6xl mx-auto p-6 md:p-12 bg-[#F8F8F8] h-fit rounded-2xl'>
            {/* Header Section */}
            <div className='text-center mb-12 md:mb-16'>
              <h2 className='text-3xl md:text-4xl font-bold text-[#000000] mb-4 mt-0'>{data.infograph_title}</h2>
              <p className='text-[#5D5D5D] max-w-3xl mx-auto text-base md:text-lg'>
                {data.infograph_description}
              </p>
            </div>

            {/* Steps Grid */}
            <div className='flex flex-row flex-wrap justify-center gap-x-[35px] gap-y-12 mb-8 relative'>
              {data.infograph_steps.map((step: any, index: number) => {
                const stepColor = defaultColors[index % defaultColors.length];

                return (
                  <div
                    key={index}
                    className='relative w-full md:w-[30%] min-h-[180px] p-2 py-4 flex rounded-tl-md items-start bg-[#FFFFFF] rounded-md shadow-sm border border-gray-100 '
                  >
                    <div
                      className='absolute top-0 bottom-0 w-[4px] left-0'
                      style={{ backgroundColor: stepColor }}
                    />
                    <div
                      className='text-xl absolute top-[38%] left-[-23px] flex items-center justify-center w-[50px] h-[50px] rounded-full text-white font-bold text-center border-4 border-white shadow-sm'
                      style={{ backgroundColor: stepColor }}
                    >
                      <span className='text-xl'>{index + 1}</span>
                    </div>

                    <div className='flex-1 ml-[38px]'>
                      <div className='font-bold text-lg text-[#000000] mb-2'>
                        Step {index + 1}
                      </div>
                      <p className='text-[#5D5D5D] text-sm leading-relaxed m-0'>
                        {step.step_content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      } else if (templateId === 'blog-infograph-2') {
        content = (
          <div className='w-full mx-auto p-6 md:p-12 bg-[#FFFFFF] border border-gray-100 rounded-2xl'>
            <div className='text-center mb-12 md:mb-16'>
              <h2 className='text-3xl md:text-4xl font-bold text-[#000000] mb-4 mt-0'>{data.infograph_title}</h2>
              <p className='text-[#5D5D5D] max-w-3xl mx-auto text-base md:text-lg'>
                {data.infograph_description}
              </p>
            </div>
            {/* Steps Container */}
            <div className='flex flex-wrap justify-center gap-x-6 gap-y-16 mb-8'>
              {data.infograph_steps.map((step: any, index: number) => {
                const stepColor = defaultColors[index % defaultColors.length];
                return (
                  <div
                    key={index}
                    className='relative w-full sm:w-[45%] md:w-[30%] lg:w-[18%] flex flex-col items-center'
                  >
                    {/* Step Circle - Positioned above the card */}
                    <div
                      className='absolute -top-10 w-16 h-16 border-t-2 border-r-2 border-l-2 !border-b-0 rounded-full bg-[#FFFFFF] flex items-center justify-center z-10'
                      style={{ borderColor: stepColor }}
                    >
                      <div
                        style={{ backgroundColor: stepColor }}
                        className='text-white flex items-center justify-center rounded-full w-12 h-12 font-bold text-xl shadow-sm'
                      >
                         {index + 1}
                      </div>
                    </div>
                    {/* Step Content Card */}
                    <div
                      className='bg-[#FFFFFF] p-5 pt-10 flex-1 rounded-xl shadow-sm w-full text-center border-[3px]'
                      style={{ borderColor: stepColor }}
                    >
                      <h3 className='font-bold text-base text-[#000000] mb-2'>
                        Step {index + 1}
                      </h3>
                      <p className='text-[#5D5D5D] text-xs leading-relaxed m-0'>
                        {step.step_content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
    }

    // 2. Image-style rendering 
    if (!content && data.infograph_url) {
      content = (
        <NextImage
          draggable="true"
          className="block w-full max-w-full object-cover px-0 rounded-sm"
          alt={data.alt_text || ''}
          width={1200}
          height={800}
          unoptimized
          sizes="(max-width: 768px) 100vw, 800px"
          style={{ width: '100%', height: 'auto' }}
          src={optimizeCloudinaryImage(data.infograph_url, 1000)}
        />
      );
    }

    // 3. Last fallback (column layout from before)
    if (!content && hasSteps) {
        content = (
            <div className="p-8 w-full bg-white flex flex-col items-center text-center">
                <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-xs font-bold rounded-full mb-4 uppercase tracking-wider">Infograph</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-0 mb-3">{data.infograph_title}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed max-w-2xl">{data.infograph_description}</p>
                <div className="space-y-6 w-full max-w-lg text-left">
                {data.infograph_steps.map((step: any, index: number) => (
                    <div key={index} className="flex items-center group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-brand text-white font-bold text-sm shadow shrink-0 z-10">
                        {index + 1}
                    </div>
                    <div className="ml-6 flex-grow p-4 rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md hover:border-brand/20">
                        <div className="text-slate-600 leading-relaxed">{step.step_content}</div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        );
    }

    if (!content) return null;

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
                {content}
            </div>
        </figure>
      </div>
    );
  }

  return (
    <div className="infograph-container" itemScope itemType="https://schema.org/HowTo">
      <div className='text-2xl font-bold' itemProp="name">{data.infograph_title}</div>
      <p itemProp="description">{data.infograph_description}</p>
      {data.infograph_steps && data.infograph_steps.length > 0 && (
        <ol className="infograph-steps">
          {data.infograph_steps.map((step: any, index: number) => {
            // Add null checks for step and its properties
            if (!step || typeof step.step_number !== 'number' || !step.step_content) return null;
            
            return (
              <li key={index} className="infograph-step" itemScope itemType="https://schema.org/HowToStep">
                <strong itemProp="name">Step {step.step_number}:</strong> 
                <span itemProp="text">{step.step_content}</span>
              </li>
            );
          })}
        </ol>
      )}
      {data.infograph_url && (
        <img
          src={optimizeCloudinaryImage(data.infograph_url)}
          alt={data.alt_text || 'Infograph image'}
          className="infograph-image"
          itemProp="image"
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

export default Infograph;
