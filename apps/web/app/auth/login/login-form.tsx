'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '@/lib/auth-actions';

const formSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type UserFormValue = z.infer<typeof formSchema>;

export function LoginForm({ className }: React.HTMLAttributes<HTMLDivElement>) {
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
            const result = await loginUser(data);
            localStorage.setItem('token', result.access_token);

            const redirect = searchParams.get('redirect');
            if (redirect) {
                router.push(redirect);
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error(error);
            alert('Login failed'); // Replace with proper error UI later
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn('grid gap-6', className)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={cn('grid gap-5')}>
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
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="password">
                                Password
                            </label>
                            <a href="#" className="text-xs text-indigo-600 hover:text-indigo-500 font-medium">Forgot password?</a>
                        </div>
                        <Input
                            id="password"
                            placeholder="********"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="current-password"
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
                        Sign In
                    </Button>
                </div>
            </form>
        </div>
    );
}
