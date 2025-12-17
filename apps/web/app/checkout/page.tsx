'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CreditCard, ShieldCheck } from 'lucide-react';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
    const [upiId, setUpiId] = useState('');

    const planId = searchParams.get('plan') || 'starter';
    const interval = searchParams.get('interval') || 'month';
    const price = searchParams.get('price') || '10';

    useEffect(() => {
        // Check Auth
        const token = localStorage.getItem('token');
        if (!token) {
            const redirectUrl = `/checkout?plan=${planId}&interval=${interval}&price=${price}`;
            router.push(`/auth/register?redirect=${encodeURIComponent(redirectUrl)}`);
        }
    }, [router, planId, interval, price]);

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const handlePayment = async () => {
        setIsProcessing(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (paymentMethod === 'upi') {
            if (!upiId.includes('@')) {
                alert('Please enter a valid UPI ID (e.g. name@upi)');
                setIsProcessing(false);
                return;
            }
        }
        // Basic validation for card (dummy)
        if (paymentMethod === 'card') {
            if (!cardNumber || !expiry || !cvc) {
                alert('Please fill in all card details');
                setIsProcessing(false);
                return;
            }
        }

        // In real app, verify payment with backend here

        setIsProcessing(false);
        alert('Payment Successful!');
        router.push('/dashboard');
    };

    const planName = planId.charAt(0).toUpperCase() + planId.slice(1);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
                    <h1 className="text-2xl font-bold mb-2">Complete Your Purchase</h1>
                    <p className="text-indigo-100">You are just one step away from {planName} access.</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">{planName} Plan</h3>
                            <p className="text-slate-500 capitalize">{interval}ly billing</p>
                        </div>
                        <div className="text-2xl font-bold text-indigo-700">
                            ${price}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700">Payment Method</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                            >
                                <CreditCard className="h-6 w-6" />
                                <span className="font-semibold text-sm">Card</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('upi')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                            >
                                <span className="font-bold text-lg">UPI</span>
                                <span className="font-semibold text-sm">UPI ID</span>
                            </button>
                        </div>

                        {paymentMethod === 'card' ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Card Information</label>
                                    <div className="border border-slate-200 rounded-xl p-3 flex items-center gap-3 bg-white focus-within:ring-2 focus-within:ring-indigo-500/20">
                                        <CreditCard className="text-slate-400 h-5 w-5" />
                                        <input
                                            className="flex-1 outline-none text-sm"
                                            placeholder="Card number"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border border-slate-200 rounded-xl p-3 flex items-center bg-white focus-within:ring-2 focus-within:ring-indigo-500/20">
                                            <input
                                                className="flex-1 outline-none text-sm"
                                                placeholder="MM / YY"
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value)}
                                            />
                                        </div>
                                        <div className="border border-slate-200 rounded-xl p-3 flex items-center bg-white focus-within:ring-2 focus-within:ring-indigo-500/20">
                                            <input
                                                className="flex-1 outline-none text-sm"
                                                placeholder="CVC"
                                                value={cvc}
                                                onChange={(e) => setCvc(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">UPI ID / VPA</label>
                                    <div className="border border-slate-200 rounded-xl p-3 flex items-center gap-3 bg-white focus-within:ring-2 focus-within:ring-indigo-500/20">
                                        <span className="font-bold text-slate-400 text-xs px-1 border-r border-slate-200">@</span>
                                        <input
                                            className="flex-1 outline-none text-sm"
                                            placeholder="username@upi"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Enter your UPI ID (e.g. <span className="font-mono text-indigo-600 bg-indigo-50 px-1 rounded">user@bank</span>) to receive a payment request.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full h-12 text-lg font-bold btn-premium"
                        >
                            {isProcessing ? 'Processing Payment...' : `Pay $${price}`}
                        </Button>
                        <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            Secure 256-bit SSL Encrypted Payment
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
