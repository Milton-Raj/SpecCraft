'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Save } from 'lucide-react';

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>

            <div className="glass-panel p-8 rounded-2xl space-y-8">
                <div className="grid gap-6 max-w-2xl">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Application Name</label>
                        <Input defaultValue="SpecCraft" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Contact Support Email</label>
                        <Input defaultValue="support@speccraft.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">OpenAI API Key</label>
                        <Input type="password" value="sk-........................" disabled />
                        <p className="text-xs text-slate-500">Managed via Environment Variables</p>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Security</h3>
                    <div className="space-y-4 max-w-sm">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">New Admin Password</label>
                            <Input type="password" placeholder="Enter new password to reset" id="newPass" />
                        </div>
                        <Button
                            variant="outline"
                            onClick={async () => {
                                const pass = (document.getElementById('newPass') as HTMLInputElement).value;
                                if (!pass) return alert('Enter a password');
                                // In a real app we'd get the current user ID properly.
                                // For this MVP "Admin Console", we might need to assume the logged in user
                                // We will store ID in localStorage on login or decoded token.
                                // Assuming functionality for now or simple "alert" feedback
                                alert('Password reset functionality needs current User ID context. Implementation placeholder.');
                            }}
                        >
                            Update Password
                        </Button>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <Button className="btn-premium">
                        <Save className="mr-2 h-4 w-4" /> Save System Settings
                    </Button>
                </div>
            </div>
        </div>
    )
}
