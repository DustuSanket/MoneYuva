
"use client";

import React from 'react';
import type { Category } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SpendingBreakdownProps {
    categories: Category[];
    totalSpent: number;
    totalAllocated: number;
}

const CategoryRow: React.FC<{category: Category}> = ({ category }) => {
    const progress = category.allocated > 0 ? (category.spent / category.allocated) * 100 : 0;
    return (
        <div className="flex items-center justify-between py-3 border-b last:border-b-0">
            <div>
                <p className="font-semibold">{category.name}</p>
                <Progress value={progress} className="h-1.5 mt-1 w-32" />
            </div>
            <div className="text-right">
                <p className="font-bold text-sm flex items-center justify-end">
                    <IndianRupee className="w-3 h-3" />
                    {category.spent.toLocaleString()} / 
                    <IndianRupee className="w-3 h-3 ml-1" />
                    {category.allocated.toLocaleString()}
                </p>
            </div>
        </div>
    )
}


export default function SpendingBreakdown({ categories, totalSpent, totalAllocated }: SpendingBreakdownProps) {
    const overallProgress = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

    return (
        <Card className="p-6 rounded-2xl shadow-lg bg-card">
             <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <h3 className="text-lg font-semibold">Spending Breakdown</h3>
            </div>
            
            <div className="space-y-2 my-6">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Total Budget</span>
                    <span className="font-semibold text-foreground flex items-center"><IndianRupee className="w-4 h-4" />{totalAllocated.toLocaleString()}</span>
                </div>
                 <Progress value={overallProgress} className="h-2" />
                 <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Spent</span>
                    <span className="font-semibold text-foreground flex items-center"><IndianRupee className="w-4 h-4" />{totalSpent.toLocaleString()}</span>
                </div>
            </div>

            <div>
                <h4 className="font-semibold mb-2">Categories</h4>
                {categories.length > 0 ? (
                    categories.map(cat => <CategoryRow key={cat.id} category={cat} />)
                ) : (
                     <p className="text-muted-foreground text-center py-4">No spending categories yet.</p>
                )}
            </div>

        </Card>
    );
}
