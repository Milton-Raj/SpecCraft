'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Clock, File, Search } from 'lucide-react';
import { appFetch } from '@/lib/mock-api';

export default function DashboardPage() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDocs() {
            try {
                const token = localStorage.getItem('token');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
                const res = await appFetch(`${apiUrl}/documents`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setDocuments(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchDocs();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900">My Documents</h1>
                    <p className="text-slate-500 text-sm">Manage and track your generated specs.</p>
                </div>
                <Link href="/dashboard/new">
                    <button className="btn-premium px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create New
                    </button>
                </Link>
            </div>

            <div className="min-h-[50vh]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                        <p className="text-sm text-slate-400">Loading your specs...</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 p-12 text-center h-96">
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <File className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">
                            No documents yet
                        </h3>
                        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                            You haven't generated any product requirements yet. Start by creating a new one.
                        </p>
                    </div>
                ) : (
                    <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {documents.map((doc) => (
                            <Link key={doc.id} href={`/dashboard/doc/${doc.id}`} className="block group">
                                <div className="glass-panel p-6 rounded-2xl h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className={`text-xs font-semibold px-2 py-1 rounded-full ${doc.content ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {doc.content ? 'Completed' : 'Draft'}
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-lg text-slate-800 mb-2 truncate">{doc.title}</h3>

                                    <div className="flex items-center text-xs text-slate-400 mt-4 gap-4">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(doc.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
