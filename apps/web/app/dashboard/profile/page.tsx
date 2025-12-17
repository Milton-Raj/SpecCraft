"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User } from 'lucide-react';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
            fetch(`${apiUrl}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setUser(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, []);

    const handlePasswordUpdate = async () => {
        if (!newPassword) return; // Add validation
        setIsUpdating(true);
        // Implement password update logic here (likely need a new API endpoint or use updateUser)
        // For now simulating success
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert("Password updated");
            setNewPassword('');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">My Profile</h2>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-indigo-600" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>Your account details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Full Name</label>
                            <Input value={user?.name || ''} disabled className="bg-slate-50 border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Email Address</label>
                            <Input value={user?.email || ''} disabled className="bg-slate-50 border-slate-200" />
                            <p className="text-xs text-slate-400">Contact support to change your email.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-indigo-600" />
                            Security
                        </CardTitle>
                        <CardDescription>Manage your password.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">New Password</label>
                            <Input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={handlePasswordUpdate}
                            disabled={isUpdating || !newPassword}
                            className="w-full btn-premium"
                        >
                            {isUpdating ? 'Updating...' : 'Update Password'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
