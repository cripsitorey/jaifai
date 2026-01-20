import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/ui/Layout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const SetupPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError('Invalid setup link. Missing token.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/claim', {
                token,
                username,
                password
            });
            const { access_token } = response.data;
            login(access_token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Setup failed. The link may have expired or is invalid.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <Layout hideNav>
                <div className="flex flex-col justify-center min-h-[80vh] px-4 text-center">
                    <h1 className="text-2xl font-bold text-red-500">Error</h1>
                    <p className="text-gray-600 mt-2">Invalid or missing setup token.</p>
                    <Button variant="ghost" onClick={() => navigate('/login')} className="mt-4">
                        Go to Login
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout hideNav>
            <div className="flex flex-col justify-center min-h-[80vh] px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">Welcome to Jaifai</h1>
                    <p className="text-gray-500 mt-2">Set up your account to get started</p>
                </div>

                <Card className="p-6 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Choose Username</label>
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Desired username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Set Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Strong password"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <Button type="submit" fullWidth disabled={loading}>
                            {loading ? 'Setting up...' : 'Complete Setup'}
                        </Button>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default SetupPage;
