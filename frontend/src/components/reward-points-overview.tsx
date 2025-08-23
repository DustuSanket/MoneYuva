
"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Gift } from 'lucide-react';
import Link from 'next/link';

const RewardPointsOverview: React.FC = () => {
    const totalPoints = 1850;
    const pointsThisMonth = 340;
    const nextRewardPoints = 650;

    return (
        <Card className="p-6 rounded-2xl shadow-lg bg-card flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                   <Star className="w-6 h-6 text-primary"/>
                </div>
                <h3 className="text-lg font-semibold">Reward Points</h3>
            </div>

            <div className="text-center my-6 flex-grow">
                <p className="text-5xl font-bold flex items-center justify-center gap-2">
                    <Star className="w-10 h-10 text-yellow-400 fill-yellow-400" />
                    {totalPoints.toLocaleString()}
                </p>
                <p className="text-muted-foreground">Total Points</p>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="font-semibold text-green-600">+{pointsThisMonth}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Next Reward</span>
                    <span className="font-semibold">{nextRewardPoints} pts</span>
                </div>
            </div>

            <Button variant="outline" className="w-full mt-6" asChild>
                <Link href="/rewards">
                    <Gift className="w-4 h-4 mr-2"/>
                    View Rewards
                </Link>
            </Button>
        </Card>
    );
}

export default RewardPointsOverview;
