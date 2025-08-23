
"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

const SavingsGoalCard: React.FC<{ goal: SavingsGoal }> = ({ goal }) => {
    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    const monthlyTarget = 938; // Mock data
    const monthsLeft = goal.targetAmount > goal.currentAmount 
        ? Math.ceil((goal.targetAmount - goal.currentAmount) / monthlyTarget) 
        : 0;

    return (
        <Card className="p-6 rounded-2xl shadow-lg bg-card h-full flex flex-col">
            <div className="text-center my-6 flex-grow">
                <p className="font-semibold text-lg">{goal.name}</p>
                <p className="text-4xl font-bold flex items-center justify-center">
                    <IndianRupee className="w-8 h-8"/>
                    {goal.currentAmount.toLocaleString()}
                </p>
                <p className="text-muted-foreground text-sm flex items-center justify-center">of <IndianRupee className="w-3.5 h-3.5 mx-1" />{goal.targetAmount.toLocaleString()} goal</p>
            </div>
            
            <Progress value={progress} className="h-2" />

            <div className="flex justify-between mt-4">
                <div className="text-center">
                    <p className="text-muted-foreground text-sm">Monthly Target</p>
                    <p className="font-bold flex items-center justify-center"><IndianRupee className="w-4 h-4" />{monthlyTarget.toLocaleString()}</p>
                </div>
                <div className="text-center">
                    <p className="text-muted-foreground text-sm">Months Left</p>
                    <p className="font-bold">{monthsLeft}</p>
                </div>
            </div>
        </Card>
    );
};


const SavingsGoalOverview: React.FC = () => {
    const [goals, setGoals] = useState<SavingsGoal[]>([]);
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
        try {
            const savedGoals = localStorage.getItem('coinwise_savings_goals');
            if (savedGoals) {
                const loadedGoals: SavingsGoal[] = JSON.parse(savedGoals);
                if (loadedGoals.length > 0) {
                    setGoals(loadedGoals);
                } else {
                     const defaultGoal = {
                        id: 'default-1',
                        name: 'New Laptop Fund',
                        targetAmount: 5000,
                        currentAmount: 1250,
                    };
                    setGoals([defaultGoal]);
                    localStorage.setItem('coinwise_savings_goals', JSON.stringify([defaultGoal]));
                }
            } else {
                 const defaultGoal = {
                    id: 'default-1',
                    name: 'New Laptop Fund',
                    targetAmount: 5000,
                    currentAmount: 1250,
                };
                setGoals([defaultGoal]);
                localStorage.setItem('coinwise_savings_goals', JSON.stringify([defaultGoal]));
            }
        } catch (error) {
            console.error("Failed to load savings goals from localStorage", error);
        }
    }, []);

    if (!isClient) {
        return (
             <Card className="p-6 rounded-2xl shadow-lg bg-card">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                       <Target className="w-6 h-6 text-primary"/>
                    </div>
                    <h3 className="text-lg font-semibold">Savings Goals</h3>
                </div>
                <div className="text-center text-muted-foreground py-8">
                    <p>Loading savings goals...</p>
                </div>
            </Card>
        )
    }

    if (goals.length === 0) {
         return (
             <Card className="p-6 rounded-2xl shadow-lg bg-card">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                       <Target className="w-6 h-6 text-primary"/>
                    </div>
                    <h3 className="text-lg font-semibold">Savings Goals</h3>
                </div>
                <div className="text-center text-muted-foreground py-8">
                    <p>No savings goals yet.</p>
                    <Button asChild variant="link">
                        <Link href="/savings">Create a Goal</Link>
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-6 rounded-2xl shadow-lg bg-card flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                   <Target className="w-6 h-6 text-primary"/>
                </div>
                <h3 className="text-lg font-semibold">Savings Goals</h3>
            </div>
            
            <Carousel className="flex-grow">
                <CarouselContent>
                    {goals.map(goal => (
                        <CarouselItem key={goal.id}>
                            <SavingsGoalCard goal={goal} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {goals.length > 1 && (
                    <>
                        <CarouselPrevious className="left-[-1rem] sm:left-[-0.5rem]" />
                        <CarouselNext className="right-[-1rem] sm:right-[-0.5rem]" />
                    </>
                )}
            </Carousel>
           

            <Button variant="outline" className="w-full mt-6" asChild>
                <Link href="/savings">
                    <Target className="w-4 h-4 mr-2"/>
                    Manage Goals
                </Link>
            </Button>
        </Card>
    );
}

export default SavingsGoalOverview;
