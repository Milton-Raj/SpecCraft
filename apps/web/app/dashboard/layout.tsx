import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Settings, User } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Dashboard - SpecCraft',
    description: 'Manage your documents',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 lg:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600" />
                            <span className="">SpecCraft</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                            >
                                <FileText className="h-4 w-4" />
                                Documents
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </Link>
                        </nav>
                    </div>
                    <div className="mt-auto p-4">
                        <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>User Account</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
                    <div className="w-full flex-1">
                        {/* Search or Breadcrumbs could go here */}
                    </div>
                    <Link href="/dashboard/new">
                        <Button size="sm" className="hidden md:flex">
                            <Plus className="mr-2 h-4 w-4" />
                            New Document
                        </Button>
                    </Link>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
