'use client';

import React from 'react';
import PublicPoll from './PublicPoll';

interface PollOption {
  option_id: string;
  option_title: string;
  option_votes: number;
}

interface PollData {
  poll_id: string;
  blog_id: string;
  poll_title: string | null;
  poll_description: string | null;
  poll_question: string;
  show_results_after_voting: boolean | null;
  poll_options: PollOption[];
  created_at: string;
  updated_at: string;
  accepted: boolean;
  total_voters: number;
}

interface PollsProps {
  pollData: PollData | null;
  visualMode?: boolean;
}

const Polls = ({ pollData, visualMode = false }: PollsProps) => {
  if (!pollData) return null;
  
  // Try to unwrap if nested
  const actualPollData = (pollData as any).poll || pollData;
  const actualOptions = actualPollData.poll_options || (actualPollData as any).options;

  const pd = actualPollData;
  const options = actualOptions || [];
  const questionText = pd.poll_question || pd.poll_title;

  if (!questionText || options.length === 0) {
    return <div className="text-red-500 p-4 border border-red-200">Poll data missing question/title or options. Received: {JSON.stringify(pollData)}</div>;
  }

  if (visualMode) {
    return (
      <div className="my-8 max-w-2xl">
        <PublicPoll poll={pd as any} isLoading={false} />
      </div>
    );
  }

  return (
    <div className='poll-container'>
      <div className='text-2xl font-bold'>Poll</div>
      <p><strong>Question:</strong> {questionText}</p>
      {pd.poll_description && <p>{pd.poll_description}</p>}
      <div>
       <div className='text-lg font-bold'>Options:</div>
        <ul>
          {options.map((option: any, optionIndex: number) => {
            // Add null checks for option and its properties
            if (!option || !option.option_title) return null;
            
            return (
              <li key={optionIndex}>{option.option_title}</li>
            );
          })}
        </ul>
      </div>
      <p>Total voters: {pd.total_voters || 0}</p>
    </div>
  );
};

export default Polls;
