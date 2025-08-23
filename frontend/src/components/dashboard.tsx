
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  IndianRupee,
  Plus,
  BookOpen,
  Home,
  UtensilsCrossed,
  Package,
  Edit2,
  Trash2,
  LucideIcon,
  Car,
  Ticket,
  Zap,
  ShoppingCart,
  Calendar as CalendarIcon,
  Heart,
  Gamepad2,
  Lightbulb,
  Smartphone
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from "@/hooks/use-toast";
import type { Category } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const getCategoryIcon = (name: string): LucideIcon => {
    const lowerCaseName = name.toLowerCase();
    if (lowerCaseName.includes('food') || lowerCaseName.includes('meal')) return UtensilsCrossed;
    if (lowerCaseName.includes('rent') || lowerCaseName.includes('stay')) return Home;
    if (lowerCaseName.includes('shop') || lowerCaseName.includes('cloth')) return ShoppingCart;
    if (lowerCaseName.includes('entertain') || lowerCaseName.includes('movie')) return Ticket;
    if (lowerCaseName.includes('edu') || lowerCaseName.includes('stud')) return BookOpen;
    if (lowerCaseName.includes('transport') || lowerCaseName.includes('gas')) return Car;
    if (lowerCaseName.includes('utilit') || lowerCaseName.includes('bill')) return Zap;
    if (lowerCaseName.includes('pocket money')) return Package;
    if (lowerCaseName.includes('health') || lowerCaseName.includes('love')) return Heart;
    if (lowerCaseName.includes('game')) return Gamepad2;
    if (lowerCaseName.includes('idea') || lowerCaseName.includes('tip')) return Lightbulb;
    if (lowerCaseName.includes('mobile') || lowerCaseName.includes('phone')) return Smartphone;
    return Package;
};

// Custom hook for managing budget state and localStorage
const useBudgetState = () => {
    const [budget, setBudget] = useState<number | null>(null);
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
        try {
            const savedBudget = localStorage.getItem('coinwise_budget');
            if (savedBudget) {
                setBudget(JSON.parse(savedBudget));
            }
        } catch (error) {
            console.error("Failed to load budget from localStorage", error);
        }
    }, []);

    useEffect(() => {
        if (isClient && budget !== null) {
            try {
                localStorage.setItem('coinwise_budget', JSON.stringify(budget));
            } catch (error) {
                console.error("Failed to save budget to localStorage", error);
            }
        }
    }, [budget, isClient]);

    const handleSetBudget = useCallback((newBudget: number) => {
        if (newBudget > 0) {
            setBudget(newBudget);
            toast({ title: "Budget Set!", description: "Your monthly budget is ready." });
        } else {
            toast({ variant: "destructive", title: "Invalid Amount", description: "Budget must be greater than zero." });
        }
    }, [toast]);

    return { budget, setBudget: handleSetBudget, isClient };
};

// Custom hook for managing categories and wallet balance
const useCategoriesState = (budget: number | null) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
        try {
            const savedCategories = localStorage.getItem('coinwise_categories');
            const savedBalance = localStorage.getItem('coinwise_wallet_balance');
            if (savedCategories) {
                setCategories(JSON.parse(savedCategories).map((c: any) => ({ ...c, icon: getCategoryIcon(c.name) })));
            }
            if (savedBalance) {
                setWalletBalance(JSON.parse(savedBalance));
            }
        } catch (error) {
            console.error("Failed to load categories/balance from localStorage", error);
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            try {
                const categoriesToSave = categories.map(({ icon, ...rest }) => rest);
                localStorage.setItem('coinwise_categories', JSON.stringify(categoriesToSave));
            } catch (error) {
                console.error("Failed to save categories to localStorage", error);
            }
        }
    }, [categories, isClient]);

    const totalAllocated = useMemo(() => categories.reduce((sum, cat) => sum + cat.allocated, 0), [categories]);
    const unallocatedBudget = useMemo(() => (budget || 0) - totalAllocated, [budget, totalAllocated]);

    const addCategory = useCallback((name: string, allocated: number, iconName: string) => {
        if (allocated > unallocatedBudget) {
            toast({ variant: "destructive", title: "Allocation Error", description: <>You can only allocate up to <IndianRupee className="w-3.5 h-3.5 inline-flex" />{unallocatedBudget.toFixed(2)}.</> });
            return;
        }
        const newCategory: Category = {
            id: Date.now().toString(),
            name,
            icon: getCategoryIcon(iconName),
            allocated,
            spent: 0,
        };
        setCategories(prev => [...prev, newCategory]);
        toast({ title: "Category Added", description: `${name} category created.` });
    }, [unallocatedBudget, toast]);

    const deleteCategory = useCallback((categoryId: string) => {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        toast({ variant: "destructive", title: "Category Deleted" });
    }, [toast]);

    const addExpense = useCallback((categoryId: string, amount: number) => {
        setCategories(prevCategories => {
            const category = prevCategories.find(c => c.id === categoryId);
            if (!category) return prevCategories;

            if (amount > walletBalance) {
                toast({ variant: "destructive", title: "Insufficient Funds", description: "You don't have enough money in your wallet." });
                return prevCategories;
            }

            const newSpent = category.spent + amount;
            if (newSpent > category.allocated) {
                toast({ variant: "destructive", title: "Budget Exceeded", description: `This expense exceeds your budget for ${category.name}.` });
            } else {
                toast({ title: "Expense Recorded", description: <div className="flex items-center"><IndianRupee className="w-4 h-4 mr-1"/>{amount.toFixed(2)} spent from {category.name}.</div> });
            }
            
            setWalletBalance(prev => prev - amount);
            return prevCategories.map(cat =>
                cat.id === categoryId ? { ...cat, spent: newSpent } : cat
            );
        });
    }, [walletBalance, toast]);

    return { categories, walletBalance, unallocatedBudget, addCategory, deleteCategory, addExpense };
};

