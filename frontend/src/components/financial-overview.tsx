
"use client";

import React, { useState, useEffect } from 'react';
import type { Category } from '@/lib/types';
import { IndianRupee, Wallet, TrendingUp, MoreHorizontal } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card } from './ui/card-overview';
import SpendingBreakdown from './spending-breakdown';
import SmartMoneyTips from './smart-money-tips';
import SavingsGoalOverview from './savings-goal-overview';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from './ui/button';
import RewardPointsOverview from './reward-points-overview';
import Link from 'next/link';
import FooterNav from './footer-nav';

export default function FinancialOverview() {
    const [budget, setBudget] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isClient, setIsClient] = useState(false);
    
    // This state will be used to trigger re-renders when local storage changes
    const [storageVersion, setStorageVersion] = useState(0);

    useEffect(() => {
        setIsClient(true);
        // Function to re-read from local storage
        const updateStateFromStorage = () => {
            try {
                const savedBudget = localStorage.getItem('coinwise_budget');
                const savedCategories = localStorage.getItem('coinwise_categories');
                
                if (savedBudget) {
                    setBudget(JSON.parse(savedBudget));
                } else {
                    setBudget(0); 
                }

                if (savedCategories) {
                    setCategories(JSON.parse(savedCategories));
                } else {
                    setCategories([]);
                }
            } catch (error) {
                console.error("Failed to load from localStorage", error);
                setBudget(0);
                setCategories([]);
            }
        };

        updateStateFromStorage();

        // Listen for a custom event that signals a change in local storage
        const handleStorageChange = () => {
            setStorageVersion(prev => prev + 1);
        };
        window.addEventListener('storageChange', handleStorageChange);
        
        // Also listen to the focus event to catch changes from other tabs
        window.addEventListener('focus', updateStateFromStorage);

        return () => {
            window.removeEventListener('storageChange', handleStorageChange);
            window.removeEventListener('focus', updateStateFromStorage);
        };
    }, [storageVersion]);

    useEffect(() => {
        // This effect runs when the component gains focus, ensuring data is fresh.
        const updateStateFromStorage = () => {
             try {
                const savedBudget = localStorage.getItem('coinwise_budget');
                const savedCategories = localStorage.getItem('coinwise_categories');
                
                if (savedBudget) setBudget(JSON.parse(savedBudget));
                if (savedCategories) setCategories(JSON.parse(savedCategories));

            } catch (error) {
                console.error("Failed to reload from localStorage on focus", error);
            }
        };

        window.addEventListener('focus', updateStateFromStorage);
        return () => window.removeEventListener('focus', updateStateFromStorage);
    }, []);

    const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
    const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
    const effectiveBudget = budget || 0;
    
    const remainingBudget = effectiveBudget - totalSpent;
    const budgetProgress = effectiveBudget > 0 ? (totalSpent / effectiveBudget) * 100 : 0;
    
    const [walletBalance, setWalletBalance] = useState(0);

    useEffect(() => {
        if(isClient) {
            // Mock wallet balance for display, could be linked to savings in a real app
            const savedGoals = localStorage.getItem('coinwise_savings_goals');
            if(savedGoals) {
                const goals = JSON.parse(savedGoals);
                const totalSaved = goals.reduce((sum: number, goal: any) => sum + goal.currentAmount, 0);
                setWalletBalance(totalSaved + 5000); // Mocking some extra cash
            } else {
                setWalletBalance(5000);
            }
        }
    }, [isClient, storageVersion]);


    if (!isClient) {
        return null; // Or a loading spinner
    }

    return (
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground p-6 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between text-lg font-semibold">
                    <div className="flex items-center gap-2">
                        <IndianRupee className="w-6 h-6" />
                        <span>Monthly Budget</span>
                    </div>
                </div>

                <Link href="/wallet">
                    <div className="my-4 bg-white/20 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/30 transition-colors">
                        <div className="flex items-center gap-2">
                            <Wallet className="w-5 h-5" />
                            <span>Wallet</span>
                        </div>
                        <span className="font-bold flex items-center"><IndianRupee className="w-5 h-5 mr-1" />{walletBalance.toLocaleString()}</span>
                    </div>
                </Link>

                <div className="grid grid-cols-2 items-end">
                    <div>
                        <p className="text-4xl font-bold flex items-center"><IndianRupee className="w-9 h-9" />{remainingBudget.toLocaleString()}</p>
                        <p className="text-sm opacity-80">Remaining from Budget</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm opacity-80">Total Budget</p>
                        <p className="font-bold text-lg flex items-center justify-end"><IndianRupee className="w-5 h-5 mr-1" />{effectiveBudget.toLocaleString()}</p>
                    </div>
                </div>
                 <div className="mt-2">
                     <p className="text-sm opacity-80 flex items-center">Spent: <IndianRupee className="w-4 h-4 mx-1" />{totalSpent.toLocaleString()}</p>
                 </div>

                <div className="mt-4">
                    <Progress value={budgetProgress} className="h-2 bg-white/30" indicatorClassName="bg-white" />
                    <div className="flex justify-between text-xs mt-1">
                        <div className="flex items-center gap-1 opacity-80">
                            <TrendingUp className="w-4 h-4" />
                            <span>vs last month</span>
                        </div>
                        <span className="font-semibold">{budgetProgress.toFixed(1)}%</span>
                    </div>
                </div>
            </Card>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Your Financial Overview</h2>
                </div>
                {/* Carousel for mobile */}
                <div className="md:hidden">
                    <Carousel>
                        <CarouselContent>
                            <CarouselItem>
                                <SpendingBreakdown categories={categories} totalSpent={totalSpent} totalAllocated={effectiveBudget} />
                            </CarouselItem>
                            <CarouselItem>
                                <SavingsGoalOverview />
                            </CarouselItem>
                             <CarouselItem>
                                <RewardPointsOverview />
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious className="left-[-1rem]" />
                        <CarouselNext className="right-[-1rem]"/>
                    </Carousel>
                </div>

                {/* Grid for larger screens */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                     <SpendingBreakdown categories={categories} totalSpent={totalSpent} totalAllocated={effectiveBudget} />
                     <SavingsGoalOverview />
                     <RewardPointsOverview />
                </div>
            </div>

            <SmartMoneyTips />
        </div>
    );
}
