"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard } from 'lucide-react';

export function HeaderAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check for token on mount
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.refresh();
        router.push('/');
    };

    if (isLoggedIn) {
        return (
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" className="text-slate-600 hover:text-indigo-600 font-medium">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                    </Button>
                </Link>
                <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-full"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
                Sign In
            </Link>
            <Link href="/auth/register">
                <button className="btn-premium px-6 py-2 rounded-full text-sm font-semibold text-white shadow-lg transform transition hover:-translate-y-0.5">
                    Get Started
                </button>
            </Link>
        </div>
    );
}
