"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  IndianRupee,
  Target,
  LayoutGrid,
  DollarSign,
  Check,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const OnboardingStep: React.FC<{
  currentStep: number;
  step: number;
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ currentStep, step, title, description, children }) => {
  if (currentStep !== step) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full max-w-lg"
    >
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
};

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { toast } = useToast();
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [foodBudget, setFoodBudget] = useState("");
  const [transportBudget, setTransportBudget] = useState("");
  const [walletAmount, setWalletAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const nextStep = () => setStep((s) => s + 1);
  const finishOnboarding = () => router.push("/");

  const handleSetGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) throw new Error("User not authenticated");

      await axios.post(
        `${API_BASE_URL}/goals`,
        {
          userId,
          name: goalName,
          targetAmount: parseFloat(goalAmount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: "Goal Set!",
        description: "Great start! You can manage this goal later.",
      });
      nextStep();
    } catch (error) {
      console.error("Failed to set goal", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not set goal.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetCategories = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) throw new Error("User not authenticated");

      await axios.post(
        `${API_BASE_URL}/budget`,
        {
          userId,
          monthlyBudget: parseFloat(monthlyBudget),
          categories: [
            { name: "Food & Mess", amount: parseFloat(foodBudget) },
            { name: "Transport", amount: parseFloat(transportBudget) },
          ],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Categories Defined!",
        description: "Your budget is taking shape.",
      });
      nextStep();
    } catch (error) {
      console.error("Failed to set categories", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not set categories.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) throw new Error("User not authenticated");

      const response = await axios.post(
        `${API_BASE_URL}/wallet/create-order`,
        {
          amount: parseFloat(walletAmount) * 100, // Razorpay amount is in paise
          userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Money Added!",
        description: "You're all set to start managing your finances.",
      });
      finishOnboarding();
    } catch (error) {
      console.error("Failed to add money", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add money.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-lg absolute top-8">
        <Progress value={(step / 3) * 100} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Step {step} of 3</span>
          <button onClick={finishOnboarding} className="hover:underline">
            Skip to Dashboard
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <OnboardingStep
            key="step1"
            currentStep={step}
            step={1}
            title="Set a Savings Goal"
            description="What are you saving up for? (Optional)"
          >
            <form onSubmit={handleSetGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  placeholder="e.g., New Laptop"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-amount">Target Amount</Label>
                <Input
                  id="goal-amount"
                  type="number"
                  placeholder="e.g., 50000"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Set Goal"}
                <ArrowRight className="ml-2" />
              </Button>
            </form>
          </OnboardingStep>
        )}

        {step === 2 && (
          <OnboardingStep
            key="step2"
            currentStep={step}
            step={2}
            title="Set Spending Categories"
            description="Allocate your monthly funds. (Optional)"
          >
            <form onSubmit={handleSetCategories} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthly-budget">
                  Your Total Monthly Budget
                </Label>
                <Input
                  id="monthly-budget"
                  type="number"
                  placeholder="e.g., 10000"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                />
              </div>
              <p className="font-medium text-sm">Example Categories:</p>
              <div className="space-y-2">
                <Label htmlFor="food-category">Food & Mess</Label>
                <Input
                  id="food-category"
                  type="number"
                  placeholder="e.g., 3000"
                  value={foodBudget}
                  onChange={(e) => setFoodBudget(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transport-category">Transport</Label>
                <Input
                  id="transport-category"
                  type="number"
                  placeholder="e.g., 1000"
                  value={transportBudget}
                  onChange={(e) => setTransportBudget(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Categories"}
                <ArrowRight className="ml-2" />
              </Button>
            </form>
          </OnboardingStep>
        )}

        {step === 3 && (
          <OnboardingStep
            key="step3"
            currentStep={step}
            step={3}
            title="Add Initial Money"
            description="Add some funds to your wallet to get started. (Optional)"
          >
            <form onSubmit={handleAddMoney} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallet-amount">Amount to Add</Label>
                <Input
                  id="wallet-amount"
                  type="number"
                  placeholder="e.g., 5000"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : "Pay Now"}
              </Button>
            </form>
          </OnboardingStep>
        )}
      </AnimatePresence>
    </div>
  );
}
