import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { PollCard, type Poll } from './PollCard';
import { Card } from '../ui/Card';

const PollList: React.FC = () => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPolls = async () => {
        try {
            setLoading(true);
            const response = await api.get('/polls');
            setPolls(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar votaciones.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolls();
    }, []);

    const handleVoteSuccess = () => {
        // Fix Stale Results: Refetch from server to get updated counts and status
        fetchPolls();
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-48 bg-gray-200 rounded-xl"></div>
                <div className="h-48 bg-gray-200 rounded-xl"></div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="text-center py-8 text-red-500 border-red-100 bg-red-50">
                <p>{error}</p>
                <button onClick={fetchPolls} className="text-sm underline mt-2">Reintentar</button>
            </Card>
        );
    }

    if (polls.length === 0) {
        return (
            <Card className="text-center py-10 bg-gray-50 border-dashed">
                <p className="text-gray-500">No hay votaciones activas.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {polls.map((poll) => (
                <PollCard key={poll.id} poll={poll} onVoteSuccess={handleVoteSuccess} />
            ))}
        </div>
    );
};

export default PollList;
