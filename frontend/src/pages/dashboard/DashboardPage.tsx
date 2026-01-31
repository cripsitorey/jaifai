import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/ui/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import PollList from '../../components/polls/PollList';
import { AnnouncementCard, type Announcement } from '../../components/announcements/AnnouncementCard';
import { getAnnouncements } from '../../services/api';

const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await getAnnouncements();
                setAnnouncements(data);
            } catch (error) {
                console.error("Failed to fetch announcements", error);
            }
        };
        fetchAnnouncements();
    }, []);

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <Button variant="ghost" size="sm" onClick={logout}>
                        Logout
                    </Button>
                </div>

                <Card>
                    <div className="text-center py-4">
                        <p className="text-gray-500 mb-2">Hola,</p>
                        <h2 className="text-3xl font-bold text-blue-600 mb-1">{user?.username}</h2>
                        {/* Display user ID or Tenant ID if available for debug/info */}
                        {user?.tenantId && <p className="text-xs text-gray-400">Tenant: {user.tenantId}</p>}
                    </div>
                </Card>

                {announcements.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Comunicados</h3>
                        <div className="space-y-4">
                            {announcements.map((ann) => (
                                <AnnouncementCard key={ann.id} announcement={ann} />
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Votaciones Activas</h3>
                    <PollList />
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;
