import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, CreditCard, LogOut } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-gray-900 text-white lg:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b border-gray-800 px-6 lg:h-[60px]">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <span className="">SpecCraft Admin</span>
                        </Link>
                    </div>
                    <div className="flex-1 py-4">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Overview
                            </Link>
                            <Link
                                href="/admin/users"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                            >
                                <Users className="h-4 w-4" />
                                Users
                            </Link>
                            <Link
                                href="/admin/payments"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                            >
                                <CreditCard className="h-4 w-4" />
                                Revenue
                            </Link>
                        </nav>
                    </div>
                    <div className="mt-auto p-4">
                        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-gray-800">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-slate-50">
                <header className="flex h-14 items-center gap-4 border-b bg-white px-6 lg:h-[60px]">
                    <h1 className="font-semibold text-lg">Dashboard</h1>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
