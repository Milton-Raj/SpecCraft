import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FilePlus, Settings, LogOut, FileText } from 'lucide-react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            {/* Sidebar - Client Component */}
            <DashboardSidebar />

            {/* Main Content */}
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b border-gray-200/50 bg-white/30 backdrop-blur-md px-6 lg:h-[60px] sticky top-0 z-10">
                    <h1 className="font-semibold text-lg text-slate-700">Dashboard</h1>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
