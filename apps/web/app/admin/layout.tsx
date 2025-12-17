import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Users,
    FileText,
    CreditCard,
    Settings,
    Activity,
    Layers,
    LogOut,
    ShieldAlert
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            {/* Sidebar - Premium Glass Light */}
            <div className="hidden border-r border-white/40 bg-white/60 backdrop-blur-xl lg:block shadow-sm">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-16 items-center border-b border-gray-100 px-6">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5 rounded-lg shadow-md">
                                <ShieldAlert className="h-5 w-5 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Admin Console</span>
                        </Link>
                    </div>
                    <div className="flex-1 py-6 px-4">
                        <nav className="grid items-start gap-1 text-sm font-medium">
                            <NavItem href="/admin" icon={LayoutDashboard} label="Overview" />
                            <NavItem href="/admin/users" icon={Users} label="User Management" />
                            <NavItem href="/admin/documents" icon={FileText} label="All Documents" />
                            <NavItem href="/admin/templates" icon={Layers} label="AI Templates" />
                            <NavItem href="/admin/billing" icon={CreditCard} label="Billing & Plans" />
                            <NavItem href="/admin/banking" icon={CreditCard} label="Banking Details" />
                            <NavItem href="/admin/settings" icon={Settings} label="System Settings" />
                        </nav>
                    </div>
                    <div className="mt-auto p-4 border-t border-gray-100">
                        <div className="glass-panel p-4 rounded-xl mb-3 bg-red-50/50 border-red-100">
                            <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Admin Mode</p>
                            <p className="text-[10px] text-red-600 leading-tight">You have full read/write access to all user data.</p>
                        </div>
                        <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col relative overflow-hidden">
                {/* Background Blobs for specific admin flair - slightly cooler tones */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-200/40 blur-[120px] pointer-events-none" />

                <header className="flex h-16 items-center justify-between border-b border-white/40 bg-white/30 backdrop-blur-md px-8 sticky top-0 z-30">
                    <h1 className="font-bold text-lg text-slate-700 tracking-tight">Command Center</h1>
                    {/* Removed System Healthy and Profile Circle as requested */}
                </header>
                <main className="flex flex-1 flex-col gap-6 p-6 lg:p-8 overflow-y-auto relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavItem({ href, icon: Icon, label }: any) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-500 hover:text-indigo-600 hover:bg-white/60 hover:shadow-sm transition-all group"
        >
            <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">{label}</span>
        </Link>
    )
}
