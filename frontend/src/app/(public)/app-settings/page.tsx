
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AppSettingsPage() {
    return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">App Settings</CardTitle>
                    <CardDescription className="text-center">Coming Soon!</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        This page is under construction.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
