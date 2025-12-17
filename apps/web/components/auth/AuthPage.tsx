'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LoginForm } from '@/app/auth/login/login-form';
import { RegisterForm } from '@/app/auth/register/register-form';

export function AuthPage() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(pathname.includes('register') ? 'register' : 'login');

    const handleTabChange = (tab: 'login' | 'register') => {
        setActiveTab(tab);
        // Persist redirect params when switching tabs
        const params = new URLSearchParams(searchParams.toString());
        router.push(`/auth/${tab}?${params.toString()}`);
    };

    return (
        <div className="w-full">
            <div className="bg-slate-50 p-1 rounded-xl mb-8 flex">
                <button
                    onClick={() => handleTabChange('login')}
                    className={cn(
                        "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                        activeTab === 'login' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                    )}
                >
                    Sign In
                </button>
                <button
                    onClick={() => handleTabChange('register')}
                    className={cn(
                        "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
                        activeTab === 'register' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                    )}
                >
                    Create Account
                </button>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">
                    {activeTab === 'login' ? 'Welcome Back' : 'Get Started'}
                </h1>
                <p className="text-slate-500 text-sm mt-2">
                    {activeTab === 'login'
                        ? 'Enter your credentials to access your account'
                        : 'Join SpecCraft to start generating specs'}
                </p>
            </div>

            {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
    );
}
