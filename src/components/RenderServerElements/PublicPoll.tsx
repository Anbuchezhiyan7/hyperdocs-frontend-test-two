'use client';

/**
 * PUBLIC-ONLY poll renderer — plain TSX + Tailwind, NO antd.
 *
 * Replaces editor/Poll/PollDisplay on the public blog page so that antd
 * (Card/Radio/Progress/...) never enters the public JS bundle. Preserves the
 * same voting behaviour via usePollService.
 */

import React, { useEffect, useState } from 'react';
import { PollSkeleton } from '@/components/common/Skeletons';
import usePollService from '@/services/poll.service';

interface PublicPollProps {
    poll: Poll;
    className?: string;
    isLoading?: boolean;
    isPreview?: boolean;
}

const PublicPoll: React.FC<PublicPollProps> = ({ poll: initialPoll, className, isLoading, isPreview }) => {
    const [currentPoll, setCurrentPoll] = useState<Poll>(initialPoll);
    const [selectedOption, setSelectedOption] = useState<string>();
    const [hasVoted, setHasVoted] = useState(false);
    const { handleVote, isLoading: isVoting } = usePollService();

    useEffect(() => {
        setCurrentPoll(initialPoll);
    }, [initialPoll]);

    const handleVoteClick = () => {
        if (!selectedOption) return;
        handleVote(
            { pollId: currentPoll.poll_id, optionId: selectedOption },
            {
                onSuccess: (data: any) => {
                    setHasVoted(true);
                    if (data && data.poll_options) setCurrentPoll(data);
                },
                onError: (error: any) => {
                    console.error('Failed to vote:', error);
                },
            }
        );
    };

    const totalVotes =
        (currentPoll?.poll_options || []).reduce((acc, curr) => acc + curr.option_votes, 0) || 1;

    const showResults = hasVoted || currentPoll?.show_results_after_voting;

    if (isLoading) return <PollSkeleton />;

    return (
        <div
            className={`rounded-lg border border-gray-100 bg-[#fafafa] p-5 ${className || ''}`}
        >
            <div className="mb-1 text-base font-semibold text-gray-900">{currentPoll?.poll_title}</div>
            {currentPoll?.poll_description && (
                <p className="text-sm text-gray-600">{currentPoll?.poll_description}</p>
            )}
            {currentPoll?.poll_question && (
                <>
                    <hr className="my-3 border-gray-200" />
                    <p className="text-gray-800">{currentPoll?.poll_question}</p>
                </>
            )}

            <div className="mt-4 space-y-3">
                {(currentPoll?.poll_options || []).map(option => {
                    const percentage = Math.round((option.option_votes / totalVotes) * 100);
                    const isSelected = selectedOption === option.option_id;

                    if (showResults) {
                        return (
                            <div key={option.option_id}>
                                <div className="mb-1 flex items-center gap-2 text-sm">
                                    <span className="text-gray-800">{option?.option_title}</span>
                                    {currentPoll?.show_results_after_voting && (
                                        <span className="text-gray-400">({option.option_votes} votes)</span>
                                    )}
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: isSelected ? 'var(--primary)' : '#d1d5db',
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    }

                    return (
                        <label
                            key={option.option_id}
                            className="flex cursor-pointer items-center gap-2 text-gray-800"
                        >
                            <input
                                type="radio"
                                name={`poll-${currentPoll.poll_id}`}
                                value={option.option_id}
                                checked={isSelected}
                                onChange={() => setSelectedOption(option.option_id)}
                                className="h-4 w-4 accent-[color:var(--primary)]"
                            />
                            <span>{option.option_title}</span>
                        </label>
                    );
                })}

                {!hasVoted && !isPreview && (
                    <button
                        type="button"
                        onClick={handleVoteClick}
                        disabled={!selectedOption || isVoting}
                        className="mt-2 w-full rounded-md bg-[color:var(--primary)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isVoting ? 'Voting…' : 'Vote'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PublicPoll;
