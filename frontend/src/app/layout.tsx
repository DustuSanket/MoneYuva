
"use client";

import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import SidebarContents from '@/components/sidebar';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import FooterNav from '@/components/footer-nav';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const noNavRoutes = ['/welcome', '/login', '/signup', '/onboarding'];
  const showNav = !noNavRoutes.includes(pathname);
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <html lang="en" className="light">
      <head>
        <title>CoinWise</title>
        <meta name="description" content="Smart budget management for students." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="flex min-h-screen">
            {showNav && (
                <div className={cn("hidden md:block sticky top-0 h-screen transition-all duration-300 ease-in-out", isSidebarExpanded ? "w-64" : "w-20")}>
                    <SidebarContents isExpanded={isSidebarExpanded} setExpanded={setSidebarExpanded} />
                </div>
            )}
            <div className="flex-1 flex flex-col w-full min-w-0">
                {showNav && <Header />}
                <main className="flex-grow bg-gray-50/50 overflow-y-auto">
                   <div className={cn("mx-auto w-full max-w-6xl", showNav && "p-4 md:p-6 lg:p-8 pb-24 md:pb-6")}>
                     {children}
                   </div>
                </main>
                {showNav && <FooterNav />}
            </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
