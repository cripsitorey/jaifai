import React from 'react';
import { cn } from '../../lib/utils';

// This layout is designed for mobile-first PWA experience
// It handles safe areas and provides a structure for the main content

interface LayoutProps {
    children: React.ReactNode;
    className?: string;
    hideNav?: boolean; // Option to hide navigation (e.g., on login/setup pages)
}

const Layout: React.FC<LayoutProps> = ({ children, className, hideNav = false }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Status bar spacer for mobile if needed (usually handled by browser, but good to have a safe area wrapper) */}
            <div className="flex-1 flex flex-col w-full max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative">
                {/* Main Content Area */}
                <main className={cn("flex-1 overflow-y-auto p-4 pt-safe-top pb-safe-bottom", className)}>
                    {children}
                </main>

                {/* Bottom Navigation Placeholder - Only show if not hidden */}
                {!hideNav && (
                    <nav className="border-t border-gray-200 bg-white px-6 py-3 flex justify-between items-center pb-safe-bottom">
                        {/* Placeholder icons for navigation */}
                        <div className="text-xs text-center text-blue-600 font-medium">Home</div>
                        <div className="text-xs text-center text-gray-400">Activity</div>
                        <div className="text-xs text-center text-gray-400">Proile</div>
                    </nav>
                )}
            </div>
        </div>
    );
};

export default Layout;
