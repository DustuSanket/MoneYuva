
"use client";

import Link from 'next/link';
import { Home, Clock, Target, Receipt, QrCode } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/budget", label: "Budget", icon: Clock },
  { href: "/savings", label: "Savings", icon: Target },
  { href: "/history", label: "History", icon: Receipt },
];

export default function FooterNav() {
  const pathname = usePathname();

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm z-50 border-t">
      <div className="container mx-auto h-20 grid grid-cols-5 items-center text-center gap-2 px-2">
        <NavItem item={navItems[0]} isActive={pathname === navItems[0].href} />
        <NavItem item={navItems[1]} isActive={pathname === navItems[1].href} />
        
        <div className="flex justify-center items-center h-full">
          <Button asChild className="w-16 h-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground -mt-8 flex flex-col items-center justify-center gap-1">
            <Link href="/qr">
                <QrCode className="w-7 h-7" />
                <span className="text-xs font-bold">Pay</span>
            </Link>
          </Button>
        </div>

        <NavItem item={navItems[2]} isActive={pathname === navItems[2].href} />
        <NavItem item={navItems[3]} isActive={pathname === navItems[3].href} />
      </div>
    </footer>
  );
}


const NavItem: React.FC<{ item: typeof navItems[0]; isActive: boolean }> = ({ item, isActive }) => (
    <Link href={item.href} className="flex flex-col items-center justify-center h-full">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-1 w-full h-full",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        <item.icon className="w-6 h-6" />
        <span className="text-xs">{item.label}</span>
      </div>
    </Link>
)