const BudgetSetup = React.memo(({ onSetBudget }: { onSetBudget: (budget: number) => void }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newBudget = parseFloat((e.currentTarget.elements.namedItem('budget') as HTMLInputElement).value);
        onSetBudget(newBudget);
    };

    return (
        <div className="flex items-center justify-center h-full p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <IndianRupee className="w-8 h-8 text-primary" />
                        Set Your Budget
                    </CardTitle>
                    <CardDescription>Let's start by setting your monthly budget.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="budget" className="flex items-center">Total Monthly Budget (<IndianRupee className="w-4 h-4 mx-1"/>)</Label>
                            <Input id="budget" name="budget" type="number" placeholder="e.g., 10000" required min="1" step="0.01" />
                        </div>
                        <Button type="submit" className="w-full">Set Budget</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
});
BudgetSetup.displayName = 'BudgetSetup';

const BudgetSummary = React.memo(({ budget, walletBalance, categories }: { budget: number, walletBalance: number, categories: Category[] }) => {
    const { totalSpent, remainingBudget } = useMemo(() => {
        const spent = categories.reduce((sum, cat) => sum + cat.spent, 0);
        const remaining = budget - spent;
        return { totalSpent: spent, remainingBudget: remaining };
    }, [budget, categories]);

    return (
        <Card className="shadow-lg p-4 bg-white">
            <div className="grid grid-cols-3 text-center divide-x">
                <div>
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                    <p className="font-bold text-lg text-blue-600 flex items-center justify-center">
                        <IndianRupee className="w-5 h-5"/>
                        {budget.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Wallet Balance</p>
                    <p className="font-bold text-lg text-green-600 flex items-center justify-center">
                        <IndianRupee className="w-5 h-5"/>
                        {walletBalance.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="font-bold text-lg flex items-center justify-center">
                        <IndianRupee className="w-5 h-5"/>
                        {remainingBudget.toLocaleString()}
                    </p>
                </div>
            </div>
        </Card>
    );
});
BudgetSummary.displayName = 'BudgetSummary';

const CategoryCard = React.memo(({ category, onDelete, onAddExpense }: { category: Category; onDelete: () => void; onAddExpense: (amount: number) => void; }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUpiAutoPay, setIsUpiAutoPay] = useState(false);
    const [date, setDate] = useState<Date>();
    const [activeDialog, setActiveDialog] = useState<'expense' | null>(null);

    const progress = category.allocated > 0 ? (category.spent / category.allocated) * 100 : 0;
    const CategoryIcon = category.icon;

    return (
        <>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <Card className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-secondary">
                            <CategoryIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-center">
                                <p className="font-bold">{category.name}</p>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setActiveDialog('expense')}>Pay Now</Button>
                                    <Button variant="ghost" size="icon" onClick={onDelete}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center">
                                <IndianRupee className="w-3.5 h-3.5 mr-0.5"/>{category.spent.toFixed(2)} of <IndianRupee className="w-3.5 h-3.5 mx-0.5"/>{category.allocated.toFixed(2)} spent
                            </p>
                            <Progress value={progress} className="mt-2 h-2" />
                        </div>
                    </div>
                    <CollapsibleContent className="pt-4 mt-4 border-t">
                        {/* Edit form content here */}
                    </CollapsibleContent>
                </Card>
            </Collapsible>
            <Dialog open={activeDialog === 'expense'} onOpenChange={(open) => !open && setActiveDialog(null)}>
                <AddExpenseDialog category={category} onAddExpense={onAddExpense} onClose={() => setActiveDialog(null)} />
            </Dialog>
        </>
    );
});
CategoryCard.displayName = 'CategoryCard';


