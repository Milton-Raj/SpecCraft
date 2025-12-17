'use client';

import { useEffect, useState } from 'react';
import { Search, Download, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    plan: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'USER', password: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            // Debug: Alert if no token
            if (!token) {
                alert("DEBUG: No auth token found! Please Login.");
                return;
            }

            console.log("Fetching with token:", token.substring(0, 10) + "...");

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
            const res = await fetch(`${apiUrl}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Response Status:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("Users Data:", data);
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    alert("DEBUG: API returned non-array data. Check console.");
                    console.error("Invalid Data:", data);
                }
            } else {
                const text = await res.text();
                console.error('Fetch Error:', res.status, text);
                alert(`DEBUG: Fetch Failed. Status: ${res.status}. Msg: ${text}`);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
            alert(`DEBUG: Network Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExportValues = () => {
        const headers = ["ID", "Name", "Email", "Role", "Plan", "Created At"];
        const rows = filteredUsers.map(u => [u.id, u.name, u.email, u.role, u.plan, new Date(u.createdAt).toLocaleDateString()]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = editingUser
            ? `http://localhost:4001/admin/users/${editingUser.id}`
            : 'http://localhost:4001/admin/users';

        const method = editingUser ? 'PATCH' : 'POST';

        // Remove password if empty during edit to avoid overwriting with empty string
        const payload: any = { ...formData };
        if (editingUser && !payload.password) delete payload.password;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchUsers();
                setIsModalOpen(false);
                setEditingUser(null);
                setFormData({ name: '', email: '', role: 'USER', password: '' });
            } else {
                alert('Operation failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:4001/admin/users/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
    };

    const openEdit = (user: User) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                    <p className="text-slate-500">Manage user roles, access, and accounts.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleExportValues}>
                        <Download className="h-4 w-4 mr-2" /> Export CSV
                    </Button>
                    <Button onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', role: 'USER', password: '' }); setIsModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="h-4 w-4 mr-2" /> Add User
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search by name or email..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-slate-200/60">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-800">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(user)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && !loading && (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">No users found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Name</label>
                                <Input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Email</label>
                                <Input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            {!editingUser && (
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">Password</label>
                                    <Input type="password" required={!editingUser} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-semibold text-slate-700">Role</label>
                                <select
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save User</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
