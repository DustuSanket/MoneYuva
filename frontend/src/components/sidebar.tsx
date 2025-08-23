
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, Target, History, HelpCircle, Menu, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import React from 'react';


const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/qr", label: "Scan & Pay", icon: QrCode },
  { href: "/savings", label: "Savings", icon: Target },
  { href: "/history", label: "History", icon: History },
];

const NavLink: React.FC<{ item: typeof navItems[0]; isExpanded: boolean }> = ({ item, isExpanded }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;
    
    const linkContent = (
         <div
            className={cn(
                "flex items-center p-3 rounded-lg text-sidebar-foreground transition-colors",
                isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "hover:bg-sidebar-accent/50",
                isExpanded ? "justify-start" : "justify-center"
            )}
        >
            <item.icon className="w-6 h-6 shrink-0" />
            {isExpanded && <span className="ml-4 font-medium">{item.label}</span>}
        </div>
    );

    if (isExpanded) {
        return <Link href={item.href}>{linkContent}</Link>
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={item.href}>
                       {linkContent}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{item.label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default function SidebarContents({ isExpanded, setExpanded }: { isExpanded: boolean, setExpanded: (expanded: boolean) => void }) {
  const SupportLink = () => (
     <Link href="/support">
        <div className={cn("flex items-center p-3 rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50", isExpanded ? "justify-start" : "justify-center")}>
            <HelpCircle className="w-6 h-6 shrink-0" />
            {isExpanded && <span className="ml-4 font-medium">Support</span>}
        </div>
    </Link>
  )

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="h-20 flex items-center px-4 justify-between border-b border-sidebar-border">
            {isExpanded && <Logo />}
            <Button variant="ghost" size="icon" onClick={() => setExpanded(!isExpanded)}>
                <Menu className="w-6 h-6" />
            </Button>
        </div>

        <nav className="flex-grow px-2 py-4 space-y-2 flex flex-col">
            {navItems.map((item) => (
                <NavLink key={item.href} item={item} isExpanded={isExpanded} />
            ))}
        </nav>

        <div className="px-2 py-4 border-t border-sidebar-border w-full flex flex-col">
             {isExpanded ? <SupportLink /> : (
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <SupportLink />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Support</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
             )}
        </div>
    </div>
  );
}
