'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
                // Redirect to the Wizard
                router.push(`/dashboard/new/${doc.id}`);
            } else {
                alert('Failed to create document');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating document');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-full items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create New Specification</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={createDoc} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">
                                Project Name
                            </label>
                            <Input
                                id="title"
                                placeholder="e.g. Acme SaaS Platform"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating...' : 'Start Wizard'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
