"use client";

import FinancialOverview from "@/components/financial-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const API_BASE_URL = "http://localhost:3000/api";

const UnauthenticatedHomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-6">
        <h1 className="text-2xl font-bold">CoinWise</h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
        <div className="space-y-4 max-w-md">
          <h2 className="text-4xl font-bold tracking-tight">
            Smart Budgeting for Student Life
          </h2>
          <p className="text-lg text-muted-foreground">
            Take control of your finances. Track your spending, save money, and
            achieve your goals with CoinWise.
          </p>
        </div>
      </main>
      <footer className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="w-full h-12 text-lg">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-12 text-lg">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default function Home() {
  const [wallet, setWallet] = useState<any | null>(null);
  const [budget, setBudget] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    if (!token || !userId) {
      setWallet(null);
      setBudget(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const walletRes = await axios.get(`${API_BASE_URL}/wallet/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWallet(walletRes.data);

        const budgetRes = await axios.get(
          `${API_BASE_URL}/wallet/budget/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBudget(budgetRes.data);
      } catch (err: any) {
        // Only redirect if unauthorized, otherwise show error
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setWallet(null);
          setBudget(null);
        } else {
          setError("Failed to load data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // If not authenticated, show welcome page
  if (!wallet || !budget) {
    return <UnauthenticatedHomePage />;
  }

  // If wallet fetch failed for other reasons, show error
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">{error}</div>
    );
  }

  // If wallet exists but no balance, show welcome message
  if (wallet.balance === null || wallet.balance === undefined) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <PiggyBank className="w-8 h-8 text-primary" />
              Welcome to CoinWise!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Your wallet is set up, but you have no balance. Please add some
              funds to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show dashboard if authenticated and wallet/budget exist
  return (
    <div className="space-y-8">
      {/* ...dashboard content... */}
    </div>
  );
}
        categories={budget.categories}
      />
    </div>
  );
}
