"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  IndianRupee,
  Eye,
  PlusCircle,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Search,
  Filter,
  Download,
  UtensilsCrossed,
  Car,
  ChevronRight,
  Menu,
  Sparkles,
  Wallet as WalletIcon,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Category } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  createdAt: string;
  type: "debit" | "credit";
  icon?: React.ElementType;
}

const API_BASE_URL = "http://localhost:3000/api";

const getCategoryIcon = (name: string): React.ElementType => {
  const lowerCaseName = name.toLowerCase();
  if (lowerCaseName.includes("food") || lowerCaseName.includes("mess"))
    return UtensilsCrossed;
  if (lowerCaseName.includes("transport") || lowerCaseName.includes("bus"))
    return Car;
  return PlusCircle;
};

const WalletHeader = () => (
  <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b">
    <div className="container mx-auto flex items-center h-20 px-4">
      <Button variant="ghost" size="icon" asChild>
        <Link href="/">
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </Button>
      <h1 className="text-xl font-bold ml-2">Wallet</h1>
      <div className="flex-1" />
      <Button variant="ghost" size="icon">
        <Menu className="w-6 h-6" />
      </Button>
    </div>
  </header>
);

const AddMoneyDialog: React.FC<{
  onAddMoney: (amount: number, source: string, description?: string) => void;
  children: React.ReactNode;
}> = ({ onAddMoney, children }) => {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Your backend uses Razorpay, so this should call the create-order endpoint
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) throw new Error("User not authenticated");

      const response = await axios.post(
        `${API_BASE_URL}/wallet/create-order`,
        {
          amount: parseFloat(amount) * 100,
          userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Here, you would integrate the Razorpay frontend SDK
      // For now, we'll assume success and call the onAddMoney function
      onAddMoney(parseFloat(amount), source, description);
      setAmount("");
      setSource("");
      setDescription("");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Failed to add money:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message || "Could not process payment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Money to Wallet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center">
              Amount (<IndianRupee className="w-3.5 h-3.5 mx-1" />)
            </Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              placeholder="Enter amount"
              required
              min="1"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., Parents, Scholarship, Job"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this money for?"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="flex items-center"
              disabled={loading}
            >
              {loading ? "Processing..." : `Add Money`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RequestMoneyDialog: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [amount, setAmount] = useState("");
  const [requestFrom, setRequestFrom] = useState("");
  const [contact, setContact] = useState("");
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // You need to create a backend route for this (e.g., POST /api/requests)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "Request Sent!",
        description: (
          <div className="flex items-center">
            A request for <IndianRupee className="w-3.5 h-3.5 mx-1" />
            {amount} has been sent to {requestFrom}.
          </div>
        ),
      });
      setAmount("");
      setRequestFrom("");
      setContact("");
      setReason("");
      setIsOpen(false);
    } catch (error) {
      console.error("Request failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send request.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Money</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="request-amount" className="flex items-center">
              Amount (<IndianRupee className="w-3.5 h-3.5 mx-1" />)
            </Label>
            <Input
              id="request-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              placeholder="Enter amount"
              required
              min="1"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="request-from">Request From</Label>
            <Input
              id="request-from"
              value={requestFrom}
              onChange={(e) => setRequestFrom(e.target.value)}
              placeholder="e.g., Mom, Dad, Brother"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="request-contact">Contact (Phone/Email)</Label>
            <Input
              id="request-contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone number or email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="request-reason">Reason (Optional)</Label>
            <Textarea
              id="request-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="What do you need money for?"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : `Send Request for ₹${amount || "0"}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function WalletPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchWalletData = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/wallet/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWalletBalance(response.data.balance);
      setTransactions(response.data.transactions);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch wallet data", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [router]);

  const moneyIn = transactions.reduce(
    (sum, tx) => (tx.type === "credit" ? sum + tx.amount : sum),
    0
  );
  const moneyOut = transactions.reduce(
    (sum, tx) => (tx.type === "debit" ? sum + tx.amount : sum),
    0
  );

  const handleAddMoney = async (
    amount: number,
    source: string,
    description?: string
  ) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    try {
      // Call the create-order endpoint
      const orderResponse = await axios.post(
        `${API_BASE_URL}/wallet/create-order`,
        { amount: amount * 100, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // --- Integrate Razorpay Frontend SDK here ---
      // For now, we'll assume success and call the verify-payment route
      const paymentId = `pay_${Date.now()}`;
      const signature = `sig_${Date.now()}`;
      const verifyResponse = await axios.post(
        `${API_BASE_URL}/wallet/verify-payment`,
        {
          orderId: orderResponse.data.id,
          paymentId,
          signature,
          amount,
          userId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Money Added!",
        description: `₹${amount.toFixed(2)} has been added to your wallet.`,
      });
      fetchWalletData(); // Refresh data from backend
    } catch (error: any) {
      console.error("Failed to add money:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message || "Could not process payment.",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  const allTxs = transactions;
  const incomeTxs = transactions.filter((tx) => tx.type === "credit");
  const expenseTxs = transactions.filter((tx) => tx.type === "debit");

  const renderTransaction = (tx: Transaction) => (
    <Card key={tx._id} className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-full ${
            tx.type === "debit" ? "bg-red-100/50" : "bg-green-100/50"
          }`}
        >
          <PlusCircle
            className={`w-6 h-6 ${
              tx.type === "debit" ? "text-red-600" : "text-green-600"
            }`}
          />
        </div>
        <div>
          <p className="font-bold">{tx.description}</p>
          <p className="text-sm text-muted-foreground">
            {tx.type} &bull; {new Date(tx.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <p
        className={`font-bold text-lg flex items-center ${
          tx.type === "debit" ? "text-destructive" : "text-green-600"
        }`}
      >
        {tx.type === "debit" ? "-" : "+"}
        <IndianRupee className="w-4 h-4" />
        {tx.amount.toFixed(2)}
      </p>
    </Card>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <WalletHeader />
      <main className="p-4 space-y-6">
        <Card className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <WalletIcon className="w-5 h-5" />
                </div>
                Student Wallet
              </p>
              <p className="font-semibold text-lg">Arjun Kumar</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white"
            >
              <Eye className="w-5 h-5" />
            </Button>
          </div>
          <div className="mt-4">
            <p className="text-sm opacity-80">Available Balance</p>
            <p className="text-4xl font-bold flex items-center">
              <IndianRupee className="w-8 h-8" />
              {walletBalance.toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between items-center mt-4 text-xs opacity-80">
            <p className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Premium Student Account
            </p>
            <p>Updated now</p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <AddMoneyDialog onAddMoney={handleAddMoney}>
            <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 bg-green-50 border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
              <PlusCircle className="w-8 h-8 text-green-600" />
              <p className="font-semibold">Add Money</p>
              <p className="text-xs text-muted-foreground">
                Add funds to wallet
              </p>
            </Card>
          </AddMoneyDialog>
          <RequestMoneyDialog>
            <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
              <Users className="w-8 h-8 text-blue-600" />
              <p className="font-semibold">Request Money</p>
              <p className="text-xs text-muted-foreground">Ask for money</p>
            </Card>
          </RequestMoneyDialog>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <Card className="p-3 bg-green-50 border-green-200">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              Money In
            </p>
            <p className="font-bold text-lg flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
              {moneyIn.toFixed(2)}
            </p>
          </Card>
          <Card className="p-3 bg-red-50 border-red-200">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <ArrowDownLeft className="w-4 h-4 text-red-600" />
              Money Out
            </p>
            <p className="font-bold text-lg flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
              {moneyOut.toFixed(2)}
            </p>
          </Card>
          <Card className="p-3 bg-blue-50 border-blue-200">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Net Flow
            </p>
            <p className="font-bold text-lg flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
              {(moneyIn - moneyOut).toFixed(2)}
            </p>
          </Card>
        </div>

        <div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search transactions..." className="pl-10" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button variant="ghost" size="icon">
                <Filter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="savings">Savings</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="space-y-3 mt-4">
                {allTxs.length > 0 ? (
                  allTxs.map(renderTransaction)
                ) : (
                  <p className="text-center text-muted-foreground p-8">
                    No transactions yet.
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="income">
              <div className="space-y-3 mt-4">
                {incomeTxs.length > 0 ? (
                  incomeTxs.map(renderTransaction)
                ) : (
                  <p className="text-center text-muted-foreground p-8">
                    No income recorded yet.
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="expenses">
              <div className="space-y-3 mt-4">
                {expenseTxs.length > 0 ? (
                  expenseTxs.map(renderTransaction)
                ) : (
                  <p className="text-center text-muted-foreground p-8">
                    No expenses recorded yet.
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="savings">
              <div className="space-y-3 mt-4">
                {/* Savings transactions will go here */}
                <p className="text-center text-muted-foreground p-8">
                  Coming Soon!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
