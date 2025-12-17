'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerUser, loginUser } from '@/lib/auth-actions';

const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type UserFormValue = z.infer<typeof formSchema>;

export function RegisterForm({ className }: React.HTMLAttributes<HTMLDivElement>) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserFormValue>({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(data: UserFormValue) {
        setIsLoading(true);
        try {
            // 1. Register
            await registerUser(data);

            // 2. Auto-Login
            const loginResult = await loginUser({
                email: data.email,
                password: data.password
            });

            // 3. Save Token
            localStorage.setItem('token', loginResult.access_token);

            // 4. Redirect
            const redirect = searchParams.get('redirect');
            if (redirect) {
                router.push(redirect);
            } else {
                // Direct registration attempt -> Send to Plan/Pricing Page
                router.push('/#pricing');
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn('grid gap-6', className)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={cn('grid gap-5')}>
                    <div className="grid gap-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="name">
                            Full Name
                        </label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            type="text"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isLoading}
                            className="h-12 rounded-xl border-slate-200 bg-white/50 focus:border-indigo-500 focus:ring-indigo-500/20 backdrop-blur-sm"
                            {...register('name')}
                        />
                        {errors?.name && (
                            <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="email">
                            Email
                        </label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            className="h-12 rounded-xl border-slate-200 bg-white/50 focus:border-indigo-500 focus:ring-indigo-500/20 backdrop-blur-sm"
                            {...register('email')}
                        />
                        {errors?.email && (
                            <p className="px-1 text-xs text-red-600">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="password">
                            Password
                        </label>
                        <Input
                            id="password"
                            placeholder="********"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="new-password"
                            disabled={isLoading}
                            className="h-12 rounded-xl border-slate-200 bg-white/50 focus:border-indigo-500 focus:ring-indigo-500/20 backdrop-blur-sm"
                            {...register('password')}
                        />
                        {errors?.password && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <Button disabled={isLoading} className="btn-premium h-12 rounded-xl font-bold text-base shadow-lg mt-2">
                        {isLoading && (
                            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        Sign Up
                    </Button>
                </div>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/80 px-2 text-slate-500 backdrop-blur-sm rounded-full">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" disabled={isLoading} className="h-11 rounded-xl border-slate-200 hover:bg-slate-50 hover:text-slate-900">
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Google
                </Button>
                <Button variant="outline" type="button" disabled={isLoading} className="h-11 rounded-xl border-slate-200 hover:bg-slate-50 hover:text-slate-900">
                    <svg className="mr-2 h-4 w-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    LinkedIn
                </Button>
            </div>
        </div>
    );
}
