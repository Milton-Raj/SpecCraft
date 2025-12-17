'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function NewDocumentPage() {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function createDoc(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4001/documents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title }),
            });

            if (res.ok) {
                const doc = await res.json();
                router.push(`/dashboard/new/${doc.id}`);
            } else {
                const errorText = await res.text();
                console.error('Create Doc Failed:', res.status, res.statusText, errorText);
                alert(`Failed to create document: ${res.status} ${res.statusText}`);
            }
        } catch (error: any) {
            console.error(error);
            alert(`Error creating document: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-[80vh] p-4">
            <div className="glass-panel w-full max-w-lg p-8 rounded-3xl relative overflow-hidden">
                {/* Decorative background blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none" />

                <div className="mb-8 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg mb-4">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Start New Specification</h1>
                    <p className="text-slate-500 mt-2">Give your project a name to begin the AI interview process.</p>
                </div>

                <form onSubmit={createDoc} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-semibold text-slate-700 ml-1">
                            Project Name
                        </label>
                        <Input
                            id="title"
                            placeholder="e.g. Food Delivery App for Pets"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 bg-white/50 backdrop-blur-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-premium py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group"
                    >
                        {loading ? 'Creating...' : (
                            <>
                                Start Wizard
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400 max-w-sm">
                Our AI will ask you a series of questions to understand your requirements before generating the document.
            </p>
        </div>
    );
}
