'use client';

import { useEffect, useState } from 'react';
import { CreditCard, DollarSign, TrendingUp, Plus, Edit2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface Plan {
    id: string;
    name: string;
    price: number;
    interval: string;
    features: string[];
    isPopular: boolean;
    isActive: boolean;
}

export default function AdminBillingPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        const res = await fetch(`${apiUrl}/admin/plans`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setPlans(await res.json());
        setLoading(false);
    };

    const handleSave = async () => {
        if (!editingPlan) return;
        const token = localStorage.getItem('token');
        const url = isCreating ? 'http://localhost:4001/admin/plans' : `http://localhost:4001/admin/plans/${editingPlan.id}`;
        const method = isCreating ? 'POST' : 'PATCH';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(editingPlan)
            });
            if (res.ok) {
                fetchPlans();
                setEditingPlan(null);
                setIsCreating(false);
            }
        } catch (e) {
            console.error(e);
            alert('Failed to save plan');
        }
    };

    const toggleActive = async (id: string) => {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:4001/admin/plans/${id}/toggle`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchPlans();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Billing & Plans</h2>
                <Button onClick={() => { setEditingPlan({ features: [] }); setIsCreating(true); }} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" /> Add Plan
                </Button>
            </div>

            {/* Plans Manager */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-4">Manage Pricing Plans</h3>

                {isCreating || editingPlan ? (
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 max-w-2xl">
                        <h4 className="font-bold text-slate-700">{isCreating ? 'Create New Plan' : 'Edit Plan'}</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500">Plan Name</label>
                                <Input
                                    value={editingPlan?.name || ''}
                                    onChange={e => setEditingPlan(p => ({ ...p, name: e.target.value }))}
                                    placeholder="e.g. Pro"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500">Price</label>
                                <Input
                                    type="number"
                                    value={editingPlan?.price || 0}
                                    onChange={e => setEditingPlan(p => ({ ...p, price: parseFloat(e.target.value) }))}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500">Features (comma separated)</label>
                            <Input
                                value={editingPlan?.features?.join(', ') || ''}
                                onChange={e => setEditingPlan(p => ({ ...p, features: e.target.value.split(',').map(s => s.trim()) }))}
                                placeholder="Feature 1, Feature 2..."
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <Switch
                                    checked={editingPlan?.isActive}
                                    onCheckedChange={c => setEditingPlan(p => ({ ...p, isActive: c }))}
                                />
                                Active
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <Switch
                                    checked={editingPlan?.isPopular}
                                    onCheckedChange={c => setEditingPlan(p => ({ ...p, isPopular: c }))}
                                />
                                Mark as Popular
                            </label>
                        </div>
                        <div className="flex gap-2 justify-end mt-4">
                            <Button variant="outline" onClick={() => { setEditingPlan(null); setIsCreating(false); }}>Cancel</Button>
                            <Button onClick={handleSave} className="bg-indigo-600 text-white">Save Plan</Button>
                        </div>
                    </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    {plans.map(plan => (
                        <div key={plan.id} className={`relative p-6 rounded-2xl border ${plan.isActive ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-xl text-slate-800">{plan.name}</h4>
                                    <p className="text-2xl font-bold text-indigo-600 mt-1">₹{plan.price}<span className="text-sm font-normal text-slate-500">/{plan.interval}</span></p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingPlan(plan); setIsCreating(false); }} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <Switch checked={plan.isActive} onCheckedChange={() => toggleActive(plan.id)} />
                                </div>
                            </div>

                            <ul className="space-y-2 mb-4">
                                {plan.features.slice(0, 4).map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                        <Check className="h-4 w-4 text-green-500" /> {f}
                                    </li>
                                ))}
                            </ul>

                            {plan.isPopular && (
                                <span className="absolute top-0 right-0 -mt-3 mr-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                                    MOST POPULAR
                                </span>
                            )}
                        </div>
                    ))}

                    {!loading && plans.length === 0 && (
                        <div className="col-span-3 text-center py-10 text-slate-400">
                            No plans created yet. Click "Add Plan" to start.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
