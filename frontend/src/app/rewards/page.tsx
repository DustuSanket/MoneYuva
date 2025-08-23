
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gift, Menu, Star, IndianRupee, CreditCard, ChevronRight, TrendingUp, PiggyBank, Target as TargetIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { SettingsSheet } from '@/components/settings-sheet';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const RewardsPageHeader: React.FC = () => (
    <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b">
        <div className="container mx-auto flex items-center h-20 px-4">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </Button>
            <h1 className="text-xl font-bold ml-2">Points & Rewards</h1>
            <div className="flex-1" />
            <SettingsSheet>
                 <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                </Button>
            </SettingsSheet>
        </div>
    </header>
);

const rewards = [
    {
        title: "50 Cashback",
        description: "Direct wallet credit",
        points: 500,
        icon: IndianRupee,
        claimable: true
    },
    {
        title: "100 Food Voucher",
        description: "Zomato/Swiggy credit",
        points: 800,
        icon: Gift,
        claimable: true
    },
    {
        title: "200 Shopping Credit",
        description: "Amazon/Flipkart voucher",
        points: 1500,
        icon: Star,
        claimable: true
    },
    {
        title: "500 Cashback",
        description: "Direct wallet credit",
        points: 3000,
        icon: IndianRupee,
        claimable: false
    }
];

const waysToEarn = [
    {
        title: "Make timely payments",
        description: "Pay bills and fees on time",
        points: "10-50 pts",
        icon: CreditCard,
    },
    {
        title: "Save money monthly",
        description: "Add to your savings goal",
        points: "5 pts per 50",
        icon: PiggyBank,
    },
    {
        title: "Use merchant payments",
        description: "Track your expenses",
        points: "1 pt per 200",
        icon: CreditCard,
    },
    {
        title: "Complete budget goals",
        description: "Stay within monthly budget",
        points: "50-100 pts",
        icon: TargetIcon,
    },
];

const recentEarnings = [
    {
        title: "Saved 200 on food",
        date: "Today",
        points: 20
    },
    {
        title: "Completed budget goal",
        date: "Yesterday",
        points: 50
    },
    {
        title: "Used student discount",
        date: "2 days ago",
        points: 15
    }
];

export default function RewardsPage() {
    const totalPoints = 1850;
    const nextRewardThreshold = 2500;
    const progressToNext = (totalPoints / nextRewardThreshold) * 100;
    const pointsNeeded = nextRewardThreshold - totalPoints;
    const earnedThisMonth = 340;

  return (
    <div className="bg-gray-50 min-h-screen">
        <RewardsPageHeader />
        <main className="p-4 space-y-6">
            <Card className="shadow-lg p-6">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="flex items-center gap-2 text-md font-semibold">
                        <Star className="text-yellow-500 w-5 h-5" /> Your Points
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-center">
                    <p className="text-5xl font-bold">{totalPoints.toLocaleString()}</p>
                    <p className="text-muted-foreground text-sm">Total Points Available</p>
                    
                    <div className="mt-6 text-left">
                        <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                            <span>Progress to next reward</span>
                            <span>{pointsNeeded} points needed</span>
                        </div>
                        <Progress value={progressToNext} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center bg-green-50 text-green-700 p-2 rounded-lg mt-4 text-sm">
                        <span>Earned this month</span>
                        <span className="font-bold">+{earnedThisMonth} pts</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg p-6">
                 <CardHeader className="p-0 mb-4">
                    <CardTitle className="flex items-center gap-2 text-md font-semibold">
                        <Gift className="text-primary w-5 h-5"/> Available Rewards
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                    {rewards.map((reward, index) => (
                      <Card key={index} className="flex items-center justify-between p-4 bg-green-50/50 border-green-200/50">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg">
                            <reward.icon className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold flex items-center">
                                {reward.title.includes('Cashback') || reward.title.includes('Credit') || reward.title.includes('Voucher') ?
                                    <><IndianRupee className="w-4 h-4 mr-1" /> {reward.title}</>
                                    : reward.title
                                }
                            </p>
                            <p className="text-sm text-muted-foreground">{reward.description}</p>
                          </div>
                        </div>
                        <Button disabled={!reward.claimable}>
                          <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">{reward.points}</Badge>
                          Claim
                        </Button>
                      </Card>
                    ))}
                </CardContent>
            </Card>

            <Card className="shadow-lg p-6">
                 <CardHeader className="p-0 mb-4">
                    <CardTitle className="flex items-center gap-2 text-md font-semibold">
                        <Star className="text-yellow-500 w-5 h-5" /> Earn More Points
                    </CardTitle>
                </CardHeader>
                 <CardContent className="p-0 space-y-3">
                    {waysToEarn.map((way, index) => (
                      <Card key={index} className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-secondary">
                                <way.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">{way.title}</p>
                                <p className="text-sm text-muted-foreground flex items-center">
                                    {way.description.includes('per') ? 
                                        <>
                                            {way.description.split('per ')[0]} per <IndianRupee className="w-3 h-3 mx-0.5" /> {way.description.split('per ')[1]}
                                        </> 
                                        : way.description
                                    }
                                </p>
                            </div>
                        </div>
                        <Badge variant="outline">{way.points}</Badge>
                      </Card>
                    ))}
                </CardContent>
            </Card>
            
            <Card className="shadow-lg p-6">
                 <CardHeader className="p-0 mb-4">
                    <CardTitle className="flex items-center gap-2 text-md font-semibold">
                        <TrendingUp className="text-primary w-5 h-5"/> Recent Point Earnings
                    </CardTitle>
                </CardHeader>
                 <CardContent className="p-0 space-y-4">
                    {recentEarnings.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold flex items-center">
                            {item.title.includes('Saved') ?
                                <>Saved <IndianRupee className="w-4 h-4 mx-1" /> {item.title.split(' ')[1]} on food</>
                                : item.title
                            }
                          </p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                        <p className="font-bold text-green-600">+{item.points} pts</p>
                      </div>
                    ))}
                </CardContent>
            </Card>

        </main>
    </div>
  );
}


