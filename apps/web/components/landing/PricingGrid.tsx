"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, Zap } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export function PricingGrid() {
    const [isYearly, setIsYearly] = useState(false);
    const router = useRouter();

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            monthlyPrice: 10,
            features: ['5 Documents per month', 'Basic AI Templates', 'Standard Support'],
            isPopular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            monthlyPrice: 29,
            features: ['Unlimited Documents', 'Advanced AI Architect', 'Priority Support', 'Export to Code'],
            isPopular: true
        },
        {
            id: 'lifetime',
            name: 'Lifetime',
            price: 299,
            interval: 'one-time',
            features: ['Everything in Pro', 'Lifetime Updates', 'No Monthly Fees', 'Founder Status'],
            isPopular: false,
            isLifetime: true
        }
    ];

    const handleSelectPlan = (plan: any) => {
        const interval = plan.isLifetime ? 'lifetime' : (isYearly ? 'year' : 'month');
        const price = plan.isLifetime ? plan.price : (isYearly ? plan.monthlyPrice * 12 : plan.monthlyPrice);

        const checkoutUrl = `/checkout?plan=${plan.id}&interval=${interval}&price=${price}`;

        // Flow 1 Check:
        // If logged in (Flow 2 step): Go to Checkout
        // If not logged in (Flow 1 step): Go to Register -> Checkout
        const token = localStorage.getItem('token');
        if (token) {
            router.push(checkoutUrl);
        } else {
            router.push(`/auth/register?redirect=${encodeURIComponent(checkoutUrl)}`);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            {/* Toggle */}
            <div className="flex items-center justify-center gap-4">
                <span className={cn("text-sm font-bold", !isYearly ? "text-slate-900" : "text-slate-500")}>Monthly</span>
                <Switch
                    checked={isYearly}
                    onCheckedChange={setIsYearly}
                    className="data-[state=checked]:bg-indigo-600"
                />
                <span className={cn("text-sm font-bold", isYearly ? "text-slate-900" : "text-slate-500")}>Yearly</span>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => {
                    const price = plan.isLifetime ? plan.price : (isYearly ? plan.monthlyPrice * 12 : plan.monthlyPrice);
                    const intervalLabel = plan.isLifetime ? '' : (isYearly ? '/year' : '/month');

                    return (
                        <div key={plan.id} className={cn(
                            "relative p-8 rounded-3xl border shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col bg-white/60 backdrop-blur-lg border-white hover:shadow-2xl",
                            plan.isPopular ? "border-indigo-500 scale-105 z-10 bg-white/80" : ""
                        )}>
                            {plan.isPopular && (
                                <div className="absolute top-0 right-0 -mt-3 mr-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    MOST POPULAR
                                </div>
                            )}

                            <h3 className="text-2xl font-bold mb-2 text-slate-800">{plan.name}</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold text-slate-900">${price}</span>
                                <span className="text-slate-500 ml-2 font-medium">{intervalLabel}</span>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center font-medium text-slate-600">
                                        <CheckCircle className="h-5 w-5 mr-3 shrink-0 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                onClick={() => handleSelectPlan(plan)}
                                className={cn(
                                    "w-full rounded-xl py-6 shadow-lg transition-all font-bold mt-auto",
                                    plan.isPopular ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200" :
                                        "bg-slate-900 hover:bg-slate-800 text-white"
                                )}
                            >
                                {plan.id === 'lifetime' ? 'Get Lifetime Access' : `Get ${plan.name}`}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