export default function Dashboard() {
    const { budget, setBudget, isClient } = useBudgetState();
    const { categories, walletBalance, unallocatedBudget, addCategory, deleteCategory, addExpense } = useCategoriesState(budget);
    
    if (!isClient) return null;

    if (budget === null) {
        return <BudgetSetup onSetBudget={setBudget} />;
    }

    return (
        <div className="space-y-6">
            <BudgetSummary budget={budget} walletBalance={walletBalance} categories={categories} />

            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Budget Categories</h2>
                <AddCategoryDialog onAddCategory={addCategory} unallocatedBudget={unallocatedBudget} />
            </div>

            {unallocatedBudget > 0 &&
                <div className="text-center text-muted-foreground text-sm flex items-center justify-center">
                    You have <span className="font-bold text-primary flex items-center mx-1"><IndianRupee className="w-4 h-4 mr-0.5"/>{unallocatedBudget.toFixed(2)}</span> left to allocate.
                </div>
            }

            {categories.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <h3 className="text-xl font-semibold">No categories yet!</h3>
                        <p className="text-muted-foreground mt-2">Click "Add Category" to start allocating your budget.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {categories.map(cat => (
                        <CategoryCard
                            key={cat.id}
                            category={cat}
                            onAddExpense={(amount) => addExpense(cat.id, amount)}
                            onDelete={() => deleteCategory(cat.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

const iconOptions = [
    { name: "Pocket Money", icon: Package }, { name: "Home", icon: Home },
    { name: "Education", icon: BookOpen }, { name: "Transport", icon: Car },
    { name: "Shopping", icon: ShoppingCart }, { name: "Gaming", icon: Gamepad2 },
    { name: "Tips", icon: Lightbulb }, { name: "Bills", icon: Zap },
    { name: "Mobile", icon: Smartphone }, { name: "Health", icon: Heart },
];

const AddCategoryDialog: React.FC<{onAddCategory: (name: string, allocated: number, iconName: string) => void, unallocatedBudget: number}> = ({onAddCategory, unallocatedBudget}) => {
    const [name, setName] = useState('');
    const [allocated, setAllocated] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].name);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCategory(name, parseFloat(allocated), selectedIcon);
        setName('');
        setAllocated('');
        setSelectedIcon(iconOptions[0].name);
        setIsOpen(false); 
    }

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
              <Button onClick={() => setIsOpen(true)} disabled={unallocatedBudget <= 0} size="sm">
                <Plus className="w-4 h-4 mr-2" /> Add Category
              </Button>
          </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="cat-name">Category Name</Label>
                <Input id="cat-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Entertainment, Sports" required />
            </div>
            
            <div className="space-y-2">
                <Label>Choose Icon</Label>
                <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map(({name: iconName, icon: Icon}) => (
                        <Button
                            key={iconName}
                            type="button"
                            variant={selectedIcon === iconName ? "secondary" : "outline"}
                            className="flex flex-col h-16"
                            onClick={() => setSelectedIcon(iconName)}
                        >
                            <Icon className="w-6 h-6 mb-1" />
                            <span className="text-xs">{iconName}</span>
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="cat-allocated">Initial Budget Amount</Label>
                <Input id="cat-allocated" value={allocated} onChange={e => setAllocated(e.target.value)} type="number" placeholder="Enter amount" required min="0.01" step="0.01" max={unallocatedBudget} />
                <p className="text-xs text-muted-foreground flex items-center">Unallocated budget: <IndianRupee className="w-3 h-3 mx-0.5" />{unallocatedBudget.toFixed(2)}</p>
            </div>
            <DialogFooter>
                 <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                 </DialogClose>
                 <Button type="submit">Create Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
}

const AddExpenseDialog: React.FC<{category: Category, onAddExpense: (amount: number) => void, onClose: () => void}> = ({ category, onAddExpense, onClose }) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddExpense(parseFloat(amount));
        setAmount('');
        onClose();
    }
    
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Spend from {category.name}</DialogTitle>
                 <CardDescription className="flex items-center">
                    Remaining: <IndianRupee className="w-4 h-4 mx-1" />{(category.allocated - category.spent).toFixed(2)}
                 </CardDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="exp-amount" className="flex items-center">Expense Amount (<IndianRupee className="w-3.5 h-3.5 mx-1" />)</Label>
                    <Input id="exp-amount" value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder="e.g., 125.50" required min="0.01" step="0.01" max={category.allocated - category.spent} autoFocus />
                </div>
                 <DialogFooter>
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Record Expense</Button>
                 </DialogFooter>
            </form>
        </DialogContent>
    )
}

    