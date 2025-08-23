
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Category } from '@/lib/types';
import { IndianRupee, ArrowUpRight, ArrowDownLeft, TrendingUp, ArrowLeft, Menu, CalendarDays, PlusCircle, UtensilsCrossed, Car } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SettingsSheet } from '@/components/settings-sheet';

interface Transaction {
  id: string;
  type: 'expense' | 'income' | 'allocation';
  category: string;
  description: string;
  amount: number;
  date: string;
  icon: React.ElementType;
}

const getCategoryIcon = (name: string): React.ElementType => {
  const lowerCaseName = name.toLowerCase();
  if (lowerCaseName.includes('food') || lowerCaseName.includes('mess')) return UtensilsCrossed;
  if (lowerCaseName.includes('transport') || lowerCaseName.includes('bus')) return Car;
  return PlusCircle;
};

const HistoryHeader = () => (
    <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b">
        <div className="container mx-auto flex items-center h-20 px-4">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </Button>
            <h1 className="text-xl font-bold ml-2">Transactions</h1>
            <div className="flex-1" />
            <SettingsSheet>
                <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                </Button>
            </SettingsSheet>
        </div>
    </header>
);

export default function HistoryPage() {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        try {
          // Load transactions from wallet history
          const savedWalletTxs = localStorage.getItem('coinwise_wallet_transactions');
          let newTransactions: Transaction[] = savedWalletTxs ? JSON.parse(savedWalletTxs).map((tx: any) => ({...tx, date: new Date().toISOString(), icon: getCategoryIcon(tx.category) })) : [];

          // Load transactions from budget categories (allocations and expenses)
          const savedCategories = localStorage.getItem('coinwise_categories');
          if (savedCategories) {
            const cats: Omit<Category, 'icon'>[] = JSON.parse(savedCategories);
            
            cats.forEach(cat => {
                // Add allocation as income type for history
                if (cat.allocated > 0) {
                     newTransactions.push({
                        id: `alloc-${cat.id}-${cat.allocated}`,
                        type: 'allocation',
                        category: cat.name,
                        description: `Funds allocated to ${cat.name}`,
                        amount: cat.allocated,
                        date: new Date().toISOString(),
                        icon: getCategoryIcon(cat.name)
                     });
                }
                // Expenses are already in wallet txs, so we don't double-add
            });
          }
            
          newTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setAllTransactions(newTransactions);
        } catch (error) {
          console.error("Failed to load from localStorage", error);
        }
    }
  }, [isClient]);

  const filteredTransactions = useMemo(() => {
      return allTransactions.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate.getMonth() + 1 === parseInt(selectedMonth) && txDate.getFullYear() === parseInt(selectedYear);
      });
  }, [allTransactions, selectedMonth, selectedYear]);

  const { income, expenses, net } = useMemo(() => {
      const income = filteredTransactions.filter(tx => tx.type === 'income' || tx.type === 'allocation').reduce((sum, tx) => sum + tx.amount, 0);
      const expenses = filteredTransactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
      return { income, expenses, net: income - expenses };
  }, [filteredTransactions]);


  const months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ];
  
  const years = ['2023', '2024', '2025'];

  if (!isClient) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <HistoryHeader />
      <div className="p-4 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="w-5 h-5"/>
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                      <SelectContent>
                          {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                      </SelectContent>
                  </Select>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                      <SelectContent>
                          {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                      </SelectContent>
                  </Select>
              </div>
               <div className="grid grid-cols-3 gap-4 text-center">
                    <Card className="p-3 bg-green-50 border-green-200">
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><ArrowUpRight className="w-4 h-4 text-green-600"/>Income</p>
                        <p className="font-bold text-lg flex items-center justify-center"><IndianRupee className="w-4 h-4"/>{income.toFixed(2)}</p>
                    </Card>
                     <Card className="p-3 bg-red-50 border-red-200">
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><ArrowDownLeft className="w-4 h-4 text-red-600"/>Expenses</p>
                        <p className="font-bold text-lg flex items-center justify-center"><IndianRupee className="w-4 h-4"/>{expenses.toFixed(2)}</p>
                    </Card>
                     <Card className="p-3 bg-blue-50 border-blue-200">
                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><TrendingUp className="w-4 h-4 text-blue-600"/>Net</p>
                        <p className="font-bold text-lg flex items-center justify-center"><IndianRupee className="w-4 h-4"/>{net.toFixed(2)}</p>
                    </Card>
                </div>
          </CardContent>
        </Card>

        <div>
            <h2 className="text-lg font-bold mb-4">{months.find(m=>m.value === selectedMonth)?.label} {selectedYear} Activity</h2>
            <div className="space-y-3">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => {
                  const txType = tx.type === 'income' || tx.type === 'allocation' ? 'income' : 'expense';
                  return (
                    <Card key={tx.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${txType === 'expense' ? 'bg-red-100/50' : 'bg-green-100/50'}`}>
                                <tx.icon className={`w-6 h-6 ${txType === 'expense' ? 'text-red-600' : 'text-green-600'}`} />
                            </div>
                            <div>
                                <p className="font-bold">{tx.category}</p>
                                <p className="text-sm text-muted-foreground">
                                    {tx.description} &bull; {new Date(tx.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <p className={`font-bold text-lg flex items-center ${txType === 'expense' ? 'text-destructive' : 'text-green-600'}`}>
                            {txType === 'expense' ? '-' : '+'}
                            <IndianRupee className="w-4 h-4"/>{tx.amount.toFixed(2)}
                        </p>
                    </Card>
                  )
                })
              ) : (
                <Card className="text-center py-12">
                    <CardContent>
                        <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground" />
                        <h3 className="text-xl font-semibold mt-4">No transactions found for {months.find(m=>m.value === selectedMonth)?.label} {selectedYear}.</h3>
                        <p className="text-muted-foreground mt-2">Try selecting a different month or year.</p>
                    </CardContent>
                </Card>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
    
