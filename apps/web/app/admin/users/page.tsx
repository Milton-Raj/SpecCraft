'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { User, Shield, ShieldAlert } from 'lucide-react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:4001/admin/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER';
        const token = localStorage.getItem('token');

        try {
            await fetch(`http://localhost:4001/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            // Optimistic update
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (e) {
            alert('Failed to update role');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">User Management</h1>
                <Button>Export CSV</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage user roles and access.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? <p>Loading...</p> : (
                        <div className="space-y-4">
                            {users.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                                            <User className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{user.name || 'Unnamed'}</p>
                                            <p className="text-sm text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.plan === 'PRO' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}>
                                            {user.plan}
                                        </span>
                                        <Button
                                            variant={user.role === 'ADMIN' ? "destructive" : "outline"}
                                            size="sm"
                                            onClick={() => toggleRole(user.id, user.role)}
                                        >
                                            {user.role === 'ADMIN' ? (
                                                <><ShieldAlert className="mr-2 h-4 w-4" /> Revoke Admin</>
                                            ) : (
                                                <><Shield className="mr-2 h-4 w-4" /> Make Admin</>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
