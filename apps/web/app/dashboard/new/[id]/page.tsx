'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Send, CheckCircle, Sparkles, Files } from 'lucide-react';

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
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';
                const docRes = await fetch(`${apiUrl}/documents/${id}`, {
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

            if (res.ok) {
                const text = await res.text();
                const nextQuestion = text ? JSON.parse(text) : null;

                if (nextQuestion) {
                    setCurrentQuestion(nextQuestion);
                    setMessages(prev => [...prev, { role: 'system', content: nextQuestion.text }]);
                } else {
                    // Completion
                    setIsComplete(true);
                    setCurrentQuestion(null);
                }
            } else {
                console.error('Answer Failed:', res.status, res.statusText);
            }

        } catch (e) {
            console.error(e);
            // Rollback or show error
        } finally {
            setSending(false);
        }
    }

    if (loading) return <div className="p-8 text-center">Loading session...</div>;

    // Calculate progress (mock logic: 10% per answer, max 90% until complete)
    const answerCount = messages.filter(m => m.role === 'user').length;
    const progress = isComplete ? 100 : Math.min(answerCount * 15, 90);

    return (
        <div className="h-[calc(100vh-100px)] p-4 w-full max-w-[98%] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
            {/* Left: Chat Area - Expanded Width */}
            <div className="flex flex-col glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/40 h-full animate-in slide-in-from-left-4 duration-700">
                <div className="p-4 border-b border-white/20 bg-white/30 backdrop-blur-md flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                            <Sparkles className="h-5 w-5 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800">SpecCraft AI Architect</h2>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                Online • Spec ID: #{id.slice(0, 6)}
                            </p>
                        </div>
                    </div>
                    {/* Clear Chat or other options could go here */}
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth">
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex gap-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-500",
                                m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {/* Avatar */}
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                m.role === 'user' ? "bg-slate-200" : "bg-indigo-100 text-indigo-600"
                            )}>
                                {m.role === 'user' ? (
                                    <div className="h-full w-full rounded-full bg-gradient-to-tr from-slate-300 to-slate-400" />
                                ) : (
                                    <Sparkles className="h-4 w-4" />
                                )}
                            </div>

                            {/* Bubble */}
                            <div className={cn(
                                "rounded-2xl p-4 shadow-sm text-sm leading-relaxed",
                                m.role === 'user'
                                    ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-indigo-200"
                                    : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                            )}>
                                {m.content}
                            </div>
                        </div>
                    ))}

                    {isComplete && (
                        <div className="flex flex-col items-center justify-center p-8 bg-green-50/50 border border-green-100 rounded-2xl gap-4 animate-in fade-in zoom-in duration-500">
                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-xl text-green-900">Requirements Gathered!</h3>
                                <p className="text-green-700 mt-1">
                                    The AI has enough information to generate your PRD.
                                </p>
                            </div>
                            <Button
                                onClick={() => router.push(`/dashboard/doc/${id}`)}
                                className="w-full max-w-xs bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
                            >
                                Generate & View PRD
                            </Button>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {!isComplete && (
                    <div className="p-4 bg-white/40 backdrop-blur-md border-t border-white/20">
                        <div className="max-w-4xl mx-auto space-y-4">
                            {/* Options */}
                            {currentQuestion?.type === 'choice' && currentQuestion.options && (
                                <div className="flex gap-2 flex-wrap">
                                    {currentQuestion.options.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => setInput(opt)}
                                            className="px-4 py-2 rounded-full bg-white border border-indigo-100 text-indigo-600 text-sm font-medium hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm active:scale-95"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input Bar */}
                            <div className="relative flex items-center gap-2">
                                <Input
                                    placeholder="Type your answer..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    disabled={sending}
                                    autoFocus
                                    className="h-14 pl-6 pr-14 rounded-full border-slate-200 bg-white shadow-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-base"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={sending || !input.trim()}
                                    className="absolute right-2 p-2 rounded-full bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors shadow-md hover:scale-105"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-slate-400">Press Enter to send</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Info Panel */}
            <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-700 delay-200">
                {/* Progress Card */}
                <div className="glass-panel p-6 rounded-2xl shadow-lg border border-white/40">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <CheckCircle className="h-4 w-4" />
                        </div>
                        Progress
                    </h3>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Completion</span>
                            <span className="font-bold text-indigo-600">{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="pt-2">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-slate-800">{answerCount}</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Answered</div>
                                </div>
                                <div className="h-10 w-10 text-slate-200">
                                    <Files className="h-full w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tips Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />

                    <h3 className="font-bold mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-300" />
                        AI Tip
                    </h3>
                    <p className="text-sm text-indigo-100 leading-relaxed">
                        Be specific about your target audience. The more details you provide about *who* will use the app, the better the user flows will be.
                    </p>
                </div>
            </div>
        </div>
    );
}
