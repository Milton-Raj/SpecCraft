'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, FileText, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Platform Overview</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value="₹45,231"
                    change="+20.1%"
                    icon={DollarSign}
                    color="text-green-600"
                    bg="bg-green-50"
                />
                <StatsCard
                    title="Total Users"
                    value="2,350"
                    change="+180.1%"
                    icon={Users}
                    color="text-indigo-600"
                    bg="bg-indigo-50"
                />
                <StatsCard
                    title="Documents Created"
                    value="12,234"
                    change="+19%"
                    icon={FileText}
                    color="text-purple-600"
                    bg="bg-purple-50"
                />
                <StatsCard
                    title="Live Sessions"
                    value="573"
                    change="+201"
                    icon={TrendingUp}
                    color="text-orange-600"
                    bg="bg-orange-50"
                />
            </div>
        </div>
    );
}

function StatsCard({ title, value, change, icon: Icon, color, bg }: any) {
    return (
        <div className="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">{title}</span>
                <div className={`p-2 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="text-3xl font-bold text-slate-800">{value}</div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <span className="text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-full">{change}</span> from last month
            </p>
        </div>
    )
}
