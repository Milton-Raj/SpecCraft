'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Plus, Trash2, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    ifsc: string;
    swiftCode: string;
    isPrimary: boolean;
}

export default function AdminBankingPage() {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newAccount, setNewAccount] = useState({
        bankName: '',
        accountNumber: '',
        accountName: '',
        ifsc: '',
        swiftCode: '',
        isPrimary: false
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        const res = await fetch(`${apiUrl}/admin/banking`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setAccounts(await res.json());
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4001/admin/banking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(newAccount)
        });

        if (res.ok) {
            fetchAccounts();
            setIsCreating(false);
            setNewAccount({
                bankName: '',
                accountNumber: '',
                accountName: '',
                ifsc: '',
                swiftCode: '',
                isPrimary: false
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this bank account?')) return;
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:4001/admin/banking/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchAccounts();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Banking Details</h2>
                    <p className="text-slate-500">Manage accounts for receiving subscription payments.</p>
                </div>
                {!isCreating && (
                    <Button onClick={() => setIsCreating(true)} className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="h-4 w-4 mr-2" /> Add Bank Account
                    </Button>
                )}
            </div>

            {isCreating && (
                <div className="glass-panel p-6 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Add Bank Account</h3>
                    <form onSubmit={handleCreate} className="space-y-4 max-w-2xl">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Bank Name</label>
                                <Input required value={newAccount.bankName} onChange={e => setNewAccount({ ...newAccount, bankName: e.target.value })} placeholder="e.g. HDFC Bank" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Account Name</label>
                                <Input required value={newAccount.accountName} onChange={e => setNewAccount({ ...newAccount, accountName: e.target.value })} placeholder="Account Holder Name" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700">Account Number</label>
                            <Input required value={newAccount.accountNumber} onChange={e => setNewAccount({ ...newAccount, accountNumber: e.target.value })} placeholder="XXXXXXXXXXXX" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">IFSC Code</label>
                                <Input value={newAccount.ifsc} onChange={e => setNewAccount({ ...newAccount, ifsc: e.target.value })} placeholder="HDFC0001234" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">SWIFT Code</label>
                                <Input value={newAccount.swiftCode} onChange={e => setNewAccount({ ...newAccount, swiftCode: e.target.value })} placeholder="Optional" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch checked={newAccount.isPrimary} onCheckedChange={c => setNewAccount({ ...newAccount, isPrimary: c })} />
                            <span className="text-sm font-medium text-slate-600">Set as Primary Receiving Account</span>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save Account</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {accounts.map((account) => (
                    <div key={account.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(account.id)} className="hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
                                <Building className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{account.bankName}</h4>
                                <p className="text-sm text-slate-500">{account.accountName}</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-400">Account No</span>
                                <span className="font-mono">{account.accountNumber}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2">
                                <span className="text-slate-400">IFSC</span>
                                <span className="font-mono">{account.ifsc || '-'}</span>
                            </div>
                            {account.isPrimary && (
                                <div className="pt-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Primary Account
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
