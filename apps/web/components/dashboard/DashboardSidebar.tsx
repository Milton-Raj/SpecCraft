"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, FilePlus, Settings, LogOut, User, ArrowUpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import { getUserProfile } from '@/lib/api-client'; // Removed invalid import

export function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        // Fetch user profile
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        fetch(`${apiUrl}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error("Failed to load profile", err));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/auth/login');
    };

    const isActive = (path: string) => pathname === path;

    return (
        <div className="hidden border-r border-white/20 bg-white/40 backdrop-blur-xl lg:block shadow-sm h-full">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b border-white/20 px-6 lg:h-[60px]">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SpecCraft</span>
                    </Link>
                </div>
                <div className="flex-1 py-4">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <Link
                            href="/dashboard"
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all font-semibold",
                                isActive('/dashboard') ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:text-indigo-600 hover:bg-white/50"
                            )}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            My Documents
                        </Link>
                        <Link
                            href="/dashboard/new"
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all font-semibold",
                                isActive('/dashboard/new') ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:text-indigo-600 hover:bg-white/50"
                            )}
                        >
                            <FilePlus className="h-4 w-4" />
                            New Document
                        </Link>
                        <Link
                            href="/dashboard/profile"
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all font-semibold",
                                isActive('/dashboard/profile') ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:text-indigo-600 hover:bg-white/50"
                            )}
                        >
                            <User className="h-4 w-4" />
                            Profile
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <div className="glass-panel p-4 rounded-xl mb-4 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Plan</p>
                                <p className="text-lg font-bold text-indigo-600">{user?.plan || 'Free'} Plan</p>
                            </div>
                            <Link href="/#pricing">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 rounded-full" title="Upgrade Plan">
                                    <ArrowUpCircle className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>

                        {/* Progress bar (dummy for now) */}
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[70%]" />
                        </div>
                        <p className="text-[10px] text-slate-400">7/10 docs generated</p>

                        <Link href="/#pricing" className="block mt-3">
                            <Button size="sm" className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 h-8">
                                Upgrade Plan
                            </Button>
                        </Link>
                    </div>

                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}
