'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Plus } from 'lucide-react';

// Mock data fetcher for now until we connect to API fully
// We will replace this with real fetch in a moment.

export default function DashboardPage() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDocs() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:4001/documents', {
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
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">My Documents</h1>
            </div>
            <div
                className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
                style={{ minHeight: '50vh' }}
            >
                {loading ? (
                    <div className="flex flex-col items-center gap-1 text-center">
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            You have no documents
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            You can start by creating a new SpecCraft document.
                        </p>
                        <Link href="/dashboard/new" className="mt-4">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Document
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid w-full gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 self-start items-start">
                        {documents.map((doc) => (
                            <Link key={doc.id} href={`/dashboard/doc/${doc.id}`} className="block">
                                <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                                    <CardHeader>
                                        <CardTitle>{doc.title}</CardTitle>
                                        <CardDescription>{new Date(doc.updatedAt).toLocaleDateString()}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-muted-foreground">
                                            Status: {doc.content?.status || 'Active'}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
