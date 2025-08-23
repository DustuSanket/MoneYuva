
"use client";

import React, { useState, useEffect } from 'react';
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
  Send
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Category } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';


interface Transaction {
  id: string;
  category: string;
  description: string;
  amount: number;
  time: string;
  type: 'expense' | 'income';
  icon: React.ElementType;
}

const getCategoryIcon = (name: string): React.ElementType => {
  const lowerCaseName = name.toLowerCase();
  if (lowerCaseName.includes('food') || lowerCaseName.includes('mess')) return UtensilsCrossed;
  if (lowerCaseName.includes('transport') || lowerCaseName.includes('bus')) return Car;
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
)

const AddMoneyDialog: React.FC<{onAddMoney: (amount: number, source: string, description?: string) => void, children: React.ReactNode}> = ({ onAddMoney, children }) => {
    const [amount, setAmount] = useState('');
    const [source, setSource] = useState('');
    const [description, setDescription] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddMoney(parseFloat(amount), source, description);
        setAmount('');
        setSource('');
        setDescription('');
        setIsOpen(false);
    }

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
                        <Label htmlFor="amount" className="flex items-center">Amount (<IndianRupee className="w-3.5 h-3.5 mx-1" />)</Label>
                        <Input 
                            id="amount" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
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
                            onChange={e => setSource(e.target.value)} 
                            placeholder="e.g., Parents, Scholarship, Job" 
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="What is this money for?"
                        />
                    </div>
                    <DialogFooter>
                         <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                         </DialogClose>
                        <Button type="submit" className="flex items-center">Add <IndianRupee className="w-4 h-4 mx-1" />{amount || 0} to Wallet</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const RequestMoneyDialog: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [amount, setAmount] = useState('');
    const [requestFrom, setRequestFrom] = useState('');
    const [contact, setContact] = useState('');
    const [reason, setReason] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle the request, e.g., send a notification or API call.
        // For this demo, we'll just show a toast.
        toast({
            title: "Request Sent!",
            description: <div className="flex items-center">A request for <IndianRupee className="w-3.5 h-3.5 mx-1" />{amount} has been sent to {requestFrom}.</div>,
        });
        setAmount('');
        setRequestFrom('');
        setContact('');
        setReason('');
        setIsOpen(false);
    }

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
                        <Label htmlFor="request-amount" className="flex items-center">Amount (<IndianRupee className="w-3.5 h-3.5 mx-1" />)</Label>
                        <Input 
                            id="request-amount" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
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
                            onChange={e => setRequestFrom(e.target.value)} 
                            placeholder="e.g., Mom, Dad, Brother" 
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="request-contact">Contact (Phone/Email)</Label>
                        <Input 
                            id="request-contact" 
                            value={contact} 
                            onChange={e => setContact(e.target.value)} 
                            placeholder="Phone number or email" 
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="request-reason">Reason (Optional)</Label>
                        <Textarea
                            id="request-reason"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="What do you need money for?"
                        />
                    </div>
                    <DialogFooter>
                         <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                         </DialogClose>
                        <Button type="submit">
                           <Send className="w-4 h-4 mr-2" /> Send Request for <IndianRupee className="w-4 h-4 mx-1" />{amount || '0'}
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
    const { toast } = useToast();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    useEffect(() => {
        if (isClient) {
            try {
              const savedBalance = localStorage.getItem('coinwise_wallet_balance');
              if (savedBalance) {
                setWalletBalance(JSON.parse(savedBalance));
              } else {
                setWalletBalance(12500); // Default initial balance
              }

              const savedCategories = localStorage.getItem('coinwise_categories');
              const savedTransactions = localStorage.getItem('coinwise_wallet_transactions');
              
              let loadedTransactions: Transaction[] = [];

              if (savedTransactions) {
                  loadedTransactions = JSON.parse(savedTransactions).map((tx: any) => ({...tx, icon: getCategoryIcon(tx.category)}));
              }

              if (savedCategories) {
                const cats: Omit<Category, 'icon'>[] = JSON.parse(savedCategories);
                
                cats.forEach(cat => {
                    if (cat.spent > 0) {
                         const existingTx = loadedTransactions.find(tx => tx.id === `exp-${cat.id}`);
                         if (existingTx) {
                            existingTx.amount = cat.spent;
                         } else {
                            loadedTransactions.push({
                                id: `exp-${cat.id}`,
                                category: cat.name,
                                description: `Spent on ${cat.name}`,
                                amount: cat.spent,
                                time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
                                type: 'expense',
                                icon: getCategoryIcon(cat.name)
                            });
                         }
                    }
                });
              }
              
              setTransactions(loadedTransactions);

            } catch (error) {
              console.error("Failed to load from localStorage", error);
            }
        }
    }, [isClient]);

    useEffect(() => {
        if(isClient) {
            try {
                localStorage.setItem('coinwise_wallet_balance', JSON.stringify(walletBalance));
                const txToSave = transactions.map(({icon, ...rest}) => rest);
                localStorage.setItem('coinwise_wallet_transactions', JSON.stringify(txToSave));
            } catch (error) {
                 console.error("Failed to save to localStorage", error);
            }
        }
    }, [walletBalance, transactions, isClient]);

    const moneyIn = transactions.reduce((sum, tx) => tx.type === 'income' ? sum + tx.amount : sum, 0);
    const moneyOut = transactions.reduce((sum, tx) => tx.type === 'expense' ? sum + tx.amount : sum, 0);

    const handleAddMoney = (amount: number, source: string, description?: string) => {
        setWalletBalance(prev => prev + amount);
        const newTransaction: Transaction = {
            id: `income-${Date.now()}`,
            category: source,
            description: description || `Added money from ${source}`,
            amount: amount,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
            type: 'income',
            icon: PlusCircle,
        };
        setTransactions(prev => [newTransaction, ...prev]);
        toast({
            title: "Money Added!",
            description: <div className="flex items-center"><IndianRupee className="w-4 h-4 mr-1" />{amount.toFixed(2)} has been added to your wallet from {source}.</div>,
        });
    };

    if (!isClient) return null;

    const allTxs = transactions;
    const incomeTxs = transactions.filter(tx => tx.type === 'income');
    const expenseTxs = transactions.filter(tx => tx.type === 'expense');

    const renderTransaction = (tx: Transaction) => (
         <Card key={tx.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${tx.type === 'expense' ? 'bg-red-100/50' : 'bg-green-100/50'}`}>
                    <tx.icon className={`w-6 h-6 ${tx.type === 'expense' ? 'text-red-600' : 'text-green-600'}`} />
                </div>
                <div>
                    <p className="font-bold">{tx.category}</p>
                    <p className="text-sm text-muted-foreground">
                        {tx.description} &bull; Today, {tx.time}
                    </p>
                </div>
            </div>
            <p className={`font-bold text-lg flex items-center ${tx.type === 'expense' ? 'text-destructive' : 'text-green-600'}`}>
                {tx.type === 'expense' ? '-' : '+'}
                <IndianRupee className="w-4 h-4"/>{tx.amount.toFixed(2)}
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
                            <p className="flex items-center gap-2"><div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><WalletIcon className="w-5 h-5"/></div>Student Wallet</p>
                            <p className="font-semibold text-lg">Arjun Kumar</p>
                        </div>
                        <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                            <Eye className="w-5 h-5" />
                        </Button>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm opacity-80">Available Balance</p>
                        <p className="text-4xl font-bold flex items-center"><IndianRupee className="w-8 h-8"/>{walletBalance.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4 text-xs opacity-80">
                         <p className="flex items-center gap-1"><Sparkles className="w-4 h-4"/>Premium Student Account</p>
                         <p>Updated now</p>
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <AddMoneyDialog onAddMoney={handleAddMoney}>
                        <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 bg-green-50 border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
                             <PlusCircle className="w-8 h-8 text-green-600"/>
                             <p className="font-semibold">Add Money</p>
                             <p className="text-xs text-muted-foreground">Add funds to wallet</p>
                        </Card>
                    </AddMoneyDialog>
                     <RequestMoneyDialog>
                         <Card className="p-4 flex flex-col items-center justify-center text-center gap-2 bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
                             <Users className="w-8 h-8 text-blue-600"/>
                             <p className="font-semibold">Request Money</p>
                             <p className="text-xs text-muted-foreground">Ask for money</p>
                        </Card>
                    </RequestMoneyDialog>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <Card className="p-3 bg-green-50 border-green-200">
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><ArrowUpRight className="w-4 h-4 text-green-600"/>Money In</p>
                        <p className="font-bold text-lg flex items-center justify-center"><IndianRupee className="w-4 h-4"/>{moneyIn.toFixed(2)}</p>
                    </Card>
                     <Card className="p-3 bg-red-50 border-red-200">
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><ArrowDownLeft className="w-4 h-4 text-red-600"/>Money Out</p>
                        <p className="font-bold text-lg flex items-center justify-center"><IndianRupee className="w-4 h-4"/>{moneyOut.toFixed(2)}</p>
                    </Card>
                     <Card className="p-3 bg-blue-50 border-blue-200">
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><TrendingUp className="w-4 h-4 text-blue-600"/>Net Flow</p>
                        <p className="font-bold text-lg flex items-center justify-center"><IndianRupee className="w-4 h-4"/>{(moneyIn - moneyOut).toFixed(2)}</p>
                    </Card>
                </div>
                
                <div>
                     <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input placeholder="Search transactions..." className="pl-10"/>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <Button variant="ghost" size="icon"><Filter className="w-5 h-5"/></Button>
                            <Button variant="ghost" size="icon"><Download className="w-5 h-5"/></Button>
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
                                {allTxs.length > 0 ? allTxs.map(renderTransaction) : <p className="text-center text-muted-foreground p-8">No transactions yet.</p>}
                            </div>
                        </TabsContent>
                         <TabsContent value="income">
                             <div className="space-y-3 mt-4">
                                {incomeTxs.length > 0 ? incomeTxs.map(renderTransaction) : <p className="text-center text-muted-foreground p-8">No income recorded yet.</p>}
                            </div>
                        </TabsContent>
                        <TabsContent value="expenses">
                             <div className="space-y-3 mt-4">
                                {expenseTxs.length > 0 ? expenseTxs.map(renderTransaction) : <p className="text-center text-muted-foreground p-8">No expenses recorded yet.</p>}
                            </div>
                        </TabsContent>
                     </Tabs>
                </div>

            </main>
        </div>
    );
}
