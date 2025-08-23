
"use client";

import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from './ui/button';
import { SettingsSheet } from './settings-sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const getPageTitle = (pathname: string) => {
    switch (pathname) {
        case '/':
            return 'Dashboard';
        case '/budget':
            return 'Budget Management';
        case '/savings':
            return 'Savings Goals';
        case '/history':
            return 'Transaction History';
        case '/profile':
            return 'My Profile';
        case '/notifications':
            return 'Notifications';
        case '/rewards':
            return 'Rewards & Points';
        case '/security':
            return 'Security';
        default:
            return 'Dashboard';
    }
}

export default function Header() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className={cn(
      "flex items-center h-20 px-6 border-b",
      "md:bg-transparent md:border-b-0"
      )}>
        <div className="flex-1">
            <h1 className="text-2xl font-bold hidden md:block">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                <Search className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="/notifications">
                    <Bell className="w-6 h-6" />
                </Link>
            </Button>
            <SettingsSheet>
                <Avatar className="w-10 h-10 cursor-pointer">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="cartoon avatar" />
                    <AvatarFallback>AK</AvatarFallback>
                </Avatar>
            </SettingsSheet>
        </div>
    </header>
  );
}
