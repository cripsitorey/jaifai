import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import api from '../../services/api';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export interface PollOption {
    id: string;
    text: string;
    voteCount: number;
}

export interface Poll {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    hasVoted: boolean;
    options: PollOption[];
}

interface PollCardProps {
    poll: Poll;
    onVoteSuccess: () => void;
}

export const PollCard: React.FC<PollCardProps> = ({ poll, onVoteSuccess }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVote = async () => {
        if (!selectedOption) return;
        setLoading(true);
        setError(null);
        try {
            await api.post(`/polls/${poll.id}/vote`, { optionId: selectedOption });
            onVoteSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to cast vote.');
        } finally {
            setLoading(false);
        }
    };

    const isExpired = new Date(poll.endDate) < new Date();
    const totalVotes = poll.options.reduce((acc, opt) => acc + opt.voteCount, 0);

    return (
        <Card className="overflow-hidden border-2 border-transparent hover:border-blue-50 transition-all">
            <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{poll.title}</h3>
                    {poll.hasVoted && <CheckCircle2 className="text-green-500 w-6 h-6 flex-shrink-0" />}
                </div>

                {poll.description && <p className="text-gray-600 text-sm mb-3">{poll.description}</p>}

                <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>Ends {new Date(poll.endDate).toLocaleDateString()}</span>
                    {isExpired && <span className="text-red-500 font-medium">(Closed)</span>}
                </div>
            </div>

            <div className="space-y-3">
                {poll.hasVoted ? (
                    // Results View
                    <div className="space-y-3">
                        {poll.options.map((option) => {
                            const percentage = totalVotes > 0 ? Math.round((option.voteCount / totalVotes) * 100) : 0;
                            return (
                                <div key={option.id} className="relative">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">{option.text}</span>
                                        <span className="text-gray-500">{percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="pt-2 text-center text-xs text-gray-400">
                            Total votes: {totalVotes}
                        </div>
                    </div>
                ) : (
                    // Voting View
                    <>
                        <div className="space-y-2">
                            {poll.options.map((option) => (
                                <label
                                    key={option.id}
                                    className={cn(
                                        "flex items-center p-3 rounded-lg border cursor-pointer transition-all",
                                        selectedOption === option.id
                                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                            : "border-gray-200 hover:bg-gray-50"
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name={`poll-${poll.id}`}
                                        value={option.id}
                                        checked={selectedOption === option.id}
                                        onChange={() => setSelectedOption(option.id)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        disabled={isExpired}
                                    />
                                    <span className="ml-3 text-sm font-medium text-gray-700">{option.text}</span>
                                </label>
                            ))}
                        </div>

                        {error && (
                            <div className="flex items-center text-red-500 text-sm bg-red-50 p-2 rounded">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {error}
                            </div>
                        )}

                        <Button
                            onClick={handleVote}
                            disabled={!selectedOption || loading || isExpired}
                            fullWidth
                            className="mt-4"
                        >
                            {loading ? 'Submitting...' : isExpired ? 'Voting Closed' : 'Vote'}
                        </Button>
                    </>
                )}
            </div>
        </Card>
    );
};
