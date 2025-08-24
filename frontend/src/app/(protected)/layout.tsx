// app/(protected)/layout.tsx

"use client";

import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import SidebarContents from "@/components/sidebar";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import FooterNav from "@/components/footer-nav";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);

  // This hook protects the routes inside this layout
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <html lang="en" className="light">
      <body className="font-body antialiased">
        <div className="flex min-h-screen">
          <div
            className={cn(
              "hidden md:block sticky top-0 h-screen transition-all duration-300 ease-in-out",
              isSidebarExpanded ? "w-64" : "w-20"
            )}
          >
            <SidebarContents
              isExpanded={isSidebarExpanded}
              setExpanded={setSidebarExpanded}
            />
          </div>
          <div className="flex-1 flex flex-col w-full min-w-0">
            <Header />
            <main className="flex-grow bg-gray-50/50 overflow-y-auto">
              <div
                className={cn(
                  "mx-auto w-full max-w-6xl p-4 md:p-6 lg:p-8 pb-24 md:pb-6"
                )}
              >
                {children}
              </div>
            </main>
            <FooterNav />
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
