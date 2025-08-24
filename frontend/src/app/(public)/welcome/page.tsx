"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn, User } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/logo";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function WelcomePage() {
  const router = useRouter();
  const { toast } = useToast();

  // This useEffect hook checks for an existing token on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/"); // Redirect to the dashboard if a token exists
    }
  }, [router]);

  const handleGuestAccess = () => {
    try {
      // For now, guest access is a simulated flow
      localStorage.setItem("coinwise_guest", "true");
      toast({
        title: "Welcome, Guest!",
        description:
          "You are exploring the app as a guest. Your data will be stored locally.",
      });
      router.push("/");
    } catch (error) {
      console.error("Failed to set localStorage for guest mode", error);
      toast({
        variant: "destructive",
        title: "Guest Mode Error",
        description: "Could not start guest session. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-6">
        <Logo />
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-md"
        >
          <h1 className="text-4xl font-bold tracking-tight">
            Smart Budgeting for Student Life
          </h1>
          <p className="text-lg text-muted-foreground">
            Take control of your finances. Track your spending, save money, and
            achieve your goals with CoinWise.
          </p>
        </motion.div>
      </main>
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="w-full h-12 text-lg">
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-12 text-lg">
            <Link href="/login">
              <LogIn className="mr-2" /> Log In
            </Link>
          </Button>
        </div>
        <div className="mt-4">
          <Button
            onClick={handleGuestAccess}
            variant="link"
            className="w-full text-muted-foreground"
          >
            <User className="mr-2" /> Continue as Guest
          </Button>
        </div>
      </motion.footer>
    </div>
  );
}
