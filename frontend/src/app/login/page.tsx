
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd validate credentials here.
        // For this demo, we'll just simulate a successful login.
        try {
            localStorage.setItem('coinwise_authenticated', 'true');
            toast({
                title: "Login Successful!",
                description: "Welcome back to CoinWise.",
            });
            router.push('/');
        } catch (error) {
            console.error("Failed to set localStorage", error);
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: 'Could not save session. Please try again.',
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 p-4">
             <header className="flex items-center">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/welcome">
                        <ArrowLeft />
                    </Link>
                </Button>
            </header>
            <main className="flex-grow flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                >
                    <Card className="w-full max-w-md mx-auto shadow-xl">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Welcome Back!</CardTitle>
                            <CardDescription>Enter your credentials to access your account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="student@college.edu" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" required />
                                </div>
                                <Button type="submit" className="w-full h-11">Log In</Button>
                                <div className="text-center text-sm">
                                    <p>
                                        Don't have an account?{' '}
                                        <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
                                            Sign up
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
