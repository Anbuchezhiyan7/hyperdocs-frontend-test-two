import React, { useState } from 'react';
import { Card, Radio, Button, Progress, Space, Typography, Divider } from 'antd';
import { PollSkeleton } from '@/components/common/Skeletons';
import usePollService from '@/services/poll.service';

const { Title, Text } = Typography;

interface PollDisplayProps {
    poll: Poll;
    className?: string;
    handleEdit: () => void;
    isLoading: boolean;
    isPreview?: boolean;
}

export const PollDisplay: React.FC<PollDisplayProps> = ({
    poll: initialPoll,
    className,
    handleEdit,
    isLoading,
    isPreview,
}) => {
    const [currentPoll, setCurrentPoll] = useState<Poll>(initialPoll);
    const [selectedOption, setSelectedOption] = useState<string>();
    const [hasVoted, setHasVoted] = useState(false);
    const { handleVote, isLoading: isVoting } = usePollService();

    React.useEffect(() => {
        setCurrentPoll(initialPoll);
    }, [initialPoll]);

    const handleVoteClick = () => {
        if (!selectedOption) return;
        const optionIdToVote = selectedOption;

        handleVote(
            { pollId: currentPoll.poll_id, optionId: optionIdToVote },
            {
                onSuccess: (data: any) => {
                    setHasVoted(true);
                    if (data && data.poll_options) {
                        setCurrentPoll(data);
                    }
                },
                onError: (error: any) => {
                    console.error('Failed to vote:', error);
                }
            }
        );
    };

    const renderOption = (option: PollOption) => {
        const optionVotes = option.option_votes;
        const totalVotes =
            (currentPoll?.poll_options || []).reduce(
                (acc, curr) => acc + curr.option_votes,
                0
            ) || 1;
        const percentage = (optionVotes / totalVotes) * 100;

        if (hasVoted) {
            return (
                <div key={option.option_id} className='mb-3'>
                    <Space direction='vertical' style={{ width: '100%' }}>
                        <Space align='center' style={{ width: '100%' }}>
                            <Text>{option?.option_title}</Text>
                            <Text hidden={!currentPoll?.show_results_after_voting} type='secondary'>
                                ({optionVotes} votes)
                            </Text>
                        </Space>
                        <Progress
                            percent={Math.round(percentage)}
                            size='small'
                            showInfo={false}
                            status='active'
                            strokeColor={
                                option.option_id === selectedOption ? 'var(--primary)' : '#f0f0f0'
                            }
                        />
                    </Space>
                </div>
            );
        }

        return (
            <Radio
                key={option.option_id}
                value={option.option_id}
                style={{ width: '100%', marginBottom: '8px' }}
                disabled={hasVoted}
                checked={selectedOption === option.option_id}
                onChange={e => setSelectedOption(option.option_id)}
            >
                <Space>
                    <span>{option.option_title}</span>
                </Space>
            </Radio>
        );
    };

    return (
        <div onClick={handleEdit}>
            {isLoading ? (
                <PollSkeleton />
            ) : (
                <Card className={className} variant="borderless" style={{ background: '#fafafa' }}>
                    <div className='text-base font-semibold mb-1' >
                        {currentPoll?.poll_title}
                    </div>
                    {currentPoll?.poll_description && <Text>{currentPoll?.poll_description}</Text>}
                    {currentPoll?.poll_question && (
                        <>
                            <Divider style={{ margin: '12px 0' }} />
                            <p className='text-gray-800'>{currentPoll?.poll_question}</p>
                        </>
                    )}
                    <div className='mt-4'>
                        {hasVoted || currentPoll?.show_results_after_voting ? (
                            <div className='space-y-2'>
                                {(currentPoll?.poll_options || []).map(renderOption)}
                                {/* <Text type='secondary' className='block mt-4'>
                            Total votes: {pol}
                        </Text> */}
                            </div>
                        ) : (
                            <Radio.Group
                                onChange={e => setSelectedOption(e.target.value)}
                                value={selectedOption}
                                style={{ width: '100%' }}
                            >
                                <Space direction='vertical' style={{ width: '100%' }}>
                                    {(currentPoll?.poll_options || []).map(renderOption)}
                                </Space>
                            </Radio.Group>
                        )}

                        {!hasVoted && !isPreview && (
                            <Button
                                type='primary'
                                onClick={handleVoteClick}
                                disabled={!selectedOption}
                                className='mt-4'
                                block
                                loading={isVoting}
                            >
                                Vote
                            </Button>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};
