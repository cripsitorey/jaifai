import React from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';
import { AlertTriangle, Info } from 'lucide-react';

export interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'LOW' | 'NORMAL' | 'URGENT';
    createdAt: string;
}

interface AnnouncementCardProps {
    announcement: Announcement;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
    const isUrgent = announcement.priority === 'URGENT';
    const date = new Date(announcement.createdAt).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <Card className={cn(
            "p-4 transition-all hover:shadow-md",
            isUrgent ? "border-l-4 border-l-red-500 bg-red-50/50" : "border-l-4 border-l-blue-500"
        )}>
            <div className="flex items-start gap-3">
                <div className={cn("mt-1", isUrgent ? "text-red-500" : "text-blue-500")}>
                    {isUrgent ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{date}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{announcement.content}</p>
                </div>
            </div>
        </Card>
    );
};
