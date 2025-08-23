
"use client";

import FinancialOverview from '@/components/financial-overview';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function Home() {
    const [budget, setBudget] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
        try {
            const savedAuth = localStorage.getItem('coinwise_authenticated');
            const guestAuth = localStorage.getItem('coinwise_guest');

            if (savedAuth || guestAuth) {
                setIsAuthenticated(true);
                const savedBudget = localStorage.getItem('coinwise_budget');
                if (savedBudget) {
                    setBudget(JSON.parse(savedBudget));
                }
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Failed to load from localStorage", error);
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        if (isClient && isAuthenticated === false) {
            router.push('/welcome');
        }
    }, [isClient, isAuthenticated, router]);


    if (!isClient || isAuthenticated === null || isAuthenticated === false) {
        return null; // Or a loading spinner
    }

    if (budget === null) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <PiggyBank className="w-8 h-8 text-primary" />
                            Welcome to CoinWise!
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground">
                            Please go to the <Link href="/budget" className="text-primary underline">Budget</Link> page to set your first budget.
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
    <div className="space-y-8">
      <FinancialOverview />
    </div>
  );
}
