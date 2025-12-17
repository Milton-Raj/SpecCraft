'use client';

import { useEffect, useState } from 'react';
import { Layers, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    content: any;
}

export default function AdminTemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', category: 'General', content: '{}' });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
        const res = await fetch(`${apiUrl}/admin/templates`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setTemplates(await res.json());
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Delete this template?')) return;
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:4001/admin/templates/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchTemplates();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = editingTemplate
            ? `http://localhost:4001/admin/templates/${editingTemplate.id}`
            : 'http://localhost:4001/admin/templates';
        const method = editingTemplate ? 'PATCH' : 'POST';

        try {
            const payload = { ...formData, content: JSON.parse(formData.content) };
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchTemplates();
                setIsModalOpen(false);
                setEditingTemplate(null);
            } else {
                alert('Failed to save template. Check JSON format.');
            }
        } catch (error) {
            alert('Invalid JSON in content');
        }
    };

    const openEdit = (template: Template) => {
        setEditingTemplate(template);
        setFormData({
            name: template.name,
            description: template.description,
            category: template.category,
            content: JSON.stringify(template.content, null, 2)
        });
        setIsModalOpen(true);
    };

    const openCreate = () => {
        setEditingTemplate(null);
        setFormData({ name: '', description: '', category: 'General', content: '{\n  "prompts": []\n}' });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">AI Templates</h2>
                    <p className="text-slate-500">Manage the prompt chains for different document types.</p>
                </div>
                <Button onClick={openCreate} className="btn-premium"><Plus className="mr-2 h-4 w-4" /> New Template</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        onClick={() => openEdit(template)}
                        className="glass-panel p-6 rounded-2xl hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden text-left"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <Button size="icon" variant="ghost" onClick={(e) => handleDelete(template.id, e)} className="hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white mb-4 shadow-md">
                            <Layers className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 truncate">{template.name}</h3>
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{template.description}</p>
                        <div className="mt-4 flex gap-2">
                            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">{template.category}</span>
                        </div>
                    </div>
                ))}
                {templates.length === 0 && (
                    <div className="col-span-3 text-center py-12 bg-white/50 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-500">No templates found. Create one to get started.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 m-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">{editingTemplate ? 'Edit Template' : 'New Template'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Name</label>
                                    <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. SaaS PRD" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Category</label>
                                    <Input required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="General" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <Input required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description..." />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Configuration (JSON)</label>
                                <Textarea
                                    className="font-mono text-xs h-48 bg-slate-50"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    placeholder='{ "prompts": [...] }'
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700"><Save className="h-4 w-4 mr-2" /> Save Template</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
