"use client"
import React from 'react';

interface FaqData {
  faq_id: string;
  blog_id: string;
  faq_data: Array<{
    question: string;
    answer: string;
  }>;
  created_at: string;
  updated_at: string;
}

interface FaqProps {
  faqData: FaqData | null;
  visualMode?: boolean;
}

const Faq = ({ faqData, visualMode = false }: FaqProps) => {
  if (!faqData || !faqData.faq_data || faqData.faq_data.length === 0) return null;

  if (visualMode) {
    return (
      <div className="my-8 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold m-0 text-gray-800 tracking-tight">Frequently Asked Questions</h3>
        </div>
        <div className="p-1">
          {faqData.faq_data.map((faqItem, idx) => (
            <details
              key={idx}
              className="border-b border-gray-50 last:border-none px-2 group"
              style={{ background: 'white' }}
            >
              <summary className="flex items-center justify-between cursor-pointer py-3 list-none font-semibold text-[1.05rem] text-gray-800 leading-snug select-none">
                {faqItem?.question}
                <svg
                  className="transition-transform duration-200 group-open:rotate-180 shrink-0 ml-2"
                  fill="none" height="18" shapeRendering="geometricPrecision"
                  stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth="2" viewBox="0 0 24 24" width="18"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="text-gray-600 prose prose-sm max-w-none pb-2 pl-1">
                <p>{faqItem?.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='faq-container' itemScope itemType="https://schema.org/FAQPage">
      <div className='text-2xl font-bold'>Frequently Asked Questions</div>
      {faqData.faq_data.map((faq, faqIndex) => {
        if (!faq || !faq.question || !faq.answer) return null;
        
        return (
          <div key={faqIndex} itemScope itemType="https://schema.org/Question">
            <div className='text-lg font-bold' itemProp="name">{faq.question}</div>
            <div itemScope itemType="https://schema.org/Answer">
              <p itemProp="text">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Faq;

