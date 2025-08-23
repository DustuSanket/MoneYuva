
"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Star, User, HelpCircle, LogOut, Wallet, ChevronRight, Bell, Shield, Download, FileText, Menu, IndianRupee, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
    { href: "/wallet", label: "Wallet & Passbook", description: "View balance & transactions", icon: Wallet },
    { href: "/rewards", label: "Points & Rewards", description: "Redeem your points", icon: Star, points: 1850 },
    { href: "/notifications", label: "Notifications", description: "Manage alerts & reminders", icon: Bell },
    { href: "/security", label: "Security & Privacy", description: "Account security settings", icon: Shield },
    { href: "/payment-methods", label: "Payment Methods", description: "Manage UPI & cards", icon: FileText },
    { href: "/export-data", label: "Export Data", description: "Download statements", icon: Download },
    { href: "/profile", label: "Profile Settings", description: "Edit personal info", icon: User },
    { href: "/recently-deleted", label: "Recently Deleted", description: "Restore deleted items", icon: Trash2 },
];

export function SettingsSheet({ children }: { children?: React.ReactNode }) {
  const [isGuest, setIsGuest] = useState(false);
  
  useEffect(() => {
    try {
        const guest = localStorage.getItem('coinwise_guest');
        setIsGuest(!!guest);
    } catch (error) {
        console.error("Failed to check guest status", error);
    }
  }, []);


  const trigger = children ? (
    <SheetTrigger asChild>{children}</SheetTrigger>
  ) : (
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon">
        <Menu className="w-6 h-6" />
      </Button>
    </SheetTrigger>
  );

  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = () => {
    try {
      localStorage.removeItem('coinwise_authenticated');
      localStorage.removeItem('coinwise_guest');
      toast({
        title: "Signed Out",
        description: "You have been successfully logged out."
      });
      router.push('/login');
    } catch (error) {
      console.error("Failed to sign out", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not sign out. Please try again."
      })
    }
  };
  
  const handleSignIn = () => {
    try {
      localStorage.removeItem('coinwise_guest');
      router.push('/login');
    } catch (error) {
        console.error("Failed to redirect to login", error);
    }
  }

  return (
    <Sheet>
      {trigger}
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-4">
             <Avatar className="w-16 h-16">
                <AvatarImage src="https://placehold.co/80x80.png" alt={isGuest ? "Guest User" : "Arjun Kumar"} data-ai-hint="male avatar" />
                <AvatarFallback>{isGuest ? "G" : "AK"}</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="text-xl font-bold">{isGuest ? "Guest User" : "Arjun Kumar"}</h2>
                <p className="text-sm text-muted-foreground">{isGuest ? "Exploring the app" : "B.Tech Student"}</p>
                 {!isGuest && <p className="text-sm text-muted-foreground">arjun.kumar@college.edu</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
                <Link href="/wallet">
                    <Card small title="Wallet" icon={Wallet} value="12,500" className="bg-green-100/50 text-green-800" />
                </Link>
                 <Link href="/rewards">
                    <Card small title="Points" icon={Star} value="1,850" className="bg-yellow-100/50 text-yellow-800" />
                 </Link>
          </div>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto py-2">
            <nav className="flex flex-col gap-1 px-4">
                {menuItems.map(item => (
                    <SheetClose asChild key={item.href}>
                        <Link href={item.href}>
                            <div className="flex items-center p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                                <item.icon className="w-5 h-5 mr-4 text-muted-foreground" />
                                <div className="flex-grow">
                                    <p className="font-medium">{item.label} {item.points && <Badge variant="secondary">{item.points}</Badge>}</p>
                                    <p className="text-xs text-muted-foreground">{item.description}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground ml-2" />
                            </div>
                        </Link>
                    </SheetClose>
                ))}
            </nav>
        </div>

        <SheetFooter className="p-4 border-t mt-auto bg-gray-50">
            <div className="w-full">
                <SheetClose asChild>
                    <Link href="/support">
                         <div className="flex items-center p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                            <HelpCircle className="w-5 h-5 mr-4 text-muted-foreground" />
                            <span>Help & Support</span>
                         </div>
                    </Link>
                </SheetClose>
                 <SheetClose asChild>
                     <div onClick={isGuest ? handleSignIn : handleSignOut} className="flex items-center p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer text-destructive">
                        <LogOut className="w-5 h-5 mr-4" />
                        <span>{isGuest ? "Sign In / Sign Up" : "Sign Out"}</span>
                     </div>
                </SheetClose>
            </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const Card: React.FC<{
    title: string;
    icon: React.ElementType;
    value: string;
    small?: boolean;
    className?: string;
}> = ({ title, icon: Icon, value, small, className }) => {
    return (
        <div className={`rounded-lg p-3 ${className}`}>
            <div className="flex items-center gap-2 text-sm">
                <Icon className="w-4 h-4" />
                <span>{title}</span>
            </div>
            <p className="text-lg font-bold mt-1 flex items-center">
                {title === 'Wallet' && <IndianRupee className="w-5 h-5 mr-0.5" />}
                {value}
            </p>
        </div>
    )
}

    