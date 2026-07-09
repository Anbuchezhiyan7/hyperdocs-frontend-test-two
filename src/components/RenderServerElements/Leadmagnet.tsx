"use client";

import React from 'react';
import PublicLeadMagnetView from './PublicLeadMagnetView';

interface LeadMagnetData {
  lead_magnet_id: string;
  blog_id: string;
  template_type: string;
  lead_magnet_template_id: string | null;
  details: {
    pdf_url: string | null;
    image_url: string | null;
    title: string;
    description: string;
    cta_placement: string;
    cta_button: string;
    details_required: string[];
    lead_magnet_template_id: string;
    placeholder_text?: string;
    bg_color?: string;
    button_color?: string;
  };
  created_at: string;
  updated_at: string;
}

interface LeadMagnetProps {
  leadMagnetData: LeadMagnetData[];
  visualMode?: boolean;
}

const LeadMagnet= ({ leadMagnetData, visualMode = false }: LeadMagnetProps) => {
  if (!leadMagnetData || leadMagnetData.length === 0) return null;

  if (visualMode) {
    return (
      <div className="my-2 w-full">
        {leadMagnetData.map((leadMagnet, lmIndex) => {
          if (!leadMagnet || !leadMagnet.details) return null;
          
          return (
            <div key={lmIndex} className="">
              <PublicLeadMagnetView
                readOnly={true}
                leadMagnet={leadMagnet}
              />
            </div>
          );
        })}
      </div>
    );
  }

  // Schema mode (SEO) - stay static
  return (
    <div className='lead-magnet-container'>
      <div className='text-2xl font-bold'>Lead Magnet</div>
      {leadMagnetData.map((leadMagnet, lmIndex) => {
        if (!leadMagnet || !leadMagnet.details) return null;
        const { details } = leadMagnet;
        return (
          <div key={lmIndex} itemScope itemType="https://schema.org/CreativeWork">
            <div className='text-lg font-bold' itemProp="name">{details.title}</div>
            <p itemProp="description"><strong>Description:</strong> {details.description}</p>
            {details.pdf_url && <meta itemProp="url" content={details.pdf_url} />}
            {details.image_url && <meta itemProp="image" content={details.image_url} />}
          </div>
        );
      })}
    </div>
  );
};

export default LeadMagnet;
