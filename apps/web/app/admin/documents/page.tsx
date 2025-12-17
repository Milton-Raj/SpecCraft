'use client';

import { useEffect, useState } from 'react';
import { FileText, Search, MoreHorizontal, Download, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Document {
    id: string;
    title: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

export default function AdminDocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        const res = await fetch(`${apiUrl}/admin/documents`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setDocuments(await res.json());
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This action is irreversible.')) return;
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:4001/admin/documents/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchDocuments();
    };

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.user?.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">All Documents</h2>
                    <p className="text-slate-500">View and manage user-generated specifications.</p>
                </div>
                <div className="flex gap-2">
                    <Input
                        placeholder="Search by title or author..."
                        className="w-64 bg-white/50"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <Button variant="outline"><Search className="h-4 w-4" /></Button>
                </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden p-1 shadow-sm border border-slate-200/60">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Author</th>
                                <th className="px-6 py-4">Created At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredDocs.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        {doc.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 font-medium">{doc.user?.name || 'Unknown'}</span>
                                            <span className="text-xs text-slate-500">{doc.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(doc.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <a href={`/dashboard/new/${doc.id}`} target="_blank" rel="noopener noreferrer">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600"><Eye className="h-4 w-4" /></Button>
                                            </a>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} className="h-8 w-8 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredDocs.length === 0 && !loading && (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">No documents found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
