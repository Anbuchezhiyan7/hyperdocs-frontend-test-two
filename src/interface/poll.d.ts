interface PollOption {
    option_id?: string;
    option_title: string;
    option_votes: number;
}

interface Poll {
    blog_id: string;
    poll_id: string;
    poll_title: string;
    poll_description: string;
    poll_question: string;
    poll_options: PollOption[];
    show_results_after_voting: boolean;
    total_voters: number;
}

interface PollElementAttributes {
    poll: Poll;
    isEditing?: boolean;
}

type PollVoteHandler = (pollId: string, optionId: string) => Promise<void>;
type PollUpdateHandler = (pollId: string, updatedPoll: Partial<Poll>) => Promise<void>;
