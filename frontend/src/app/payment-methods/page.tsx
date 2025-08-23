
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu, Home } from 'lucide-react';
import Link from 'next/link';
import { SettingsSheet } from '@/components/settings-sheet';

const PaymentMethodsHeader = () => (
    <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b">
        <div className="container mx-auto flex items-center h-20 px-4">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </Button>
            <h1 className="text-xl font-bold ml-2">Payment Methods</h1>
            <div className="flex-1" />
            <SettingsSheet>
                 <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                </Button>
            </SettingsSheet>
        </div>
    </header>
);

export default function PaymentMethodsPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <PaymentMethodsHeader />
            <div className="flex flex-col items-center justify-center text-center px-4 py-20">
                <h2 className="text-xl font-semibold mb-2">External payment methods feature will come soon!</h2>
                <p className="text-muted-foreground mb-6">Currently using built-in wallet for all payments</p>
                <Button variant="outline" asChild>
                    <Link href="/">
                        <Home className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    )
}
