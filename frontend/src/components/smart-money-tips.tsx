"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Utensils, BookOpen, TicketPercent, ChevronRight, IndianRupee, QrCode } from 'lucide-react';
import { Badge } from './ui/badge';
import Link from 'next/link';

const tips = [
    {
        icon: Utensils,
        title: "Cook in Hostel Kitchen",
        description: "Cooking 2-3 meals per week can save significantly on mess bills.",
        linkText: "Get Recipes",
        savings: 400
    },
    {
        icon: BookOpen,
        title: "Share Textbooks",
        description: "Form study groups and share expensive textbooks with classmates.",
        linkText: "Find Study Group",
        savings: 800
    },
    {
        icon: TicketPercent,
        title: "Student Discounts",
        description: "Use your student ID for discounts on apps, software, and transport.",
        linkText: "Browse Offers",
        savings: 300
    }
];

const TipCard: React.FC<typeof tips[0]> = ({ icon: Icon, title, description, linkText, savings }) => {
    return (
        <Card className="p-4 bg-amber-50/50 border-amber-200/80 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-100/80 p-2 rounded-lg">
                       <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="font-bold text-base">{title}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 flex items-center">
                    Save <IndianRupee className="w-3.5 h-3.5 mx-0.5" />{savings}
                </Badge>
            </div>
            <p className="text-sm text-muted-foreground pl-11">{description}</p>
            <a href="#" className="text-sm font-semibold text-primary pl-11 flex items-center gap-1 group">
                {linkText} <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
        </Card>
    )
}

export default function SmartMoneyTips() {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Smart Money Tips</h2>
            </div>

            <Card className="p-6 rounded-2xl shadow-lg bg-card space-y-4">
                <div className="flex items-center gap-3">
                     <div className="bg-primary/10 p-3 rounded-lg">
                       <Lightbulb className="w-6 h-6 text-primary"/>
                    </div>
                    <h3 className="text-lg font-semibold">Money-Saving Tips</h3>
                </div>

                <div className="space-y-3">
                    {tips.map(tip => <TipCard key={tip.title} {...tip} />)}
                </div>
                
                <Button variant="outline" className="w-full">View All Tips</Button>
            </Card>
        </div>
    )
}
