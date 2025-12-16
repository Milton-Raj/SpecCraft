'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Send, CheckCircle } from 'lucide-react';

interface Question {
    id: string;
    text: string;
    type: 'text' | 'choice' | 'multi-choice';
    options?: string[];
}

interface Message {
    role: 'system' | 'user';
    content: string;
}

export default function WizardPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial Load
    useEffect(() => {
        async function initSession() {
            try {
                const token = localStorage.getItem('token');

                // 1. Get Doc to see previous history
                const docRes = await fetch(`http://localhost:4001/documents/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const doc = await docRes.json();
                const history = doc.content?.history || [];

                // Reconstruct messages from history
                const loadedMessages: Message[] = [];
                history.forEach((h: any) => {
                    loadedMessages.push({ role: 'system', content: h.question });
                    loadedMessages.push({ role: 'user', content: h.answer });
                });
                setMessages(loadedMessages);

                // 2. Start/Resume Session (Get Current Question)
                const startRes = await fetch(`http://localhost:4001/documents/${id}/start`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                });
                const question = await startRes.json();

                if (question) {
                    setCurrentQuestion(question);
                    // Don't add to messages if it's already the last one (simple dedup check)
                    const lastMsg = loadedMessages[loadedMessages.length - 1];
                    if (!lastMsg || lastMsg.role === 'user') {
                        setMessages(prev => [...prev, { role: 'system', content: question.text }]);
                    }
                } else {
                    // If null, it means we are done? Or maybe just started.
                    // If history exists but no next question, assume complete.
                    if (history.length > 0) setIsComplete(true);
                }

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        initSession();
    }, [id]);

    async function handleSend() {
        if (!input.trim()) return;

        // Optimistic Update
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setSending(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:4001/documents/${id}/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ answer: userMsg })
            });

            const nextQuestion = await res.json();

            if (nextQuestion) {
                setCurrentQuestion(nextQuestion);
                setMessages(prev => [...prev, { role: 'system', content: nextQuestion.text }]);
            } else {
                // Completion
                setIsComplete(true);
                setCurrentQuestion(null);
            }

        } catch (e) {
            console.error(e);
            // Rollback or show error
        } finally {
            setSending(false);
        }
    }

    if (loading) return <div className="p-8 text-center">Loading session...</div>;

    return (
        <div className="flex h-[calc(100vh-100px)] flex-col max-w-3xl mx-auto">
            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="text-lg">SpecCraft Wizard</CardTitle>
                </CardHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                m.role === 'user'
                                    ? "ml-auto bg-primary text-primary-foreground"
                                    : "bg-muted"
                            )}
                        >
                            {m.content}
                        </div>
                    ))}

                    {isComplete && (
                        <div className="flex flex-col items-center justify-center p-8 bg-green-50/50 border rounded-xl gap-4">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                            <h3 className="font-bold text-xl">Requirements Gathered!</h3>
                            <p className="text-muted-foreground text-center">
                                The AI has enough information to generate your PRD.
                            </p>
                            <Button
                                onClick={() => router.push(`/dashboard/doc/${id}`)}
                                className="w-full bg-green-600 hover:bg-green-700"
                            >
                                Generate & View PRD
                            </Button>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {!isComplete && (
                    <CardFooter className="p-4 border-t bg-background">
                        <div className="flex w-full items-center gap-2">
                            {/* Render Options if Choice Type */}
                            {currentQuestion?.type === 'choice' && currentQuestion.options ? (
                                <div className="flex gap-2 flex-wrap w-full">
                                    {currentQuestion.options.map((opt) => (
                                        <Button
                                            key={opt}
                                            variant="outline"
                                            onClick={() => {
                                                setInput(opt);
                                                // Auto send on choice click? Maybe safer to let user confirm.
                                                // Let's just fill input for now.
                                                setInput(opt);
                                            }}
                                        >
                                            {opt}
                                        </Button>
                                    ))}
                                </div>
                            ) : null}

                            <Input
                                placeholder="Type your answer..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                disabled={sending}
                                autoFocus
                            />
                            <Button size="icon" onClick={handleSend} disabled={sending || !input.trim()}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
